export const AuthProvider = {
  KAKAO: 'KAKAO',
  GOOGLE: 'GOOGLE',
  NAVER: 'NAVER',
  APPLE: 'APPLE',
  NYONG: 'NYONG',
} as const;

export type AuthProvider = typeof AuthProvider[keyof typeof AuthProvider];
