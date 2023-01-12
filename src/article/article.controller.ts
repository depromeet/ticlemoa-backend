import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import axios from 'axios';
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
  constructor(private readonly articleService: ArticleService, private readonly config: ConfigService) {}

  @ApiExcludeEndpoint()
  @Get('/testing/:port')
  async test(@Param('port') port: string) {
    const opensearchUrl = this.config.get('OPENSEARCH_URL');
    console.log(opensearchUrl);
    try {
      const first = await axios.get(opensearchUrl, { timeout: 1000 });
      console.log('first', first.data);
      const second = await axios.get(opensearchUrl + ':' + port, { timeout: 1000 });
      console.log('second', second.data);
    } catch (e) {}
    return await axios.get(opensearchUrl, { timeout: 1000 });
  }

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
  @ApiQuery({
    name: 'isPublic',
    required: false,
    description: '아무것도 주어지지 않는다면 전체를 검색합니다',
    example: 'true, false, all을 String으로 넣어주시면 됩니다',
  })
  @ApiQuery({
    name: 'target',
    required: false,
    description: '아무것도 주어지지 않는다면 개인을 검색합니다',
    example: 'all, self를 String으로 넣어주시면 됩니다',
  })
  async findAll(
    @Query('search') search: string,
    @UserRequest() { userId }: UserPayload,
    @Query('isPublic') isPublic: string,
    @Query('target') target: string,
  ): Promise<ManyArticlesResponseDto> {
    isPublic = this.validateIsPublic(isPublic);
    target = this.validateTarget(target);
    const articles: ArticleResponseDto[] = await this.articleService.findAll(
      userId,
      isPublic,
      decodeURIComponent(search),
      target,
    );
    return { articles };
  }

  private validateIsPublic(isPublic?: string) {
    switch (isPublic) {
      case undefined:
      case 'all':
        isPublic = 'all';
        break;
      case 'true':
        isPublic = 'true';
        break;
      case 'false':
        isPublic = 'false';
        break;
      default:
        throw new BadRequestException('잘못된 값이 들어왔습니다');
    }
    return isPublic;
  }

  private validateTarget(target?: string) {
    switch (target) {
      case undefined:
      case 'self':
        target = 'self';
        break;
      case 'all':
        target = 'all';
        break;
      default:
        throw new BadRequestException('잘못된 값이 들어왔습니다');
    }
    return target;
  }

  @ApiQuery({
    name: 'tagId',
    required: false,
  })
  @ApiQuery({
    name: 'isPublic',
    required: false,
    description: '아무것도 주어지지 않는다면 전체를 검색합니다',
    example: 'true, false, all을 String으로 넣어주시면 됩니다',
  })
  @Get(':userId')
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('isPublic') isPublic?: string,
    @Query('tagId') tagId?: string,
  ): Promise<ManyArticlesResponseDto> {
    isPublic = this.validateIsPublic(isPublic);
    const articles: ArticleResponseDto[] = await this.articleService.findByUser(userId, isPublic, tagId);
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
