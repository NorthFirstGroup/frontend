import { useState, useEffect } from 'react';
import { getProfile, updateProfile, GetProfileData, SetProfileData, UpdateProfileResponseData } from '../api/profile';
import { ApiResponse } from '@type/ApiResponse';
import { handleApiError } from '../utils/errorHandling';

export const useUserProfileData = () => {
    const [profile, setProfile] = useState<GetProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
    const [updating, setUpdating] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [latestProfileUrl, setLatestProfileUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response: ApiResponse<GetProfileData> = await getProfile();
                if (response.data) {
                    setProfile({
                        name: response.data.name,
                        phone_num: response.data.phone_num,
                        birth_date: response.data.birth_date,
                        profile_url: response.data.profile_url,
                        location_ids: response.data.location_ids || []
                    });
                    setLatestProfileUrl(response.data.profile_url || null);
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

    const handleUpdateProfile = async (userId: string, updatedData: GetProfileData): Promise<string | null> => {
        setUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(null);
        if (!userId) {
            setUpdateError('User ID is missing for profile update.');
            setUpdating(false);
            return null; // Return null if userId is missing
        }
        try {
            const fileToPass = selectedFile ? selectedFile : undefined;

            let setProfileData: SetProfileData = {
                name: updatedData.name,
                phone_num: updatedData.phone_num,
                birth_date: updatedData.birth_date,
                location_ids: [...updatedData.location_ids]
            };
            const result: ApiResponse<UpdateProfileResponseData> = await updateProfile(
                userId,
                setProfileData,
                fileToPass
            );
            if (result.data && result.status_code === 2000 && result.data?.profile_url) {
                const newAvatarUrl = result.data?.profile_url;
                setProfile(prevProfile => ({
                    ...prevProfile!, // Use non-null assertion if you're sure profile won't be null here
                    ...setProfileData, // Update other profile fields from formData
                    profile_url: newAvatarUrl // Use the new URL from the API response
                }));
                setLatestProfileUrl(newAvatarUrl);
                setUpdateSuccess('會員資料已更新');
                setSelectedFile(null); // 重置選擇檔案狀態
                return newAvatarUrl;
            } else {
                const apiErrorMessage = result.message || 'API回報錯誤，但無具體訊息';
                setUpdateError(apiErrorMessage);
                throw new Error(apiErrorMessage); // Propagate error
            }
        } catch (err: unknown) {
            console.error('Error updating profile:', err);
            const errMsg = handleApiError(err, '更新資料失敗');
            setUpdateError(errMsg);
            throw err; // Re-throw the error
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
        updateError,
        latestProfileUrl
    };
};
