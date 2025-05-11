import { createContext, useContext, useState } from 'react';
import type { AuthContextType, User } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthProvider = (): AuthContextType => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
    );

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return { isLoggedIn: !!token, token, user, login, logout };
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
