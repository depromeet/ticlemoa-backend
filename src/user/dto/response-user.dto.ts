import { IsString } from 'class-validator';

export class ResponseUserDto {
  @IsString()
  email?: string;

  @IsString()
  nickname?: string;

  @IsString()
  avatarUrl?: string;
}
