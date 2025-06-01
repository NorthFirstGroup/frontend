import { UploadSchema } from '../schemas/uploadApi';
import { ApiResponse } from '../types/ApiResponse';
import { apiClient } from './client';

export const uploadToS3 = async (userId: string, file: File): Promise<string> => {
    if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size exceeds 2MB limit');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    try {
        const response = await apiClient.post<ApiResponse<{ url: string }>>('/v1/user/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data && response.data.status_code === 2000) {
            const parsed = UploadSchema.safeParse(response.data.data);
            if (!parsed.success) console.warn('Upload 回傳格式錯誤', parsed.error.format());

            return parsed.data?.data?.url || '';
        } else {
            const apiMessage = response.data?.message || '未知錯誤';
            throw new Error(`API回報錯誤: ${apiMessage} (Code: ${response.data?.status_code})`);
        }
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('File upload failed');
    }
};
