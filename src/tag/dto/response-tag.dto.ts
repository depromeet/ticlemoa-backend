import { ApiProperty } from '@nestjs/swagger';

export class OneTagResponseDto {
  userId: number;
  id: number;
  tagName: string;
  @ApiProperty({ nullable: true })
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ManyArticlesResponseDto {
  tags: OneTagResponseDto[];
}
