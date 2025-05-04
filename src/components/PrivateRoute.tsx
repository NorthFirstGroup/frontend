import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    children: React.JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
    const isAuthenticated = !!localStorage.getItem('token'); // 判斷登入狀態

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
