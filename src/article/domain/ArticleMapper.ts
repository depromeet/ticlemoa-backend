import { Article } from 'src/entities/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';

export class ArticleMapper {
  private article: Article = new Article();

  constructor(articleCreateDto: CreateArticleDto, id?: number) {
    this.article.content = articleCreateDto.content;
    this.article.isPublic = articleCreateDto.isPublic;
    this.article.title = articleCreateDto.title;
    this.article.url = articleCreateDto.url;
    this.article.userId = articleCreateDto.userId;
    if (id) {
      this.article.id = id;
    }
  }

  getArticle(): Article {
    return this.article;
  }
}
