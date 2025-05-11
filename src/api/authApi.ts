import { publicApiClient } from './client';
import { ApiResponse } from '../types/ApiResponse';

export interface LoginResponseData {
    token: string;
    user: {
        name: string;
    };
}
export const loginApi = async (email: string, password: string): Promise<ApiResponse<LoginResponseData>> => {
    const res = await publicApiClient.post<ApiResponse<LoginResponseData>>('/v1/user/signin', { email, password });
    return res.data || {};
};

export const registerApi = async (payload: {
    email: string;
    name: string;
    password: string;
}): Promise<ApiResponse<LoginResponseData>> => {
    const res = await publicApiClient.post<ApiResponse<LoginResponseData>>('/v2/user/signup', payload);
    return res.data || {};
};
