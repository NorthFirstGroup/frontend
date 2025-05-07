import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/profile';
import { uploadToS3 } from '../api/uploadApi';

interface ProfileData {
    name?: string;
    phone_num?: string;
    birth_date?: string;
    profile_url?: string;
}

export const useProfileUpdate = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await getProfile();
                console.log('component', data);
                setProfile({
                    name: data.name,
                    phone_num: data.phone_num,
                    birth_date: data.birth_date,
                    profile_url: data.profile_url
                });
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : '無法取得會員資料');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
    };

    const handleUpdate = async (updatedData: ProfileData) => {
        setLoading(true);
        setError(null);

        try {
            let avatarUrl = profile?.profile_url;

            // 檢查是否有新上傳的圖片
            if (selectedFile) {
                avatarUrl = await uploadToS3(selectedFile);
            }

            const data = await updateProfile({ ...updatedData, profile_url: avatarUrl });
            setProfile(data);
            setSelectedFile(null); // 重置選擇檔案狀態
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('更新資料失敗');
        } finally {
            setLoading(false);
        }
    };

    return {
        profile,
        loading,
        error,
        handleFileChange,
        handleUpdate
    };
};
