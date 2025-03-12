import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'instructor' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // 権限がない場合は、ユーザーのロールに応じたダッシュボードにリダイレクト
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      case 'instructor':
        return <Navigate to="/instructor/dashboard" />;
      default:
        return <Navigate to="/user/dashboard" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;