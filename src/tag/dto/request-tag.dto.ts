import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagRequestDto {
  @IsString()
  @IsNotEmpty()
  tagName: string;
}
