import { Injectable } from '@nestjs/common';
import { BlacklistRepository } from 'src/blacklist/repository/blacklist.repository';
import { Article } from 'src/entities/article.entity';
import { ArticleTag } from 'src/entities/articleTag.entity';
import { DeleteResult } from 'typeorm';
import { ArticleMapper } from './domain/ArticleMapper';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseDto } from './dto/response-article.dto';
import { ArticleRepository } from './repository/article.repository';
import { ArticleTagRepository } from './repository/articleTag.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleTagRepository: ArticleTagRepository,
    private readonly blacklistRepository: BlacklistRepository,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article: Article = new ArticleMapper(createArticleDto).getArticle();
    const saved: Article = await this.articleRepository.save(article);
    const articleTags: ArticleTag[] = createArticleDto.tagIds.map((tagId: number) => {
      const articleTag: ArticleTag = new ArticleTag();
      articleTag.articleId = saved.id;
      articleTag.tagId = tagId;
      return articleTag;
    });
    await this.articleTagRepository.save(articleTags);
    return saved;
  }

  async update(updateArticleDto: CreateArticleDto, id: number): Promise<Article> {
    const article: Article = new ArticleMapper(updateArticleDto, id).getArticle();
    return await this.articleRepository.save(article);
  }

  async remove(ids: number[], userId: number): Promise<DeleteResult> {
    //todo: 자기가 작성한 user가 아니라면 예외
    return await this.articleRepository.softDelete(ids);
  }

  async findAll(userId: number, search: string): Promise<ArticleResponseDto[]> {
    const blacklists = await this.blacklistRepository.findAllBlacklistByUserId(userId);
    const blacklistIds: number[] = blacklists.map((it) => it.targetId);
    const articles: Article[] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.articleTags', 'articleTags')
      .leftJoinAndSelect('articleTags.tag', 'tag')
      .where('article.title LIKE :search', { search })
      .where('article.content LIKE :search', { search })
      .where('tag.tagName LIKE :search', { search })
      .getMany();
    return articles
      .filter((article) => !blacklistIds.includes(article.userId))
      .map((article) => new ArticleResponseDto(article));
  }

  async findByUser(userId: number, tagId?: string): Promise<ArticleResponseDto[]> {
    const articles: Article[] = await this.articleRepository.findByUserIdAndTag(userId, tagId);
    return articles?.map((article) => new ArticleResponseDto(article));
  }
}
