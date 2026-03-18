export type AuthResult =
  | { accessToken: string; refreshToken: string }
  | { errorMessage: string }
  | { cancelled: true };
