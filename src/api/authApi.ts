import publicApiClient from './publicApi';

export async function loginApi(email: string, password: string) {
    const res = await publicApiClient.post('/v1/user/signin', { email, password });
    // console.log(res);
    return res.data.data;
}

export const registerApi = async (payload: { email: string; name: string; password: string }) => {
    const res = await publicApiClient.post('/v2/user/signup', payload);
    // console.log(res);
    return res.data.data;
};
