import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { UserPayload } from 'src/auth/types/jwt-payload.interface';
import { ParseIdsPipe } from 'src/common/decorators/ids.pipe';
import { UserRequest } from 'src/common/decorators/user-request.decorator';
import { Article } from 'src/entities/article.entity';
import { DeleteResult } from 'typeorm';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ManyArticlesResponseDto, OneArticleResponseDto } from './dto/response-article.dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Auth()
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<OneArticleResponseDto> {
    return await this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    description: '검색을 위한 검색어를 담고 있습니다',
    example: '뇽뇽',
  })
  async findAll(@Query('search') search: string): Promise<ManyArticlesResponseDto> {
    const articles: Article[] = await this.articleService.findAll(search);
    return { articles };
  }

  @Get(':userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<ManyArticlesResponseDto> {
    const articles: Article[] = await this.articleService.findByUser(userId);
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
