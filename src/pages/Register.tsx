import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { registerApi } from '../api/authApi';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 阻止預設 GET 行為

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

        if (!email || !name || !password || !confirmPassword) {
            setError('請填寫所有欄位');
            return;
        }
        if (!emailRegex.test(email)) {
            setError('Email 格式不正確');
            return;
        }

        if (name.length < 2 || name.length > 10) {
            setError('暱稱長度錯誤');
            return;
        }

        if (!passwordRegex.test(password)) {
            setError('密碼格式錯誤，需包含大小寫字母與數字，長度 8-16 字元');
            return;
        }

        if (password !== confirmPassword) {
            setError('密碼與確認密碼不一致');
            return;
        }

        try {
            // TODO: 成功註冊，後端 API 回傳 token
            const res = await registerApi({ email, name, password });
            // console.log(res);
            login(res.token, { email, nickname: name });
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : '發生未知錯誤，請稍後再試');
            // setError('註冊失敗');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h3>會員註冊</h3>
            <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>會員帳號</Form.Label>
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
                        placeholder="請輸入暱稱"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        minLength={2}
                        maxLength={10}
                        required
                    />
                    <Form.Text className="text-muted">最少2個字，最多10個字，不可包含任何特殊符號與空白</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>設定密碼</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="請輸入密碼"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <Form.Text className="text-muted">
                        密碼必須包含英文字母大小寫與數字，長度需介於 8 至 16 個字
                    </Form.Text>
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
                    確認送出
                </Button>
            </Form>
            <p>
                已有帳號：<a href="/login">登入</a>
            </p>
        </Container>
    );
};

export default Register;
