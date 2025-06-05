import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {}
        }
    },
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@context': path.resolve(__dirname, 'src/context')
        }
    }
});
