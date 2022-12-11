import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article: Article = new ArticleMapper(createArticleDto).getArticle();
    return await this.articleRepository.save(article);
  }