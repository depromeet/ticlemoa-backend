import { AuthProvider } from '../../entities/types/auth-provider.interface';

export class CreateUserDto {
  snsId: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  provider: AuthProvider;
}
