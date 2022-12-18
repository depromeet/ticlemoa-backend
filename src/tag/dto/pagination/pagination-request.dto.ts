import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationRequestDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: '페이지네이션 페이지' })
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: '페이지네이션 개수' })
  take?: number = 10;
}
