import { IsNotEmpty, IsNumber } from 'class-validator';

export class jwtPayload {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
