import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, MenuItem, Select, FormControl, SelectChangeEvent, Tooltip } from '@mui/material';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { auth, db } from '../firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import './Header.css'; // 追加

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
    alert('招待リンクをコピーしました');
  };

  return (
    <AppBar position="static" style={{ backgroundColor: selectedWorkspace?.role === 'admin' ? '#000' : '#0d47a1' }}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography variant="h6">
          LMS
        </Typography>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          {user && (
            <>
              {inviteLink && (
                <Box style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                  <Typography variant="body1" style={{ color: '#fff', marginRight: '10px' }}>招待リンク：</Typography>
                  <Tooltip title="招待リンクをコピー">
                    <Typography variant="body1" style={{ color: '#fff', cursor: 'pointer' }} onClick={handleCopyInviteLink}>
                      {inviteLink}
                    </Typography>
                  </Tooltip>
                </Box>
              )}
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
              <Button onClick={handleLogout} variant="contained" style={{ backgroundColor: '#808080', color: '#fff', marginLeft: '20px' }}>ログアウト</Button>
            </>
          )}
        </Box>
      </Toolbar>
      <Toolbar>
        <nav>
          <ul className="nav-list">
            {!user && (
              <>
                <li className="nav-item"><Link to="/login" className="nav-link">ログイン</Link></li>
                <li className="nav-item"><Link to="/signup" className="nav-link">新規登録</Link></li>
              </>
            )}
            {selectedWorkspace && (
              <>
                {selectedWorkspace.role === 'admin' && (
                  <>
                    <li className="nav-item"><Link to="/admin/dashboard" className="nav-link">管理者ダッシュボード</Link></li>
                    <li className="nav-item"><Link to="/admin/user-management" className="nav-link">ユーザー管理</Link></li>
                    <li className="nav-item"><Link to="/admin/workspace-management" className="nav-link">ワークスペース管理</Link></li>
                    <li className="nav-item"><Link to="/admin/learning-url-management" className="nav-link">学習URL管理</Link></li>
                    <li className="nav-item"><Link to="/admin/learning-records" className="nav-link">学習記録</Link></li>
                  </>
                )}
                {selectedWorkspace.role === 'instructor' && (
                  <>
                    <li className="nav-item"><Link to="/instructor/dashboard" className="nav-link">講師ダッシュボード</Link></li>
                    <li className="nav-item"><Link to="/instructor/learning-urls" className="nav-link">学習教材</Link></li>
                    <li className="nav-item"><Link to="/instructor/user-management" className="nav-link">ユーザー管理</Link></li>
                    <li className="nav-item"><Link to="/instructor/learning-records" className="nav-link">学習記録</Link></li>
                  </>
                )}
                {selectedWorkspace.role === 'user' && (
                  <>
                    <li className="nav-item"><Link to="/user/dashboard" className="nav-link">マイページ</Link></li>
                    <li className="nav-item"><Link to="/user/learning-urls" className="nav-link">学習教材</Link></li>
                    <li className="nav-item"><Link to="/user/learning-records" className="nav-link">学習記録</Link></li>
                  </>
                )}
              </>
            )}
            {isAdmin && !selectedWorkspace && (
              <>
                <li className="nav-item"><Link to="/admin/dashboard" className="nav-link">管理者ダッシュボード</Link></li>
                <li className="nav-item"><Link to="/admin/learning-urls" className="nav-link">学習教材</Link></li>
                <li className="nav-item"><Link to="/admin/user-management" className="nav-link">ユーザー管理</Link></li>
                <li className="nav-item"><Link to="/admin/workspace-management" className="nav-link">ワークスペース管理</Link></li>
                <li className="nav-item"><Link to="/admin/learning-url-management" className="nav-link">学習URL管理</Link></li>
                <li className="nav-item"><Link to="/admin/learning-records" className="nav-link">学習記録</Link></li>
              </>
            )}
          </ul>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;