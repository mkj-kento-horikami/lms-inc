import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';
import PasswordReset from './PasswordReset';
import UserProfile from './user/UserProfile';
import AdminDashboard from './admin/AdminDashboard';
import InstructorDashboard from './instructor/InstructorDashboard';
import UserDashboard from './user/UserDashboard';
import Header from './Header';
import WorkspaceSelector from './WorkspaceSelector';
import { WorkspaceProvider } from '../contexts/WorkspaceContext';
import '../styles/App.css'; // パスが正しいか確認

const App: React.FC = () => {
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
              <Route path="/workspace-selector" element={<WorkspaceSelector />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/instructor/*" element={<InstructorDashboard />} />
              <Route path="/user/*" element={<UserDashboard />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WorkspaceProvider>
  );
};

export default App;