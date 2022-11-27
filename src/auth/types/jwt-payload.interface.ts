import { AuthProvider } from '../../entities/types/auth-provider.interface';

export interface JwtPayload {
  id: number;
  provider: AuthProvider;
}
