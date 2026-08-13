import type { ApiErrorDetails } from "#utils/response";
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly errors: ApiErrorDetails | null;
    constructor(message: string, statusCode?: number, errors?: ApiErrorDetails | null);
}
export declare class BadRequestError extends AppError {
    constructor(message?: string, errors?: ApiErrorDetails | null);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string, errors?: ApiErrorDetails | null);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string, errors?: ApiErrorDetails | null);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string, errors?: ApiErrorDetails | null);
}
export declare class ConflictError extends AppError {
    constructor(message?: string, errors?: ApiErrorDetails | null);
}
//# sourceMappingURL=app-error.d.ts.map