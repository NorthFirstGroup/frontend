import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { loginApi } from '../api/authApi';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
            setError('請填寫所有欄位');
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Email 格式不正確');
            return;
        }

        try {
            const result = await loginApi(email, password);
            // console.log('登入成功', result.data);
            login(result.token, { email, nickname: result.user.name });
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : '發生未知錯誤，請稍後再試');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h3>登入</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
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

                <Button variant="primary" type="submit" className="w-100">
                    登入
                </Button>
            </Form>

            <p>
                沒有帳號？<a href="/register">註冊</a>
            </p>
        </Container>
    );
};

export default Login;
