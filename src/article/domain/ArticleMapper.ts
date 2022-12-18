import { Article } from 'src/entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';

export class ArticleMapper {
  private article: Article = new Article();

  constructor(articleCreateDto: CreateArticleDto, id?: number) {
    this.article.content = articleCreateDto.content;
    this.article.isPublic = articleCreateDto.isPublic;
    // Todo: tag Ids
    // this.article.=articleCreateDto.tagIds
    this.article.title = articleCreateDto.title;
    this.article.link = articleCreateDto.url;
    //Todo : userId 생성 과정을 밟고 난 이후에는 수정할 것
    // this.article.userId = articleCreateDto.userId;
    this.article.userId = 1;
    if (id) {
      this.article.id = id;
    }
  }
  getArticle(): Article {
    return this.article;
  }
}
