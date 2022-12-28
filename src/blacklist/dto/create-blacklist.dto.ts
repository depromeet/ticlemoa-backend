import { IsNumber } from 'class-validator';

export class CreateBlacklistDto {
  @IsNumber()
  targetId: number;
}
