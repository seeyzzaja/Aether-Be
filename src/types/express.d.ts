export interface JwtUserPayload {
  userId: string;
  email: string;
  username: string;
  sessionId: string;
  isPlatformAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      user?: JwtUserPayload;
    }
  }
}
