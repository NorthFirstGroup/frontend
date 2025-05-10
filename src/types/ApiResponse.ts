export interface ApiResponse<T = any> {
    status_code: number;
    message: string;
    data?: T;
}
