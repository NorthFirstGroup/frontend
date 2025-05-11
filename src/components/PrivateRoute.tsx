import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth as useAuth } from '../hooks/useAuth';

interface Props {
    children: React.JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? children : <Navigate to="/login" replace />;
}
