import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationRequestDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: '페이지네이션 페이지' })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ description: '페이지네이션 개수' })
  take?: number;
}
