import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    // Redirect them to the /admin login page, but save the current location they were trying to go to
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
}
