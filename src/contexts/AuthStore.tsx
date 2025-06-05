import { createContext, useContext, useState, useCallback } from 'react';
import type { AuthContextType, User } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user'
};

const getStoredToken = (): string | null => localStorage.getItem(STORAGE_KEYS.TOKEN);

const getStoredUser = (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    try {
        return userData ? JSON.parse(userData) : null;
    } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        return null;
    }
};

export const useAuthProvider = (): AuthContextType => {
    const [token, setToken] = useState<string | null>(getStoredToken());
    const [user, setUser] = useState<User | null>(getStoredUser());

    const login = useCallback((newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    }, []);

    const updateUser = useCallback((updatedUserData: Partial<User>) => {
        setUser(prevUser => {
            if (!prevUser) {
                // If there's no previous user, we can't update.
                // You might throw an error or just return null/undefined depending on desired behavior.
                console.warn('Attempted to update user when no user was logged in.');
                return null;
            }
            const newUser = { ...prevUser, ...updatedUserData };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
            return newUser;
        });
    }, []);

    return { isLoggedIn: !!token, userRole: user?.role || '', token, user, login, logout, updateUser };
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
