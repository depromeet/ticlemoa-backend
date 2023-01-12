import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { UserPayload } from 'src/auth/types/jwt-payload.interface';
import { ParseIdsPipe } from 'src/common/decorators/ids.pipe';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { DeleteResult } from 'typeorm';
import { ArticleService } from './article.service';
import { OgInfoMapper } from './domain/OgInfoMapper';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetOgInfoDto } from './dto/get-oginfo.dto';
import { ArticleResponseDto, ManyArticlesResponseDto, OneArticleResponseDto } from './dto/response-article.dto';
import { OgInfoResponseDto } from './dto/response-oginfo.dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Auth()
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<OneArticleResponseDto> {
    return await this.articleService.create(createArticleDto);
  }

  @Post('info')
  async getOgInfo(@Body() getOgInfoDto: GetOgInfoDto): Promise<OgInfoResponseDto> {
    const ogInfo = await this.articleService.getOgInfo(getOgInfoDto);
    return OgInfoMapper.toResponseDto(ogInfo);
  }

  @Get()
  @Auth()
  @ApiQuery({
    name: 'search',
    required: false,
    description: '검색을 위한 검색어를 담고 있습니다',
    example: '뇽뇽',
  })
  async findAll(
    @Query('search') search: string,
    @UserRequest() { userId }: UserPayload,
  ): Promise<ManyArticlesResponseDto> {
    const articles: ArticleResponseDto[] = await this.articleService.findAll(userId, decodeURIComponent(search));
    return { articles };
  }

  @Auth()
  @ApiQuery({
    name: 'tagId',
    required: false,
  })
  @Get(':userId')
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('tagId') tagId?: string,
  ): Promise<ManyArticlesResponseDto> {
    const articles: ArticleResponseDto[] = await this.articleService.findByUser(userId, tagId);
    return { articles };
  }

  @Auth()
  @Put(':articleId')
  async update(
    @Param('articleId', ParseIntPipe) id: number,
    @Body() updateArticleDto: CreateArticleDto,
  ): Promise<OneArticleResponseDto> {
    return this.articleService.update(updateArticleDto, id);
  }

  @Auth()
  @ApiParam({
    name: 'articleIds',
    description: '제거할 id들을 받아옵니다. bulk api일 경우 1,2,3,4 가 가능함',
    example: '1 또는 1,2,3,4',
  })
  @Delete(':articleIds')
  async remove(
    @Param('articleIds', ParseIdsPipe) id: number[],
    @UserRequest() { userId }: UserPayload,
  ): Promise<DeleteResult> {
    return await this.articleService.remove(id, userId);
  }
}
