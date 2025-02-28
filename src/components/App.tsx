import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
import '../styles/App.css'; // パスが正しいか確認

interface Workspace {
  workspaceId: string;
  role: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setWorkspaces(userDoc.data()?.workspaces || []);
          setIsAdmin(userDoc.data()?.isAdmin || false);
        }
      } else {
        setUser(null);
        setWorkspaces([]);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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