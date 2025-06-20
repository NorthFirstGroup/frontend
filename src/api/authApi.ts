import { publicApiClient } from './client';
import { ApiResponse } from '@type/ApiResponse';
import { SignInSchema, SignUpSchema } from '../schemas/authApi';

export interface LogInAndUpResponseData {
    token: string;
    user: {
        name: string;
        role: string;
        profile_url?: string;
    };
}
export const signIn = async (email: string, password: string): Promise<ApiResponse<LogInAndUpResponseData>> => {
    const res = await publicApiClient.post<ApiResponse<LogInAndUpResponseData>>('/v1/user/signin', { email, password });
    const parsed = SignInSchema.safeParse(res.data.data);
    if (!parsed.success) {
        console.error('POST - /v1/user/signin 認證錯誤', parsed.error.format());
        // 如果parsed不成功，返回原本後端資料
        return res.data || {};
    }
    return {
        ...res.data,
        data: parsed.data
    };
};

export const signUp = async (payload: {
    email: string;
    name: string;
    password: string;
}): Promise<ApiResponse<LogInAndUpResponseData>> => {
    const res = await publicApiClient.post<ApiResponse<LogInAndUpResponseData>>('/v2/user/signup', payload);
    const parsed = SignUpSchema.safeParse(res.data.data);
    if (!parsed.success) console.error('POST - /v2/user/signup 認證錯誤', parsed.error.format());

    return {
        ...res.data,
        data: parsed.data
    };
};
