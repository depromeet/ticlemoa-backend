import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateArticleDto {
  @IsNumber()
  userId: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  content: string;

  @IsUrl()
  url: string;

  @IsBoolean()
  isPublic: boolean;

  @IsNumber({}, { each: true })
  tagIds: Array<number>;
}
