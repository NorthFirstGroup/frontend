import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { loginApi } from '../api/auth';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            console.log('登入成功', result);
            localStorage.setItem('token', result.token);
            navigate('/dashboard');
        } catch (error: unknown) {
            if (error instanceof Error) {
                // Access error.message or other properties safely
                console.error(error.message);
            } else {
                // Handle cases where the error is not an Error object
                console.error('An unexpected error occurred');
            }
        }
    };

    return (
        <>
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
        </>
    );
};

export default Login;
