import { AuthProvider } from '../../entities/types/auth-provider.enum';

export interface JwtPayload {
  id: number;
  provider: AuthProvider;
}
