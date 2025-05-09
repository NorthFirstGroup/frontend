import publicApiClient from './publicApi';

export const availAreas = async () => {
    try {
        const res = await publicApiClient.get('/v1/admin/areas');
        // console.log(res);
        return res.data.data.results;
    } catch (err) {
        console.error('Error fetching areas:', err);
    }
};
