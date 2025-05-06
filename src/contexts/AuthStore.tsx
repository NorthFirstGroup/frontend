import { createContext, useContext, useState } from 'react';
import type { AuthContextType, User } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthProvider = (): AuthContextType => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);

    const login = (newToken: string, user: User) => {
        localStorage.setItem('token', newToken);
        console.log('newToken', newToken);
        setToken(newToken);
        console.log('token', token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        console.log('token', token);
        setUser(null);
    };

    return { isLoggedIn: !!token, token, user, login, logout };
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
