import { ApiProperty } from '@nestjs/swagger';
import { Article } from 'src/entities/article.entity';

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
    imageUrl: string,
  ) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.content = content;
    this.viewCount = viewCount;
    this.isPublic = isPublic;
    this.userId = userId;
    this.tagIds = articleTagIds;
    this.imageUrl = imageUrl;
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
      article.imageUrl,
    );
  }
}

export class ManyArticlesResponseDto {
  articles: ArticleResponseDto[];
}
