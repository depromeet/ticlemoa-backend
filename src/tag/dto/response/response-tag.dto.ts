import { ApiProperty } from '@nestjs/swagger';

export class OneTagResponseDto {
  userId: number;
  id: number;
  tagName: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(property: { userId: number; id: number; tagName: string; createdAt: Date; updatedAt: Date }) {
    this.userId = property.userId;
    this.id = property.id;
    this.tagName = property.tagName;
    this.createdAt = property.createdAt;
    this.updatedAt = property.updatedAt;
  }
}

export class ManyTagsResponseDto {
  tags: OneTagResponseDto[];
}
