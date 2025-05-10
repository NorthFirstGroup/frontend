import React from 'react';
import { Form } from 'react-bootstrap';

interface UserNameInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const UserNameInput: React.FC<UserNameInputProps> = ({ value, onChange, error }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>暱稱</Form.Label>
            <Form.Control type="text" name="name" value={value} onChange={onChange} placeholder="請輸入暱稱" />
            {error && <Form.Text className="text-danger">{error}</Form.Text>}
        </Form.Group>
    );
};

export default UserNameInput;
