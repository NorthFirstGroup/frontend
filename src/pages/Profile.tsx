import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { availAreas } from '../api/availArea';
import { getProfile, updateProfile } from '../api/profile';
import { useAuth } from '../hooks/useAuth';

dayjs.extend(utc);
dayjs.extend(timezone);

// 定義 ProfileFormData 介面
interface ProfileFormData {
    name: string;
    phone_num: string;
    birth_date: string;
    profile_url: string;
    location_ids: number[];
}

// 定義地區選項介面
interface Area {
    id: number;
    name: string;
}

const Profile: React.FC = () => {
    const { user } = useAuth();
    const email = user?.email;
    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        phone_num: '',
        birth_date: '',
        profile_url: '',
        location_ids: []
    });

    const [areas, setAreas] = useState<Area[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 獲取使用者資料及地區選項
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const profileData = await getProfile();
                const formattedBirthDate = dayjs(profileData.birth_date).format('YYYY-MM-DD');
                setFormData({ ...profileData, birth_date: formattedBirthDate });
            } catch (err) {
                console.error(err);
                setError('無法取得會員資料');
            } finally {
                setLoading(false);
            }
        };

        const fetchAreas = async () => {
            try {
                const res = await availAreas();
                setAreas(res);
            } catch (err) {
                console.error(err);
                setError('無法取得地區選項');
            }
        };

        fetchProfile();
        fetchAreas();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setFormData(prev => {
            const updatedLocationIds = prev.location_ids.includes(value)
                ? prev.location_ids.filter(id => id !== value)
                : [...prev.location_ids, value];
            return { ...prev, location_ids: updatedLocationIds };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (formData.name.length < 2 || formData.name.length > 10) {
            setError('暱稱格式錯誤');
            setLoading(false);
            return;
        }

        const phoneRegex = /^09\d{8}$/;

        if (!phoneRegex.test(formData.phone_num)) {
            setError('手機號碼格式錯誤，需為 09 開頭且 10 位數字');
            return;
        }

        if (formData.location_ids.length === 0) {
            setError('請至少選擇一個地區');
            setLoading(false);
            return;
        }

        try {
            await updateProfile(formData, file || undefined);
            setSuccess('會員資料已更新');
        } catch (err) {
            console.error(err);
            setError('更新失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <h3>會員資料</h3>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>會員帳號</Form.Label>
                        <Form.Control type="email" name="email" value={email} readOnly plaintext disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>暱稱</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            minLength={2}
                            maxLength={10}
                            placeholder="請輸入暱稱"
                            required
                        />
                        <Form.Text className="text-muted">最少2個字，最多10個字，不可包含任何特殊符號與空白</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>手機號碼</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone_num"
                            value={formData.phone_num}
                            onChange={handleInputChange}
                            placeholder="請輸入手機號碼"
                            pattern="^09\d{8}$"
                            required
                        />
                        <Form.Text className="text-muted">手機號碼必須以 09 開頭，共 10 位數字。</Form.Text>
                    </Form.Group>

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
                            {areas.map(area => (
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
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>大頭照</Form.Label>
                        <div className="mb-2">
                            {formData.profile_url && (
                                <img
                                    src={formData.profile_url}
                                    alt="Avatar"
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                />
                            )}
                        </div>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>

                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? '更新中...' : '更新'}
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default Profile;
