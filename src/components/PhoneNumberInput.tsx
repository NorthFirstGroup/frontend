import React from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const PhoneNumberInput: React.FC<Props> = ({ value, onChange, error }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>手機號碼</Form.Label>
            <Form.Control
                type="tel"
                name="phone_num"
                value={value}
                onChange={onChange}
                placeholder="請輸入手機號碼"
                pattern="^09\d{8}$"
            />
            {error && <div className="text-danger">{error}</div>}
        </Form.Group>
    );
};

export default PhoneNumberInput;
