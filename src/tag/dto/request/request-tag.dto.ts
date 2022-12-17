import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '태그 이름', example: '디프만' })
  tagName: string;
}
