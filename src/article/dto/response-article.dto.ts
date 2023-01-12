import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/entities/article.entity';
import { OneSearchType } from '../opensearch/opensearch.find.type';

export class OneArticleResponseDto {
  id: number;
  url: string;
  @ApiProperty({ nullable: true })
  title?: string;
  @ApiProperty({ nullable: true })
  content?: string;
  viewCount: number;
  isPublic: boolean;
  userId: number;
  @ApiProperty({ nullable: true })
  imageUrl?: string;
}

export class ArticleResponseDto {
  private id: number;
  private url: string;
  @ApiProperty({ nullable: true })
  private title?: string;
  @ApiProperty({ nullable: true })
  private content?: string;
  private viewCount: number;
  private isPublic: boolean;
  private userId: number;
  @ApiProperty({ nullable: true })
  private imageUrl?: string;
  private tagIds: number[];
  private constructor(
    id: number,
    url: string,
    title: string,
    content: string,
    viewCount: number,
    isPublic: boolean,
    userId: number,
    articleTagIds: number[],
  ) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.content = content;
    this.viewCount = viewCount;
    this.isPublic = isPublic;
    this.userId = userId;
    this.tagIds = articleTagIds;
  }

  static fromArticle(article: Article): ArticleResponseDto {
    return new ArticleResponseDto(
      article.id,
      article.url,
      article.title,
      article.content,
      article.viewCount,
      article.isPublic,
      article.userId,
      article.articleTags.map((articleTag) => articleTag.tagId),
    );
  }

  static fromSearchResultArray(searchResult: OneSearchType[]): ArticleResponseDto[] {
    return searchResult.map((oneResult) => this.fromOneSearchResult(oneResult._source));
  }

  private static fromOneSearchResult(oneResult: OneSearchType['_source']): ArticleResponseDto {
    return new ArticleResponseDto(
      oneResult.id,
      oneResult.url,
      oneResult.title,
      oneResult.content,
      //viewCount 로직은 현재 없기에 0으로 만들어 두었습니다
      0,
      oneResult.isPublic,
      oneResult.userId,
      oneResult.tagIds,
    );
  }
}

export class ManyArticlesResponseDto {
  articles: ArticleResponseDto[];
}
