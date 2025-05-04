export const useEnv = () => {
    const env = import.meta.env;

    return {
        apiBaseUrl: env.VITE_API_BASE_URL,
        host: env.VITE_HOST,
        port: env.VITE_PORT,
        appVersion: env.VITE_APP_VERSION,
        envMode: env.VITE_ENV_MODE
    };
};
