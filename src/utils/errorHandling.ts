import { ApiError } from '../types/ApiError';

export const handleApiError = (error: any, defaultErrorMessage: string): string => {
    if (error instanceof ApiError) {
        return error.message || defaultErrorMessage;
    } else if (error instanceof Error) {
        return error.message || '發生未知錯誤，請稍後再試';
    } else {
        return defaultErrorMessage;
    }
};
