export interface JwtUserPayload {
  userId: string;
  email: string;
  username: string;
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      user?: JwtUserPayload;
    }
  }
}
