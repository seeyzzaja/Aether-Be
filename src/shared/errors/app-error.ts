import type { ApiErrorDetails } from "#utils/response";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: ApiErrorDetails | null;
  public readonly code: string | null;

  constructor(
    message: string,
    statusCode = 500,
    errors: ApiErrorDetails | null = null,
    code: string | null = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errors: ApiErrorDetails | null = null) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", errors: ApiErrorDetails | null = null) {
    super(message, 401, errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", errors: ApiErrorDetails | null = null) {
    super(message, 403, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", errors: ApiErrorDetails | null = null) {
    super(message, 404, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", errors: ApiErrorDetails | null = null) {
    super(message, 409, errors);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too Many Requests", errors: ApiErrorDetails | null = null) {
    super(message, 429, errors, "RATE_LIMITED");
  }
}
