export interface User {
    email: string;
    nickname?: string;
    role?: string;
    avatar?: string;
    id?: string;
}

export interface AuthContextType {
    isLoggedIn: boolean;
    userRole: string;
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}
