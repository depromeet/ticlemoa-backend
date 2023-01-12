import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Article } from 'src/entities/article.entity';
import { Tag } from 'src/entities/tag.entity';
import { ArticleResponseDto } from '../dto/response-article.dto';
import { CreateOpensearchArticleDto } from './opensearch.create-article.dto';
import { QueryType, SearchResponseType } from './opensearch.find.type';

@Injectable()
export class OpenSearchService {
  private url: string;
  private _DOC = '/_doc/';
  private SEARCH = '/_search';
  constructor(private readonly configService: ConfigService) {
    this.url = configService.get('OPENSEARCH_URL') + '/article-testing1';
  }

  update(article: Article, tags: Tag[]) {
    const createOpensearchArticleDto = new CreateOpensearchArticleDto(article, tags);

    axios
      .put(this.url + this._DOC + article.id, createOpensearchArticleDto, {
        timeout: 1000,
      })
      .catch(() => console.log('저장 실패', article));
  }

  deleteByIds(articleIds: number[]) {
    Promise.all(
      articleIds.map((articleId) => {
        axios.delete(this.url + this._DOC + articleId, {
          timeout: 1000,
        });
      }),
    ).catch(() => console.log('삭제 실패', articleIds));
  }

  async findBySearchAndFilterBlacklist(
    search: string,
    isPublic: string,
    blacklistIds: number[],
    target: string,
    userId: number,
  ): Promise<ArticleResponseDto[]> {
    const queryObject: QueryType = this.createQueryObject(search, isPublic, blacklistIds, target, userId);

    try {
      const { data }: SearchResponseType = await axios({
        url: this.url + this.SEARCH,
        method: 'get',
        data: queryObject,
        timeout: 1000,
      });
      return ArticleResponseDto.fromSearchResultArray(data.hits.hits);
    } catch (e) {
      console.log(e.response.data);
      throw new BadRequestException('잘못된 요청입니다');
    }
  }

  private createQueryObject(
    search: string,
    isPublic: string,
    blacklistIds: number[],
    target: string,
    userId: number,
  ): QueryType {
    const queryObject: QueryType = {
      query: {
        bool: {
          must: [],
          should: [
            {
              match: {
                title: search,
              },
            },
            {
              match: {
                content: search,
              },
            },
            {
              match: {
                tags: search,
              },
            },
            {
              term: {
                url: search,
              },
            },
          ],
          must_not: [
            ...blacklistIds.map((blacklistId) => ({
              term: {
                userId: blacklistId,
              },
            })),
          ],
          filter: [],
        },
      },
    };
    this.addPublicOption(queryObject, isPublic);
    this.addTarget(queryObject, target, userId);
    return queryObject;
  }

  private addPublicOption(queryObject: QueryType, isPublic: string): void {
    switch (isPublic) {
      case 'true':
        queryObject.query.bool.must.push(this.createTermOption('isPublic', true));
        break;
      case 'false':
        queryObject.query.bool.must.push(this.createTermOption('isPublic', false));
        break;
    }
  }

  private createTermOption(key: string, value: any) {
    const temp: any = {};
    temp[key] = value;
    return {
      term: temp,
    };
  }

  private addTarget(queryObject: QueryType, target: string, userId: number): void {
    switch (target) {
      case 'self':
        queryObject['post_filter'] = this.createTermOption('userId', userId);
    }
  }
}
