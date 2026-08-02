export declare class AppError extends Error {
    readonly statusCode: number;
    readonly errors: any;
    constructor(message: string, statusCode?: number, errors?: any);
}
export declare class BadRequestError extends AppError {
    constructor(message?: string, errors?: any);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string, errors?: any);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string, errors?: any);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string, errors?: any);
}
export declare class ConflictError extends AppError {
    constructor(message?: string, errors?: any);
}
//# sourceMappingURL=app-error.d.ts.map