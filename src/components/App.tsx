import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';
import PasswordReset from './PasswordReset';
import UserProfile from './user/UserProfile';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
import InstructorDashboard from './instructor/InstructorDashboard';
import Header from './Header';
import WorkspaceSelector from './WorkspaceSelector';
import { WorkspaceProvider, useWorkspace } from '../contexts/WorkspaceContext';
import useAuth from '../hooks/useAuth';
import '../styles/App.css'; // パスが正しいか確認

const App: React.FC = () => {
  const { user, workspaces, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <WorkspaceProvider>
      <Router>
        <div>
          <Header />
          <main>
            <Routes>
              <Route path="/invite/:inviteId" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/workspace-selector" element={<WorkspaceSelector workspaces={workspaces} isAdmin={isAdmin} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WorkspaceProvider>
  );
};

const Dashboard: React.FC = () => {
  const { selectedWorkspace } = useWorkspace();

  if (!selectedWorkspace) {
    return <Navigate to="/workspace-selector" />;
  }

  if (selectedWorkspace.role === 'admin') {
    return <AdminDashboard />;
  } else if (selectedWorkspace.role === 'instructor') {
    return <InstructorDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default App;