import { createContext, useContext, useState } from 'react';
import type { AuthContextType, User } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user'
};

const getStoredToken = (): string | null => localStorage.getItem(STORAGE_KEYS.TOKEN);

const getStoredUser = (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
};

export const useAuthProvider = (): AuthContextType => {
    const [token, setToken] = useState<string | null>(getStoredToken());
    const [user, setUser] = useState<User | null>(getStoredUser());

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    return { isLoggedIn: !!token, userRole: user?.role || '', token, user, login, logout };
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
