import apiClient from './client';

export async function loginApi(email: string, password: string) {
    const res = await apiClient.post('/user/signin', { email, password });
    console.log(res);
    return res.data.data;
}

export const registerApi = async (payload: { email: string; name: string; password: string }) => {
    const res = await apiClient.post('/user/signup', payload);
    console.log(res);
    return res.data;
};
