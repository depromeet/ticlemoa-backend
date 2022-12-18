import { Injectable } from '@nestjs/common';
import { Article } from 'src/entities/article.entity';
import { DeleteResult } from 'typeorm';
import { ArticleMapper } from './domain/ArticleMapper';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleRepository } from './repository/article.repository';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article: Article = new ArticleMapper(createArticleDto).getArticle();
    return await this.articleRepository.save(article);
  }

  async update(updateArticleDto: CreateArticleDto, id: number): Promise<Article> {
    const article: Article = new ArticleMapper(updateArticleDto, id).getArticle();
    return await this.articleRepository.save(article);
  }

  async remove(ids: number[]): Promise<DeleteResult> {
    return await this.articleRepository.softDelete(ids);
  }

  async findAll(search: string): Promise<Article[]> {
    return await this.articleRepository
      .createQueryBuilder('article')
      .where('article.title LIKE :search', { search })
      .where('article.content LIKE :search', { search })
      .execute();
  }

  async findByUser(userId: number): Promise<Article[]> {
    return await this.articleRepository.find({
      where: {
        userId,
      },
    });
  }
}
