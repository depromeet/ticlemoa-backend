import { ApiProperty } from '@nestjs/swagger';

export class OneArticleResponseDto {
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
export class ManyArticlesResponseDto {
  articles: OneArticleResponseDto[];
}
