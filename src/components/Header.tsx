import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, MenuItem, Select, FormControl, SelectChangeEvent, Tooltip } from '@mui/material';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { auth, db } from '../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const Header: React.FC = () => {
  const { selectedWorkspace, setSelectedWorkspace, workspaces, isAdmin } = useWorkspace();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [inviteLink, setInviteLink] = useState<string>('');

  useEffect(() => {
    const fetchInviteLink = async () => {
      if (selectedWorkspace) {
        const workspaceDoc = await getDoc(doc(db, 'workspaces', selectedWorkspace.workspaceId));
        if (workspaceDoc.exists()) {
          const workspaceData = workspaceDoc.data();
          setInviteLink(workspaceData.inviteURL);
        }
      }
    };

    fetchInviteLink();
  }, [selectedWorkspace]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const handleWorkspaceChange = (event: SelectChangeEvent<string>) => {
    const [workspaceId, role] = event.target.value.split('-');
    const workspace = workspaces.find(ws => ws.workspaceId === workspaceId && ws.role === role) || null;
    setSelectedWorkspace(workspace);
    if (workspace?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard');
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
              <FormControl variant="outlined" style={{ minWidth: 200, marginRight: '20px' }}>
                <Select
                  value={selectedWorkspace ? `${selectedWorkspace.workspaceId}-${selectedWorkspace.role}` : ''}
                  onChange={handleWorkspaceChange}
                  displayEmpty
                  style={{ color: '#fff', borderColor: '#fff' }}
                  inputProps={{
                    style: { color: '#fff', borderColor: '#fff' },
                  }}
                >
                  {workspaces.map(ws => (
                    <MenuItem key={`${ws.workspaceId}-${ws.role}`} value={`${ws.workspaceId}-${ws.role}`}>
                      {`${ws.name} - ${ws.role}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {inviteLink && (
                <Box style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                  <Typography variant="body1" style={{ color: '#fff', marginRight: '10px' }}>Invite Link:</Typography>
                  <Tooltip title="Copy Invite Link">
                    <Typography variant="body1" style={{ color: '#fff', cursor: 'pointer' }} onClick={handleCopyInviteLink}>
                      {inviteLink}
                    </Typography>
                  </Tooltip>
                </Box>
              )}
              <Button onClick={handleLogout} variant="contained" style={{ backgroundColor: '#808080', color: '#fff', marginLeft: '20px' }}>Logout</Button>
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
                    <li style={{ marginRight: '20px' }}><Link to="/instructor/learning-urls" style={linkStyle}>Learning URLs</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/instructor/user-management" style={linkStyle}>User Management</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/instructor/learning-records" style={linkStyle}>Learning Records</Link></li>
                  </>
                )}
                {selectedWorkspace.role === 'user' && (
                  <>
                    <li style={{ marginRight: '20px' }}><Link to="/user/dashboard" style={linkStyle}>User Dashboard</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/user/learning-urls" style={linkStyle}>Learning URLs</Link></li>
                    <li style={{ marginRight: '20px' }}><Link to="/user/learning-records" style={linkStyle}>Learning Records</Link></li>
                  </>
                )}
              </>
            )}
            {isAdmin && !selectedWorkspace && (
              <>
                <li style={{ marginRight: '20px' }}><Link to="/admin/dashboard" style={linkStyle}>Admin Dashboard</Link></li>
                <li style={{ marginRight: '20px' }}><Link to="/admin/learning-urls" style={linkStyle}>Learning URLs</Link></li>
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