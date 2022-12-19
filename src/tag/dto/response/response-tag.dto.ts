import { ApiProperty } from '@nestjs/swagger';

export class OneTagResponseDto {
  @ApiProperty({ description: '유저 고유 id', example: 1 })
  userId: number;

  @ApiProperty({ description: '태그 id', example: 1 })
  id: number;

  @ApiProperty({ description: '태그 이름', example: '디프만' })
  tagName: string;

  @ApiProperty({ description: '태그 생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '태그 수정 시간' })
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
  @ApiProperty({
    description: '태그 오브젝트 리스트',
    example: [
      {
        id: 18,
        userId: 14,
        tagName: '디프만 짱',
        createdAt: '2022-12-17T17:18:19.014Z',
        updatedAt: '2022-12-17T17:18:19.014Z',
      },
    ],
  })
  tags: OneTagResponseDto[];
}
