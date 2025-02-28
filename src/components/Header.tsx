import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { auth } from '../firebaseConfig';

const Header: React.FC = () => {
  const { selectedWorkspace, isAdmin } = useWorkspace();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <header>
      <h1>Header</h1>
      <nav>
        <ul>
          {!user && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </>
          )}
          {user && (
            <>
              <li>User: {user.displayName}</li>
              <li>Email: {user.email}</li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
          {selectedWorkspace && (
            <>
              <li>Workspace: {selectedWorkspace.name}</li>
              <li>Role: {selectedWorkspace.role}</li>
              {selectedWorkspace.role === 'admin' && (
                <>
                  <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                  <li><Link to="/admin/user-management">User Management</Link></li>
                </>
              )}
              {selectedWorkspace.role === 'instructor' && (
                <>
                  <li><Link to="/instructor/dashboard">Instructor Dashboard</Link></li>
                  <li><Link to="/instructor/learning-records">Learning Records</Link></li>
                  <li><Link to="/instructor/learning-urls">Learning URLs</Link></li>
                </>
              )}
              {selectedWorkspace.role === 'user' && (
                <>
                  <li><Link to="/user/dashboard">User Dashboard</Link></li>
                  <li><Link to="/user/profile">User Profile</Link></li>
                </>
              )}
            </>
          )}
          {isAdmin && !selectedWorkspace && (
            <>
              <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
              <li><Link to="/admin/user-management">User Management</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;