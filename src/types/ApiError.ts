// types/ApiError.ts
export class ApiError extends Error {
    status?: number;
    data?: unknown;
    originalError?: unknown;

    constructor(message: string, status?: number, data?: unknown, originalError?: unknown) {
        super(message);
        this.status = status;
        this.data = data;
        this.originalError = originalError;
        this.name = 'ApiError';
        // 確保 instanceof 可以正確判斷
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
