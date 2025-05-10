import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthStore';

export const userAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('userAuth must be used within AuthProvider');
    return context;
};
