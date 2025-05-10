import { useState, useEffect } from 'react';
import { getProfile, updateProfile, ProfileData } from '../api/profile';
import { uploadToS3 } from '../api/uploadApi';
import { ApiResponse } from '../types/ApiResponse';
import { handleApiError } from '../utils/errorHandling';

export const userProfileData = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
    const [updating, setUpdating] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response: ApiResponse<ProfileData> = await getProfile();
                if (response.data) {
                    setProfile({
                        name: response.data.name,
                        phone_num: response.data.phone_num,
                        birth_date: response.data.birth_date,
                        profile_url: response.data.profile_url,
                        location_ids: response.data.location_ids || []
                    });
                }
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : '無法取得會員資料');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
    };

    const handleUpdateProfile = async (updatedData: ProfileData) => {
        setUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(null);

        try {
            let avatarUrl = profile?.profile_url || '';
            const fileToPass = selectedFile ? selectedFile : undefined;

            // 檢查是否有新上傳的圖片
            if (selectedFile) {
                avatarUrl = await uploadToS3(selectedFile);
                setSelectedFile(null); // 重置選擇檔案狀態
            }

            await updateProfile({ ...updatedData, profile_url: avatarUrl }, fileToPass);
            setProfile({ ...updatedData, profile_url: avatarUrl });
            setUpdateSuccess('會員資料已更新');
            setSelectedFile(null); // 重置選擇檔案狀態
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(handleApiError(err, '更新資料失敗'));
        } finally {
            setUpdating(false);
        }
    };

    return {
        profile,
        loading,
        error,
        handleFileChange,
        handleUpdateProfile,
        updateSuccess,
        updating,
        updateError
    };
};
