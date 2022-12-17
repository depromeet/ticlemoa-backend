import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationRequestDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  take?: number = 10;
}
