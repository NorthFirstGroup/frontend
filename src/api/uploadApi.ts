import { UploadSchema } from '../schemas/uploadApi';
import { ApiResponse } from '@type/ApiResponse';
import { apiClient } from './client';

export const uploadToS3 = async (
    userId: string,
    file: File,
    fileSizeLimit: number = 5,
    isOrganizer: boolean = false
): Promise<string> => {
    if (file.size > fileSizeLimit * 1024 * 1024) {
        throw new Error(`File size exceeds ${fileSizeLimit}MB limit`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    const apiUrl = isOrganizer ? '/v1/organizer/upload/image' : '/v1/user/upload';
    try {
        const response = await apiClient.post<ApiResponse<{ url: string }>>(apiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data && response.data.status_code === 2000) {
            const parsed = UploadSchema.safeParse(response.data);
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
