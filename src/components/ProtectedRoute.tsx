import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'instructor' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <Container sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" color="error" gutterBottom>
            アクセス権限がありません
          </Typography>
          <Typography variant="body1" paragraph>
            このページを表示するには{requiredRole}権限が必要です。
          </Typography>
          <Typography variant="body2" color="textSecondary">
            現在のロール: {userRole}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => {
              switch (userRole) {
                case 'admin':
                  window.location.href = '/admin/dashboard';
                  break;
                case 'instructor':
                  window.location.href = '/instructor/dashboard';
                  break;
                default:
                  window.location.href = '/user/dashboard';
              }
            }}
          >
            ダッシュボードに戻る
          </Button>
        </Paper>
      </Container>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;