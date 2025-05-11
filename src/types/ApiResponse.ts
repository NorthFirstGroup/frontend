export interface ApiResponse<T = unknown> {
    status_code: number;
    message: string;
    data?: T;
}
