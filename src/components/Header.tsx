import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useWorkspace } from '../contexts/WorkspaceContext';

const Header: React.FC = () => {
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      await signOut(auth);
      setSelectedWorkspace(null); // ログアウト時にワークスペースをリセット
      alert('You have been logged out.');
      navigate('/login');
    }
  };

  return (
    <header>
      <h1>Header</h1>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          {selectedWorkspace && (
            <>
              <li>Workspace: {selectedWorkspace.workspaceId}</li>
              <li>Role: {selectedWorkspace.role}</li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;