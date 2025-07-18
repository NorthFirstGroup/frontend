export interface User {
    email: string;
    nickname?: string;
    role?: 'ORGANIZER' | 'USER' | null;
    profile_url?: string;
    id?: string;
}

export interface AuthContextType {
    isLoggedIn: boolean;
    userRole: string;
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (updatedUserData: Partial<User>) => void;
}
