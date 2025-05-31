import { ApiResponse } from '../types/ApiResponse';
import { apiClient } from './client';
import { uploadToS3 } from './uploadApi';
import { GetProfileSchema } from '../schemas/profile';
import { UpdateProfileSchema } from '../schemas/profile';

export interface ProfileData {
    name: string;
    phone_num: string;
    birth_date: string;
    location_ids: number[];
    profile_url: string | null;
}

/**
 * 取得會員資料
 */
export const getProfile = async (): Promise<ApiResponse<ProfileData>> => {
    const res = await apiClient.get<ApiResponse<ProfileData>>('/v1/user/profile');
    const parsed = GetProfileSchema.safeParse(res.data.data);
    if (!parsed.success) console.error('GET - /v1/user/profile 驗證錯誤', parsed.error.format());
    return {
        ...res.data,
        data: parsed.data
    };
};

/**
 * 上傳大頭照
 * @param file 圖片檔案 (最大 2MB)
 */
// export const uploadAvatar = async (file: File) => {
//     try {
//         const url = await uploadToS3(file);
//         //fix later
//         return url;
//     } catch (error) {
//         console.error('Error uploading avatar:', error);
//         throw new Error('Failed to upload avatar');
//     }
// };

/**
 * 更新會員資料
 * @param data 會員資料 (僅需傳遞需要更新的欄位)
 */
export const updateProfile = async (
    userId: string,
    updatedData: ProfileData,
    file?: File
): Promise<ApiResponse<object>> => {
    try {
        let avatarUrl = updatedData.profile_url;

        // 若有上傳新圖片，執行上傳並取得新的 URL
        if (file) {
            avatarUrl = await uploadToS3(userId, file);
        }

        console.log('before put api', JSON.stringify(updatedData));
        // const response = await apiClient.patch('/v1/user/profile', {
        const response = await apiClient.put<ApiResponse<object>>('/v1/user/profile', {
            ...updatedData,
            avatar: avatarUrl
        });

        const parsed = UpdateProfileSchema.safeParse(response.data);
        if (!parsed.success) console.error('PUT - /v1/user/profile 驗證錯誤', parsed.error.format());

        return {
            ...response.data,
            data: parsed.data
        };
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
    }
};
