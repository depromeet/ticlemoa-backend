import { IsNumber } from 'class-validator';

export class ResponseBlacklistDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  targetId: number;
}
