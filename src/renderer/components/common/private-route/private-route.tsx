import React from 'react';
import { Navigate } from 'react-router-dom';
import umbrella from 'umbrella-storage';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const hasToken = !!umbrella.getLocalStorage('token');

    if (!hasToken) {
        return <Navigate to="/account" replace />;
    }

    return children;
}
