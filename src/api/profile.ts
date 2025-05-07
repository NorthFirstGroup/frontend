import apiClient from './client';
import { uploadToS3 } from './uploadApi';

export interface ProfileData {
    name?: string;
    phone_num?: string;
    birth_date?: string;
    profile_url?: string;
}

/**
 * 取得會員資料
 */
export const getProfile = async () => {
    try {
        const res = await apiClient.get('/v1/user/profile');
        // console.log(res);
        // console.log(res.data.data);
        return res.data.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch profile');
    }
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
export const updateProfile = async (updatedData: ProfileData, file?: File): Promise<ProfileData> => {
    try {
        let avatarUrl = updatedData.profile_url;

        // 若有上傳新圖片，執行上傳並取得新的 URL
        if (file) {
            avatarUrl = await uploadToS3(file);
        }

        // const response = await apiClient.patch('/v1/user/profile', {
        const response = await apiClient.put('/v1/user/profile', {
            ...updatedData,
            avatar: avatarUrl
        });

        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
    }
};
