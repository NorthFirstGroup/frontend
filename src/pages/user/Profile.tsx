import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Alert, Image, Row, Col } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getAvailAreas, Area, AreaResponseData } from '@api/availArea';
import { GetProfileData } from '@api/profile';
import { useAuth } from '@hooks/useAuth';
import { ApiResponse } from '@type/ApiResponse';
import { handleApiError } from '@utils/errorHandling';
import UserNameInput from '@components/UserNameInput';
import PhoneNumberInput from '@components/PhoneNumberInput';
import { useUserProfileData } from '@hooks/useProfileUpdate';
import defaultAvatar from '@assets/def-avatar.png';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const email = user?.email;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string>('');

    const {
        profile,
        loading: profileLoading,
        error: profileError,
        handleFileChange: handleProfileFileChange,
        handleUpdateProfile,
        updateSuccess,
        updating: isUpdating,
        updateError: profileUpdateError,
        latestProfileUrl
    } = useUserProfileData();

    const [formData, setFormData] = useState<Required<GetProfileData>>({
        name: '',
        phone_num: '',
        birth_date: dayjs().format('YYYY-MM-DD'),
        location_ids: [],
        profile_url: ''
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

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone_num: profile.phone_num || '',
                birth_date: profile.birth_date || dayjs().format('YYYY-MM-DD'),
                location_ids: profile.location_ids || [],
                profile_url: profile.profile_url || ''
            });
            setLocalAvatarUrl(profile.profile_url || null);
        }
    }, [profile]);

    useEffect(() => {
        if (latestProfileUrl !== null) {
            setLocalAvatarUrl(latestProfileUrl);
            updateUser({ profile_url: latestProfileUrl });
        }
    }, [latestProfileUrl, updateUser]);

    useEffect(() => {
        const fetchAreasData = async () => {
            setLoadingAreas(true);
            setAreasError(null);
            try {
                const response: ApiResponse<AreaResponseData> = await getAvailAreas();
                if (response.data) setAreas(response.data.results);
            } catch (error: unknown) {
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
        const target = e.target as HTMLInputElement;
        const selectedFile = target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 2 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    profile_url: '圖片大小不可超過 2MB'
                }));
                setLocalAvatarUrl(null);
                handleProfileFileChange(null);
            } else if (!['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
                setErrors(prev => ({
                    ...prev,
                    profile_url: '圖片格式須為JPEG, PNG, 或 GIF'
                }));
                setLocalAvatarUrl(null);
                handleProfileFileChange(null);
            } else {
                setErrors(prev => ({ ...prev, profile_url: '' }));
                handleProfileFileChange(selectedFile);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLocalAvatarUrl(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            }
        } else {
            setErrors(prev => ({ ...prev, profile_url: '' }));
            handleProfileFileChange(null);
            setLocalAvatarUrl(user?.profile_url || profile?.profile_url || null);
        }
    };

    const handleAvatarButtonClick = () => {
        fileInputRef.current?.click();
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
        setSubmitError('');
        setErrors(prev => ({ ...prev, profile_url: '' }));

        if (!isFormValid()) {
            setSubmitError('請檢查表單是否有錯誤或未填寫完整');
            return;
        }
        try {
            await handleUpdateProfile(user?.id || '', formData);
        } catch (err: unknown) {
            setSubmitError(profileUpdateError || handleApiError(err, '更新資料失敗'));
        }
    };

    const currentAvatarToDisplay =
        localAvatarUrl || latestProfileUrl || user?.profile_url || profile?.profile_url || defaultAvatar;

    return (
        <Container className="mt-5" style={{ maxWidth: '900px' }}>
            {' '}
            {/* Increased max-width for two columns */}
            <h3 className="text-center">會員資訊</h3>
            <Row>
                <Col md={4} className="d-flex flex-column align-items-center mb-4 mb-md-0">
                    {/* Left Column - Avatar and Member Account */}
                    <div className="d-flex flex-column align-items-center mt-3">
                        <div
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                marginBottom: '15px',
                                border: '1px solid #ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                src={currentAvatarToDisplay}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => {
                                    (e.target as HTMLImageElement).src = defaultAvatar;
                                }}
                            />
                        </div>
                        <Button
                            variant="outline-primary"
                            onClick={handleAvatarButtonClick}
                            size="sm"
                            disabled={isUpdating}
                        >
                            {isUpdating ? '上傳中...' : '更換 Avatar'}
                        </Button>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept=".jpg, .jpeg, .png, .gif"
                            // accept="image/jpeg, image/png, image/gif"
                        />
                        {errors.profile_url && <Form.Text className="text-danger">{errors.profile_url}</Form.Text>}
                    </div>

                    {/* Member Account section, now centered */}
                    <Form.Group className="mb-3 mt-4 w-100 d-flex flex-column align-items-center">
                        <Form.Label>會員帳號</Form.Label>
                        {/* Adding 'text-center' to Form.Control for centering text, and 'mx-auto' for block-level centering */}
                        <Form.Control
                            type="email"
                            value={email}
                            readOnly
                            plaintext
                            disabled
                            className="text-center mx-auto"
                            style={{ maxWidth: '80%' }}
                        />
                        <Button
                            variant="outline-primary"
                            className="mt-2"
                            onClick={() => navigate('/user/reset-password')}
                        >
                            重設密碼
                        </Button>
                    </Form.Group>
                </Col>

                <Col md={8}>
                    {' '}
                    {/* Right Column */}
                    {areasError && <Alert variant="danger">{areasError}</Alert>}
                    {profileError && <Alert variant="danger">{profileError}</Alert>}
                    {profileUpdateError && <Alert variant="danger">{profileUpdateError}</Alert>}
                    {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}
                    {submitError && <Alert variant="info">{submitError}</Alert>}
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <p className="text-danger text-end">* 為必填</p>

                        <UserNameInput
                            inputLabel="暱稱"
                            inputName="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            error={errors.name}
                        />

                        <PhoneNumberInput
                            inputLabel="手機號碼"
                            inputName="phone_num"
                            value={formData.phone_num}
                            onChange={handleInputChange}
                            error={errors.phone_num}
                        />

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <span className="text-danger">* </span>出生年月日
                            </Form.Label>
                            <Form.Control
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <span className="text-danger">* </span>偏好活動地區（至少勾選一個）
                            </Form.Label>
                            <div className="d-flex flex-wrap gap-2">
                                {loadingAreas ? (
                                    <div>Loading Areas...</div>
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

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!isFormValid() || profileLoading || isUpdating}
                        >
                            {profileLoading || isUpdating ? '更新中...' : '更新'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
