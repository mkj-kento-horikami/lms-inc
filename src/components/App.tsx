import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';
import PasswordReset from './PasswordReset';
import UserProfile from './user/UserProfile';
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
import { WorkspaceProvider } from '../contexts/WorkspaceContext';
import { Container } from '@mui/material';
import '../styles/App.css'; // パスが正しいか確認

const App: React.FC = () => {
  return (
    <WorkspaceProvider>
      <Router>
        <div>
          <Header />
          <Container>
            <main>
              <Routes>
                <Route path="/invite/:inviteId" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/workspace-selector" element={<WorkspaceSelector />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/user-management" element={<UserManagement />} />
                <Route path="/admin/workspace-management" element={<WorkspaceManagement />} />
                <Route path="/admin/learning-url-management" element={<LearningURLManagement />} />
                <Route path="/admin/learning-records" element={<LearningRecords />} />
                <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                <Route path="/instructor/user-management" element={<InstructorUserManagement />} />
                <Route path="/instructor/learning-records" element={<InstructorLearningRecords />} />
                <Route path="/instructor/learning-urls" element={<InstructorLearningURLs />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/learning-records" element={<UserLearningRecords />} />
                <Route path="/user/learning-urls" element={<UserLearningURLs />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </main>
          </Container>
        </div>
      </Router>
    </WorkspaceProvider>
  );
};

export default App;