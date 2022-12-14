import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagRequest {
  @IsString()
  @IsNotEmpty()
  tagName: string;
}
