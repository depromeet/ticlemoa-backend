import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTagRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '수정할 태그 내용', example: '디프만 짱짱' })
  tagName: string;
}
