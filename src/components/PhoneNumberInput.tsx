import React from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    inputLabel: string;
    inputName: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

const PhoneNumberInput: React.FC<Props> = ({ inputLabel, inputName, value, onChange, error }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>
                <span className="text-danger">* </span>
                {inputLabel}
            </Form.Label>
            <Form.Control
                type="tel"
                name={inputName}
                value={value}
                onChange={onChange}
                placeholder={'請輸入' + inputLabel}
                pattern="^09\d{8}$"
            />
            {error && <div className="text-danger">{error}</div>}
        </Form.Group>
    );
};

export default PhoneNumberInput;
