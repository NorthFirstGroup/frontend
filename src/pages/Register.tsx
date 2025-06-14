import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { signUp, LogInAndUpResponseData } from '../api/authApi';
import { ApiResponse } from '../types/ApiResponse'; // 確保路徑正確
import { ApiError } from '../types/ApiError';
import { handleApiError } from '../utils/errorHandling';
import UserNameInput from '../components/UserNameInput';
import PasswordFields from '../components/PasswordFields';
import { decodeToken } from '../utils/jwt';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        name: ''
    });

    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/;

    const validateField = (name: string, value: string) => {
        let errorMsg = '';

        if (name === 'email' && !emailRegex.test(value)) {
            errorMsg = 'Email 格式不正確';
        }

        if (name === 'name' && !nameRegex.test(value)) {
            errorMsg = '暱稱格式錯誤，限 2-10 字元，中英文或數字，不可含空白或特殊符號';
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'name') setName(value);

        validateField(name, value);
    };

    const handlePasswordChange = (name: 'password' | 'confirmPassword', value: string) => {
        if (name === 'password') {
            setPassword(value);
        } else {
            setConfirmPassword(value);
        }
    };

    const isFormValid = () => {
        return (
            !errors.email &&
            !errors.name &&
            password &&
            confirmPassword &&
            password === confirmPassword &&
            email &&
            name
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        if (!isFormValid()) {
            setSubmitError('請確認所有欄位格式正確');
            return;
        }

        try {
            const response: ApiResponse<LogInAndUpResponseData> = await signUp({ email, name, password });
            if (response.data) {
                const decodedData = decodeToken(response.data.token);
                login(response.data.token, {
                    email,
                    nickname: name,
                    role: decodedData?.role || 'USER',
                    id: decodedData?.id,
                    profile_url: ''
                });
            }
        } catch (error: unknown) {
            const errorMessage = handleApiError(error, '註冊失敗');
            setSubmitError(errorMessage);
            if (error instanceof ApiError) {
                console.warn('Bad Request:', error.data);
            } else {
                console.error('註冊錯誤:', error);
            }
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h3>會員註冊</h3>
            <Form onSubmit={handleSubmit}>
                {submitError && <Alert variant="danger">{submitError}</Alert>}

                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>會員帳號</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="請輸入 Email"
                        value={email}
                        onChange={handleInputChange}
                        onBlur={e => validateField('email', e.target.value)}
                    />
                    {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                </Form.Group>

                <UserNameInput
                    inputLabel="暱稱"
                    inputName="name"
                    value={name}
                    onChange={handleInputChange}
                    error={errors.name}
                />

                <PasswordFields onChange={handlePasswordChange} />

                <Button variant="primary" type="submit" className="w-100" disabled={!isFormValid()}>
                    確認送出
                </Button>
            </Form>

            <p className="mt-3">
                已有帳號？ <a href="/login">登入</a>
            </p>
        </Container>
    );
};

export default Register;
