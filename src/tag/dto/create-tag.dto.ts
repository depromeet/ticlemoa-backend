import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTagDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  tagName: string;
}
