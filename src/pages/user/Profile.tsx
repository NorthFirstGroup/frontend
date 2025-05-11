import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { availAreas, Area, AreaResponseData } from '../../api/availArea';
import { ProfileData } from '../../api/profile';
import { useAuth } from '../../hooks/useAuth';
import { ApiResponse } from '../../types/ApiResponse'; // 確保路徑正確
import { handleApiError } from '../../utils/errorHandling';
import UserNameInput from '../../components/UserNameInput';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import { useUserProfileData } from '../../hooks/useProfileUpdate';

dayjs.extend(utc);
dayjs.extend(timezone);

const Profile: React.FC = () => {
    const { user } = useAuth();
    const email = user?.email;

    const {
        profile,
        loading: profileLoading,
        error: profileError,
        handleFileChange: handleProfileFileChange,
        handleUpdateProfile,
        updateSuccess,
        updating: isUpdating,
        updateError: profileUpdateError
    } = useUserProfileData();

    const [formData, setFormData] = useState<Required<ProfileData>>({
        name: '',
        phone_num: '',
        birth_date: dayjs().format('YYYY-MM-DD'),
        location_ids: [],
        profile_url: '' // 包含 profile_url 並給予初始值
    });
    const [areas, setAreas] = useState<Area[]>([]);

    const [errors, setErrors] = useState({
        name: '',
        phone_num: '',
        birth_date: '',
        profile_url: ''
    });
    const [loadingAreas, setLoadingAreas] = useState(false);
    const [areasError, setAreasError] = useState<string | null>(null);

    // const [submitLoading, setSubmitLoading] = useState(false);
    // const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone_num: profile.phone_num || '',
                birth_date: profile.birth_date || dayjs().format('YYYY-MM-DD'),
                location_ids: profile.location_ids || [],
                profile_url: profile.profile_url || ''
            });
        }
    }, [profile]);

    useEffect(() => {
        const fetchAreasData = async () => {
            setLoadingAreas(true);
            setAreasError(null);
            try {
                const response: ApiResponse<AreaResponseData> = await availAreas();
                if (response.data) setAreas(response.data.results);
            } catch (error: any) {
                setAreasError(handleApiError(error, '無法取得地區選項'));
            } finally {
                setLoadingAreas(false);
            }
        };

        fetchAreasData();
    }, []);

    const validateField = (name: string, value: string) => {
        let errorMsg = '';

        if (name === 'name') {
            if (value.length < 2 || value.length > 10) {
                errorMsg = '暱稱需為 2-10 字，且不可包含特殊符號';
            }
        }

        if (name === 'phone_num') {
            const phoneRegex = /^09\d{8}$/;
            if (!phoneRegex.test(value)) {
                errorMsg = '手機號碼需為 09 開頭的 10 位數字';
            }
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg === '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'name' || name === 'phone_num') {
            validateField(name, value);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement; // 類型斷言
        const selectedFile = target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 2 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    profile_url: '圖片大小不可超過 2MB'
                }));
            } else {
                handleProfileFileChange(selectedFile);
                setErrors(prev => ({ ...prev, profile_url: '' }));
            }
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFormData(prev => ({
            ...prev,
            location_ids: prev.location_ids.includes(value)
                ? prev.location_ids.filter(id => id !== value)
                : [...prev.location_ids, value]
        }));
    };

    const isFormValid = () => {
        return !errors.name && !errors.phone_num && !errors.profile_url && formData.location_ids.length > 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, profile_url: '' })); // 清空圖片錯誤
        // setSubmitError('');

        if (isFormValid()) {
            await handleUpdateProfile(formData);
        } else {
            // setSubmitError('請檢查表單是否有錯誤');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <h3>會員資料</h3>
            {areasError && <Alert variant="danger">{areasError}</Alert>}
            {/* {submitError && <Alert variant="danger">{submitError}</Alert>} */}
            {profileError && <Alert variant="danger">{profileError}</Alert>} {/* 顯示錯誤訊息 */}
            {profileUpdateError && <Alert variant="danger">{profileUpdateError}</Alert>}
            {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>會員帳號</Form.Label>
                    <Form.Control type="email" value={email} readOnly plaintext disabled />
                </Form.Group>

                <UserNameInput value={formData.name} onChange={handleInputChange} error={errors.name} />

                <PhoneNumberInput value={formData.phone_num} onChange={handleInputChange} error={errors.phone_num} />

                <Form.Group className="mb-3">
                    <Form.Label>出生年月日</Form.Label>
                    <Form.Control
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>偏好活動地區（至少勾選一個）</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                        {loadingAreas ? (
                            <div>Loading Areas...</div> // Show loading message
                        ) : (
                            areas.map(area => (
                                <Form.Check
                                    key={area.id}
                                    type="checkbox"
                                    label={area.name}
                                    value={area.id}
                                    checked={formData.location_ids.includes(area.id)}
                                    onChange={handleCheckboxChange}
                                    className="flex-grow-1"
                                    style={{ minWidth: 'calc(25% - 10px)' }}
                                />
                            ))
                        )}
                    </div>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>大頭照(還沒好)</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} disabled />
                    {errors.profile_url && <Form.Text className="text-danger">{errors.profile_url}</Form.Text>}
                </Form.Group>

                <Button type="submit" variant="primary" disabled={!isFormValid() || profileLoading || isUpdating}>
                    {profileLoading || isUpdating ? '更新中...' : '更新'}
                </Button>
            </Form>
        </Container>
    );
};

export default Profile;
