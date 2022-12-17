import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ description: '유저 id', example: 1 })
  userId: number;

  @ApiProperty({ description: '태그 이름', example: '디프만' })
  tagName: string;
}
