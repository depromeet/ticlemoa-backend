import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateArticleDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  content: string;

  @IsUrl()
  url: string;

  @IsUrl()
  @IsOptional()
  imageUrl: string;

  @IsBoolean()
  isPublic = false;

  @IsNumber({}, { each: true })
  tagIds: Array<number>;
}
