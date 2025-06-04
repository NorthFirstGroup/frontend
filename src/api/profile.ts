import { ApiResponse } from '../types/ApiResponse';
import { apiClient } from './client';
import { uploadToS3 } from './uploadApi';
import { GetProfileSchema } from '../schemas/profile';
import { UpdateProfileSchema } from '../schemas/profile';

export interface GetProfileData {
    name: string;
    phone_num: string;
    birth_date: string;
    location_ids: number[];
    profile_url: string | null;
}

export interface SetProfileData {
    name: string;
    phone_num: string;
    birth_date: string;
    location_ids: number[];
}

export interface UpdateProfileResponseData {
    profile_url?: string;
}
/**
 * 取得會員資料
 */
export const getProfile = async (): Promise<ApiResponse<GetProfileData>> => {
    const res = await apiClient.get<ApiResponse<GetProfileData>>('/v1/user/profile');
    const parsed = GetProfileSchema.safeParse(res.data.data);
    if (!parsed.success) console.error('GET - /v1/user/profile 驗證錯誤', parsed.error.format());
    return {
        ...res.data,
        data: parsed.data
    };
};

/**
 * 更新會員資料
 * @param data 會員資料 (僅需傳遞需要更新的欄位)
 */
export const updateProfile = async (
    userId: string,
    updatedData: SetProfileData,
    file?: File
): Promise<ApiResponse<UpdateProfileResponseData>> => {
    try {
        let avatarUrl = '';

        // 若有上傳新圖片，執行上傳並取得新的 URL, 更新 localStorage
        if (file) {
            avatarUrl = await uploadToS3(userId, file);
        }

        // const response = await apiClient.patch('/v1/user/profile', {
        const response = await apiClient.put<ApiResponse<object>>('/v1/user/profile', {
            ...updatedData
        });

        const parsed = UpdateProfileSchema.safeParse(response.data);
        if (!parsed.success) console.error('PUT - /v1/user/profile 驗證錯誤', parsed.error.format());

        return {
            ...response.data,
            data: { ...parsed.data, profile_url: avatarUrl }
        };
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
    }
};
