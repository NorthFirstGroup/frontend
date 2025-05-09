import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const publicApiClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

publicApiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default publicApiClient;
