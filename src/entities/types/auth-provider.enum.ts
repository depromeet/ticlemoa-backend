export const AuthProvider = {
  KAKAO: 'KAKAO',
  GOOGLE: 'GOOGLE',
  NAVER: 'NAVER',
  APPLE: 'APPLE',
} as const;

export type AuthProvider = typeof AuthProvider[keyof typeof AuthProvider];
