export interface TokenResponse extends AccessToken, RefreshToken {}

export interface AccessToken {
  accessToken: string;
}

export interface RefreshToken {
  refreshToken: string;
}
