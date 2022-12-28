export interface TokenResponse extends AccessToken, RefreshToken {}

export interface AccessToken {
  accessToken: string;
  userId: number;
}

export interface RefreshToken {
  refreshToken: string;
}
