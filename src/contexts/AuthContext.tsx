import { ReactNode } from 'react';
import { AuthContext } from './AuthStore';
import { useAuthProvider } from './AuthStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuthProvider();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
