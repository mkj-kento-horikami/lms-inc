import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useWorkspace } from '../contexts/WorkspaceContext';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedWorkspace } = useWorkspace();

  useEffect(() => {
    const logout = async () => {
      const confirmLogout = window.confirm('Are you sure you want to logout?');
      if (confirmLogout) {
        await signOut(auth);
        setSelectedWorkspace(null); // ログアウト時にワークスペースをリセット
        alert('You have been logged out.');
        navigate('/login');
      } else {
        navigate('/dashboard');
      }
    };

    logout();
  }, [navigate, setSelectedWorkspace]);

  return <div>Logging out...</div>;
};

export default Logout;