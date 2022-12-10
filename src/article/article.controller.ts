import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseIdsPipe } from 'src/common/decorators/ids.pipe';
import { ArticleService } from './article.service';
import { ManyArticlesResponseDto, OneArticleResponseDto } from './dto/response-article.dto';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  //Todo: 가드 작업 완료 후 추가할 예정
  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto): Promise<OneArticleResponseDto> {
    return null;
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    description: '검색을 위한 검색어를 담고 있습니다',
    example: '뇽뇽',
  })
  findAll(@Query('search') search: string): Promise<ManyArticlesResponseDto> {
    return null;
  }

  @Get(':userId')
  findOne(@Param('userId') id: string): Promise<ManyArticlesResponseDto> {
    return null;
  }

  @Put(':articleId')
  update(@Param('articleId') id: string, @Body() updateArticleDto: CreateArticleDto): Promise<OneArticleResponseDto> {
    return null;
  }

  // @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'articleIds',
    description: '제거할 id들을 받아옵니다. bulk api일 경우 1,2,3,4 가 가능함',
    example: '1 또는 1,2,3,4',
  })
  @Delete(':articleIds')
  remove(@Param('ids', new ParseIdsPipe()) id: Array<number>) {}
}
