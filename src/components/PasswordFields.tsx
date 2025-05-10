// src/components/PasswordFields.tsx
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

interface PasswordFieldsProps {
    onChange: (name: 'password' | 'confirmPassword', value: string) => void;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({ onChange }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: ''
    });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;

    const validatePassword = (value: string) => {
        if (!passwordRegex.test(value)) {
            return '密碼格式錯誤，需 8-16 字元，包含大小寫字母與數字';
        }
        return '';
    };

    const validateConfirmPassword = (passwordValue: string, confirmValue: string) => {
        if (!isConfirmPasswordTouched) return '';
        if (confirmValue !== passwordValue) {
            return '密碼不一致';
        }
        return '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'password') {
            setPassword(value);
            onChange(name, value); // 回傳密碼與確認密碼給父元件
        }

        if (name === 'confirmPassword') {
            setConfirmPassword(value);
            onChange(name, value);
        }
    };

    const handlePasswordBlur = (value: string) => {
        const passwordError = validatePassword(value);
        setErrors(prev => ({ ...prev, password: passwordError }));

        // 同步檢查確認密碼
        const confirmPasswordError = validateConfirmPassword(value, confirmPassword);
        setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
    };

    const handleConfirmPasswordBlur = (value: string) => {
        setIsConfirmPasswordTouched(true);
        const confirmPasswordError = validateConfirmPassword(password, value);
        setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'password' | 'confirmPassword') => {
        const { key, target } = e;
        if (target instanceof HTMLInputElement && key === 'Enter') {
            if (field === 'password') {
                handlePasswordBlur(target.value);
            }
            if (field === 'confirmPassword') {
                handleConfirmPasswordBlur(target.value);
            }
        }
    };

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label>設定密碼</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    placeholder="請輸入密碼"
                    value={password}
                    onChange={handleInputChange}
                    onBlur={e => handlePasswordBlur(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'password')}
                />
                {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>確認密碼</Form.Label>
                <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="再次輸入密碼"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    onBlur={e => handleConfirmPasswordBlur(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'confirmPassword')}
                />
                {errors.confirmPassword && <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>}
            </Form.Group>
        </>
    );
};

export default PasswordFields;
