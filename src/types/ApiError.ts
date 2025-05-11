// types/ApiError.ts
export class ApiError extends Error {
    status?: number;
    data?: any;
    originalError?: any;

    constructor(message: string, status?: number, data?: any, originalError?: any) {
        super(message);
        this.status = status;
        this.data = data;
        this.originalError = originalError;
        this.name = 'ApiError';
        // 確保 instanceof 可以正確判斷
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
