import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
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
    <AppBar position="static" style={{ backgroundColor: '#0d47a1' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography variant="h6">
          LMS
        </Typography>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          {user && (
            <>
              <Typography variant="body1" style={{ color: '#fff', marginRight: '20px' }}>User: {user.displayName}</Typography>
              <Typography variant="body1" style={{ color: '#fff', marginRight: '20px' }}>Email: {user.email}</Typography>
              {selectedWorkspace && (
                <>
                  <Typography variant="body1" style={{ color: '#fff', marginRight: '20px' }}>Workspace: {selectedWorkspace.name}</Typography>
                  <Typography variant="body1" style={{ color: '#fff', marginRight: '20px' }}>Role: {selectedWorkspace.role}</Typography>
                </>
              )}
              <Button onClick={handleLogout} style={{ color: '#fff' }}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
      <Toolbar>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
            {!user && (
              <>
                <li style={{ marginRight: '20px' }}><Link to="/login" style={linkStyle}>Login</Link></li>
                <li style={{ marginRight: '20px' }}><Link to="/signup" style={linkStyle}>Signup</Link></li>
              </>
            )}
            {selectedWorkspace && (
              <>
                {selectedWorkspace.role === 'admin' && (
                  <>
                    <li style={{ marginRight: '20px' }}><Link to="/admin/dashboard" style={linkStyle}>Admin Dashboard</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/admin/user-management" style={linkStyle}>User Management</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/admin/workspace-management" style={linkStyle}>Workspace Management</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/admin/learning-url-management" style={linkStyle}>Learning URL Management</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/admin/learning-records" style={linkStyle}>Learning Records</Link></li>
                  </>
                )}
                {selectedWorkspace.role === 'instructor' && (
                  <>
                    <li style={{ marginRight: '20px' }}><Link to="/instructor/dashboard" style={linkStyle}>Instructor Dashboard</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/instructor/user-management" style={linkStyle}>User Management</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/instructor/learning-records" style={linkStyle}>Learning Records</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/instructor/learning-urls" style={linkStyle}>Learning URLs</Link></li>
                  </>
                )}
                {selectedWorkspace.role === 'user' && (
                  <>
                    <li style={{ marginRight: '20px' }}><Link to="/user/dashboard" style={linkStyle}>User Dashboard</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/user/learning-records" style={linkStyle}>Learning Records</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/user/learning-urls" style={linkStyle}>Learning URLs</Link></li>
                  </>
                )}
              </>
            )}
            {isAdmin && !selectedWorkspace && (
              <>
                <li style={{ marginRight: '20px' }}><Link to="/admin/dashboard" style={linkStyle}>Admin Dashboard</Link></li>
                <li style={{ marginRight: '20px' }}><Link to="/admin/user-management" style={linkStyle}>User Management</Link></li>
                <li style={{ marginRight: '20px' }}><Link to="/admin/workspace-management" style={linkStyle}>Workspace Management</Link></li>
                <li style={{ marginRight: '20px' }}><Link to="/admin/learning-url-management" style={linkStyle}>Learning URL Management</Link></li>
                <li style={{ marginRight: '20px' }}><Link to="/admin/learning-records" style={linkStyle}>Learning Records</Link></li>
              </>
            )}
          </ul>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  transition: 'color 0.3s',
};

export default Header;