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
  constructor(article: Article) {
    this.id = article.id;
    this.url = article.url;
    this.title = article.title;
    this.content = article.content;
    this.viewCount = article.viewCount;
    this.isPublic = article.isPublic;
    this.userId = article.userId;
    this.tagIds = article.articleTags.map((articleTag) => articleTag.tagId);
  }
}

export class ManyArticlesResponseDto {
  articles: ArticleResponseDto[];
}
