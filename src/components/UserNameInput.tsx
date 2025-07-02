import React from 'react';
import { Form } from 'react-bootstrap';

interface UserNameInputProps {
    inputLabel: string;
    inputName: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const UserNameInput: React.FC<UserNameInputProps> = ({ inputLabel, inputName, value, onChange, error }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>
                <span className="text-danger">* </span>
                {inputLabel}
            </Form.Label>
            <Form.Control
                type="text"
                name={inputName}
                value={value}
                onChange={onChange}
                placeholder={'請輸入' + inputLabel}
            />
            {error && <Form.Text className="text-danger">{error}</Form.Text>}
        </Form.Group>
    );
};

export default UserNameInput;
