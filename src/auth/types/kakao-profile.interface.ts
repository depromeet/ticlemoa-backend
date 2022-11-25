import { AuthProvider } from '../../entities/types/auth-provider.interface';

export interface KakaoProfile {
  id: number;
  username: string;
  displayName: string;
  provider: AuthProvider.kakao;
  _raw: string;
  _json: any;
}
