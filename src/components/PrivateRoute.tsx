import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth as useAuth } from '../hooks/useAuth';

interface Props {
    children: React.JSX.Element;
    allowedRoles: string[];
}

export default function PrivateRoute({ children, allowedRoles }: Props) {
    const { isLoggedIn, userRole } = useAuth();
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
    }
    return children;
}
