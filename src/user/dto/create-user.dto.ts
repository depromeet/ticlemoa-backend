import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthProvider } from '../../entities/types/auth-provider.enum';

export class CreateUserDto {
  @IsString()
  @IsEmpty()
  snsId!: string;

  @IsEmail()
  email?: string | null;

  @IsString()
  @IsEmpty()
  nickname!: string;

  @IsString()
  avatarUrl?: string | null;

  @IsEnum(AuthProvider)
  @IsNotEmpty()
  provider!: AuthProvider;
}
