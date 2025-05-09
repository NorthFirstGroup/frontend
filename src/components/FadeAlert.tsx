import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

interface FadeAlertProps {
    message: string;
    variant?: 'success' | 'danger' | 'warning' | 'info';
    duration?: number;
}

const FadeAlert: React.FC<FadeAlertProps> = ({ message, variant = 'success', duration = 10000 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    return (
        <div className={`alert-container ${visible ? 'fade-in' : 'fade-out'}`}>
            {visible && <Alert variant={variant}>{message}</Alert>}
        </div>
    );
};

export default FadeAlert;
