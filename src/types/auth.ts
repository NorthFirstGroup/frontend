export interface User {
    email: string;
    nickname?: string;
}

export interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}
