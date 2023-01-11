import { BadRequestException, Injectable } from '@nestjs/common';
import { BlacklistRepository } from 'src/blacklist/repository/blacklist.repository';
import { Article } from 'src/entities/article.entity';
import { ArticleTag } from 'src/entities/articleTag.entity';
import { DeleteResult, In } from 'typeorm';
import { ArticleMapper } from './domain/ArticleMapper';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseDto } from './dto/response-article.dto';
import { ArticleRepository } from './repository/article.repository';
import { ArticleTagRepository } from './repository/articleTag.repository';
import * as ogs from 'open-graph-scraper';
import { GetOgInfoDto } from './dto/get-oginfo.dto';
import { TagRepository } from 'src/tag/repository/tag.repository';
import { Tag } from 'src/entities/tag.entity';
import { OpenSearchService } from './opensearch/opensearch.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleTagRepository: ArticleTagRepository,
    private readonly blacklistRepository: BlacklistRepository,
    private readonly tagRepository: TagRepository,
    private readonly openSearchService: OpenSearchService,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article: Article = new ArticleMapper(createArticleDto).getArticle();
    const tags: Tag[] = await Promise.all(
      createArticleDto.tagIds.map(async (tagId) =>
        this.tagRepository.findOne({
          where: {
            id: tagId,
          },
        }),
      ),
    );
    if (this.includeNotMyTag(tags, createArticleDto.userId)) {
      throw new BadRequestException('사용자가 잘못된 태그를 사용했습니다');
    }
    const savedArticle: Article = await this.articleRepository.save(article);
    const articleTags: ArticleTag[] = tags.map((tag: Tag) => ArticleTag.of(tag.id, savedArticle.id));
    await this.articleTagRepository.save(articleTags);
    this.openSearchService.update(savedArticle, tags);
    return savedArticle;
  }

  private includeNotMyTag(tags: Tag[], userId: number): boolean {
    if (tags.includes(null)) {
      return true;
    }
    return tags.filter((tag) => tag.userId != userId).length != 0;
  }

  async update(updateArticleDto: CreateArticleDto, id: number): Promise<Article> {
    const article: Article = new ArticleMapper(updateArticleDto, id).getArticle();
    const tags: Tag[] = await this.tagRepository.find({
      where: {
        id: In(updateArticleDto.tagIds),
      },
    });

    if (this.includeNotMyTag(tags, updateArticleDto.userId)) {
      throw new BadRequestException('사용자가 잘못된 태그를 사용했습니다');
    }
    await this.articleTagRepository.deleteByArticleId(id);
    const articleTags: ArticleTag[] = tags.map((tag: Tag) => ArticleTag.of(tag.id, id));
    await this.articleTagRepository.save(articleTags);
    const savedArticle = await this.articleRepository.save(article);
    this.openSearchService.update(savedArticle, tags);

    return savedArticle;
  }

  async remove(ids: number[], userId: number): Promise<DeleteResult> {
    const articles: Article[] = await this.articleRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (this.containsNotMyArticle(articles, userId)) {
      throw new BadRequestException('사용자가 작성한 게시글이 아닙니다');
    }
    const articleIds = articles.map((article) => article.id);
    this.openSearchService.deleteByIds(articleIds);
    return await this.articleRepository.softDelete(ids);
  }

  private containsNotMyArticle(articles: Article[], userId: number) {
    return articles.filter((article) => article.userId !== userId).length !== 0;
  }

  async findAll(userId: number, isPublic: string, search: string): Promise<ArticleResponseDto[]> {
    const blacklists = await this.blacklistRepository.findAllBlacklistByUserId(userId);
    const blacklistIds: number[] = blacklists.map((it) => it.targetId);
    return await this.openSearchService.findBySearchAndFilterBlacklist(search, isPublic, blacklistIds);
  }

  async findByUser(userId: number, isPublic: string, tagId?: string): Promise<ArticleResponseDto[]> {
    const articles: Article[] = await this.articleRepository.findByUserIdAndTag(userId, isPublic, tagId);
    return articles?.map((article) => new ArticleResponseDto(article));
  }

  async getOgInfo({ url }: GetOgInfoDto): Promise<any> {
    try {
      const page = await ogs({ url, timeout: { request: 5000 } });
      const ogJson = page.result;
      return ogJson;
    } catch {
      throw new BadRequestException();
    }
  }
}
