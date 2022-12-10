export interface KakaoProfile {
  id: number;
  username: string;
  displayName: string;
  provider: 'kakao';
  _json: { kakao_account: { email: string } };
}
