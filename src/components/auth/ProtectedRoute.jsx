import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to appropriate login page based on where they were trying to go
        const loginPath = adminOnly ? '/admin/login' : '/login';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (adminOnly && role !== 'admin') {
        // If it's an admin-only route and user is not admin, redirect to home or a generic error page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
