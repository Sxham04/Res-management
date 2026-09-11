import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

// send user to login or correct dashboard from root route
function HomeRedirect() {
  const { token, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/student" replace />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* home route */}
          <Route path="/" element={<HomeRedirect />} />

          {/* login route */}
          <Route path="/login" element={<Login />} />

          {/* admin page */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* student page */}
          <Route
            path="/student"
            element={
              <PrivateRoute allowedRole="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* any other route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;