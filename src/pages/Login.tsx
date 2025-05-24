import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { loginApi, LoginResponseData } from '../api/authApi';
import { ApiResponse } from '../types/ApiResponse'; // 確保路徑正確
import { ApiError } from '../types/ApiError';
import { handleApiError } from '../utils/errorHandling';
import { decodeToken } from '../utils/jwt';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState('');
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    useEffect(() => {
        if (isLoggedIn) {
            navigate(from);
        }
    }, [isLoggedIn, navigate, from]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            setSubmitError('請填寫所有欄位');
            return;
        }
        if (!emailRegex.test(email)) {
            setSubmitError('Email 格式不正確');
            return;
        }

        //test only : change default 'USER' to 'ORGANIZER'
        try {
            const response: ApiResponse<LoginResponseData> = await loginApi(email, password);
            if (response.data) {
                const decodedData = decodeToken(response.data.token);
                login(response.data.token, {
                    email,
                    nickname: response.data.user.name,
                    role: decodedData?.role || 'USER',
                    id: decodedData?.id
                });
            }
        } catch (error: unknown) {
            const errorMessage = handleApiError(error, '登入失敗');
            setSubmitError(errorMessage);
            if (error instanceof ApiError) {
                console.warn('Bad Request:', error.data);
            } else {
                console.error('登入錯誤:', error);
            }
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h3>登入</h3>
            {submitError && <Alert variant="danger">{submitError}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>電子郵件</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="請輸入 Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>密碼</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="請輸入密碼"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="my-hover-gradient-btn">
                    登入
                </Button>
            </Form>

            <p>
                沒有 Go Ticket 帳號嗎？<a href="/register">前往註冊</a>
            </p>
        </Container>
    );
};

export default Login;
