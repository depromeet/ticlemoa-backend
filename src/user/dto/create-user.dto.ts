import { IsEmpty, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthProvider } from '../../entities/types/auth-provider.interface';

export class CreateUserDto {
  @IsString()
  @IsEmpty()
  snsId!: string;

  @IsString()
  email?: string;

  @IsString()
  @IsEmpty()
  nickname: string;

  @IsString()
  avatarUrl: string;

  @IsEnum(AuthProvider)
  @IsNotEmpty()
  provider: AuthProvider;
}
