import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  nickname?: string;

  @IsString()
  avatarUrl?: string;
}
