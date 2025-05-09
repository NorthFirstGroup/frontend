import axios from 'axios';

const S3_URL = import.meta.env.VITE_S3_URL;
const S3_ACCESS_KEY = import.meta.env.VITE_S3_ACCESS_KEY;
const S3_SECRET_KEY = import.meta.env.VITE_S3_SECRET_KEY;
const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;
const S3_REGION = import.meta.env.VITE_S3_REGION;

export const uploadToS3 = async (file: File): Promise<string> => {
    if (!S3_URL || !S3_ACCESS_KEY || !S3_SECRET_KEY || !S3_BUCKET_NAME || !S3_REGION) {
        throw new Error('S3 environment variables are not properly configured');
    }

    if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size exceeds 2MB limit');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${S3_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.url;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('File upload failed');
    }
};
