import { ReactNode } from 'react';
import { AuthContext } from './AuthStore';
import { userAuthProvider } from './AuthStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = userAuthProvider();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
