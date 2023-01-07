import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthProvider } from '../../entities/types/auth-provider.enum';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @IsEnum(AuthProvider)
  @IsNotEmpty()
  provider!: string;
}
