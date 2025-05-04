import apiClient from './client';

export async function loginApi(email: string, password: string) {
    const res = await apiClient.post('/user/signin', { email, password });
    return res.data;
}

export const registerApi = async (payload: { email: string; name: string; password: string }) => {
    const response = await apiClient.post('/user/signup', payload);
    return response.data;
};
