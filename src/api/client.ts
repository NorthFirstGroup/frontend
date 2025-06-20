import axios, { AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '@type/ApiError';
// import { ApiResponse } from '@type/ApiResponse'; // 確保路徑正確

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const createApiClient = (baseURL: string, withAuth: boolean = false) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    instance.interceptors.response.use(
        (response: AxiosResponse<unknown>): AxiosResponse<unknown> => {
            return response;
        },
        (error: AxiosError) => {
            let errorMessage = '發生未知錯誤';
            let status = 500;
            let data: unknown;

            if (error.response) {
                // 伺服器有回應，但狀態碼不在 2xx 範圍
                status = error.response.status;
                errorMessage = (error.response.data as { message?: string })?.message || errorMessage;
                data = error.response.data;
            } else if (error.request) {
                // 請求已發送，但沒有收到回應
                errorMessage = '無法連接到伺服器';
            } else {
                // 發送請求時發生錯誤
                errorMessage = error.message;
            }

            console.error(`API Error [${status}]:`, errorMessage, data);
            return Promise.reject(new ApiError(errorMessage, status, data, error));
        }
    );

    if (withAuth) {
        instance.interceptors.request.use(config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });
    }

    return instance;
};

const publicApiClient = createApiClient(apiBaseUrl);
const apiClient = createApiClient(apiBaseUrl, true);

export { publicApiClient, apiClient };
