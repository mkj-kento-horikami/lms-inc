import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';
import PasswordReset from './PasswordReset';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import WorkspaceManagement from './admin/WorkspaceManagement';
import LearningURLManagement from './admin/LearningURLManagement';
import LearningRecords from './admin/LearningRecords';
import InstructorDashboard from './instructor/InstructorDashboard';
import InstructorUserManagement from './instructor/UserManagement';
import InstructorLearningRecords from './instructor/LearningRecords';
import InstructorLearningURLs from './instructor/LearningURLs';
import UserDashboard from './user/UserDashboard';
import UserLearningRecords from './user/LearningRecords';
import UserLearningURLs from './user/LearningURLs';
import Header from './Header';
import WorkspaceSelector from './WorkspaceSelector';
import ProtectedRoute from './ProtectedRoute';
import { WorkspaceProvider } from '../contexts/WorkspaceContext';
import { AuthProvider } from '../contexts/AuthContext';
import { Container } from '@mui/material';
import '../styles/App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <Router>
          <div>
            <Header />
            <Container>
              <main>
                <Routes>
                  {/* 認証不要のルート */}
                  <Route path="/invite/:inviteId" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/password-reset" element={<PasswordReset />} />

                  {/* 管理者用ルート */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/user-management"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/workspace-management"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <WorkspaceManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/learning-url-management"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <LearningURLManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/learning-records"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <LearningRecords />
                      </ProtectedRoute>
                    }
                  />

                  {/* インストラクター用ルート */}
                  <Route
                    path="/instructor/dashboard"
                    element={
                      <ProtectedRoute requiredRole="instructor">
                        <InstructorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/instructor/user-management"
                    element={
                      <ProtectedRoute requiredRole="instructor">
                        <InstructorUserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/instructor/learning-records"
                    element={
                      <ProtectedRoute requiredRole="instructor">
                        <InstructorLearningRecords />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/instructor/learning-urls"
                    element={
                      <ProtectedRoute requiredRole="instructor">
                        <InstructorLearningURLs />
                      </ProtectedRoute>
                    }
                  />

                  {/* ユーザー用ルート */}
                  <Route
                    path="/workspace-selector"
                    element={
                      <ProtectedRoute>
                        <WorkspaceSelector />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/workspace/:workspaceId"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user/learning-records"
                    element={
                      <ProtectedRoute>
                        <UserLearningRecords />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user/learning-urls"
                    element={
                      <ProtectedRoute>
                        <UserLearningURLs />
                      </ProtectedRoute>
                    }
                  />

                  {/* デフォルトルート */}
                  <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
              </main>
            </Container>
          </div>
        </Router>
      </WorkspaceProvider>
    </AuthProvider>
  );
};

export default App;