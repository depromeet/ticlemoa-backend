import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Article } from 'src/entities/article.entity';
import { Tag } from 'src/entities/tag.entity';
import { ArticleResponseDto } from '../dto/response-article.dto';
import { CreateOpensearchArticleDto } from './opensearch.create-article.dto';

@Injectable()
export class OpenSearchService {
  private url: string;
  private _DOC = '/_doc/';
  constructor(private readonly configService: ConfigService) {
    this.url = configService.get('OPENSEARCH_URL') + '/article-testing';
  }

  update(article: Article, tags: Tag[]) {
    const createOpensearchArticleDto = new CreateOpensearchArticleDto(article, tags);

    axios
      .put(this.url + this._DOC + article.id, createOpensearchArticleDto)
      .catch(() => console.log('저장 실패', article));
  }

  deleteByIds(articleIds: number[]) {
    Promise.all(
      articleIds.map((articleId) => {
        axios.delete(this.url + this._DOC + articleId);
      }),
    ).catch(() => console.log('삭제 실패', articleIds));
  }

  async findBySearchAndFilterBlacklist(
    search: string,
    isPublic: string,
    blacklistIds: number[],
  ): Promise<ArticleResponseDto[]> {
    // const articles: Article[] = await this.articleRepository
    //   .createQueryBuilder('article')
    //   .leftJoinAndSelect('article.articleTags', 'articleTags')
    //   .leftJoinAndSelect('articleTags.tag', 'tag')
    //   .where('article.title LIKE :search', { search })
    //   .where('article.content LIKE :search', { search })
    //   .where('tag.tagName LIKE :search', { search })
    //   .getMany();
    // return articles
    //   .filter((article) => !blacklistIds.includes(article.userId))
    //   .map((article) => new ArticleResponseDto(article));
    const queryObject = this.createQueryObject(search, isPublic, blacklistIds);

    return null;
  }

  createQueryObject(search: string, isPublic: string, blacklistIds: number[]) {
    const queryObject = {
      query: {
        bool: {
          must: [
            {
              match: {
                title: search,
                content: search,
              },
            },
          ],
          must_not: {
            userId: blacklistIds,
          },
        },
      },
    };
  }
}
