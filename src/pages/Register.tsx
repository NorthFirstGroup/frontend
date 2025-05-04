import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { registerApi } from '../api/auth';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    // const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 阻止預設 GET 行為

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !name || !password || !confirmPassword) {
            setError('請填寫所有欄位');
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Email 格式不正確');
            return;
        }

        if (name.length > 10) {
            setError('暱稱請不要超過10個字');
            return;
        }
        if (password !== confirmPassword) {
            setError('密碼與確認密碼不一致');
            return;
        }
        if (password.length < 8 || password.length > 16) {
            setError('密碼長度錯誤');
            return;
        }

        try {
            // TODO: 成功註冊，後端 API 回傳 token
            const res = await registerApi({ email, name, password });
            console.log(res);
            // localStorage.setItem('token', res.token); // 假設註冊後自動登入
            // navigate('/dashboard');
        } catch (error: unknown) {
            if (error instanceof Error) {
                // Access error.message or other properties safely
                setError('註冊失敗');
                console.error(error.message);
            } else {
                // Handle cases where the error is not an Error object
                console.error('An unexpected error occurred');
            }
        }
    };

    return (
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

            <Form.Group className="mb-3" controlId="formName">
                <Form.Label>暱稱</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="請輸入暱稱 (最多10個字)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={10}
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

            <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>確認密碼</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="再次輸入密碼"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
                註冊
            </Button>
        </Form>
    );
};

export default Register;
