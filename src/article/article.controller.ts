import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ParseIdsPipe } from 'src/common/decorators/ids.pipe';
import { ArticleService } from './article.service';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  //Todo: 가드 작업 완료 후 추가할 예정
  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {}

  @Get()
  findAll() {}

  @Get(':userId')
  findOne(@Param('userId') id: string) {}

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: CreateArticleDto) {}

  // @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'ids',
    description: '제거할 id들을 받아옵니다. bulk api일 경우 1,2,3,4 가 가능함',
    example: '1,2,3,4',
  })
  @Delete(':ids')
  remove(@Param('ids', new ParseIdsPipe()) id: Array<number>) {}
}
