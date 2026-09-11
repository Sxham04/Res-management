import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children, allowedRole }) {
  const { token, role, loading } = useAuth();

  // wait while reading local storage
  if (loading) {
    return <div>Loading...</div>;
  }

  // if no token, send user to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if user has wrong role, send them to their own dashboard
  if (allowedRole && role !== allowedRole) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/student" replace />;
    }
  }

  // show the protected page
  return children;
}

export default PrivateRoute;