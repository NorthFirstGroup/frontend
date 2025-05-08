import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getProfile, updateProfile } from '../api/profile';
import { useAuth } from '../hooks/useAuth';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ProfileFormData {
    name: string;
    phone_num: string;
    birth_date: string;
    profile_url: string;
}

const Profile: React.FC = () => {
    const { user } = useAuth();

    const email = user!.email;
    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        phone_num: '',
        birth_date: '',
        profile_url: ''
    });

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const profileData = await getProfile();
                // Format birth_date using Day.js
                const formattedBirthDate = dayjs(profileData.birth_date).format('YYYY-MM-DD');
                setFormData({ ...profileData, birth_date: formattedBirthDate });
            } catch (err) {
                console.error(err);
                setError('無法取得會員資料');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const updatedProfile = await updateProfile(formData, file || undefined);
            const formattedBirthDate = dayjs(updatedProfile.birth_date).format('YYYY-MM-DD');
            setFormData({
                name: updatedProfile?.name || '',
                phone_num: updatedProfile.phone_num || '',
                birth_date: formattedBirthDate,
                profile_url: updatedProfile.profile_url || ''
            });
            setFile(null);
            setSuccess('會員資料已更新');
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : '更新失敗，請稍後再試');
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
                        <Form.Label>電子郵件</Form.Label>
                        <Form.Control type="email" name="email" value={email} readOnly plaintext disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>暱稱</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            maxLength={10}
                            placeholder="請輸入暱稱"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>手機號碼</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone_num"
                            value={formData.phone_num}
                            onChange={handleInputChange}
                            placeholder="請輸入手機號碼"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>出生年月日</Form.Label>
                        <Form.Control
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleInputChange}
                        />
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
