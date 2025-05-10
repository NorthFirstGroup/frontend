import React from 'react';
import { Navigate } from 'react-router-dom';
import { userAuth } from '../hooks/userAuth';

interface Props {
    children: React.JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
    const { isLoggedIn } = userAuth();
    return isLoggedIn ? children : <Navigate to="/login" replace />;
}
