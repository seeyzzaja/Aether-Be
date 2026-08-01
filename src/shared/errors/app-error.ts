export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: any;

  constructor(message: string, statusCode = 500, errors: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", errors: any = null) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", errors: any = null) {
    super(message, 401, errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", errors: any = null) {
    super(message, 403, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", errors: any = null) {
    super(message, 404, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", errors: any = null) {
    super(message, 409, errors);
  }
}
