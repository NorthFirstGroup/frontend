import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: string;
    role: 'ORGANIZER' | 'USER' | null;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        // console.log('Decoded Token:', decoded);
        return decoded;
    } catch (error) {
        console.error('Invalid JWT Token:', error);
        return null;
    }
};
