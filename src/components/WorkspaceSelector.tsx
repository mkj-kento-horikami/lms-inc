import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useWorkspace } from '../contexts/WorkspaceContext';

const WorkspaceSelector: React.FC = () => {
  const { selectedWorkspace, setSelectedWorkspace, workspaces } = useWorkspace();
  const navigate = useNavigate();

  const handleWorkspaceChange = (event: SelectChangeEvent<string>) => {
    const [workspaceId, role] = event.target.value.split('-');
    const workspace = workspaces.find(ws => ws.workspaceId === workspaceId && ws.role === role) || null;
    setSelectedWorkspace(workspace);
    if (workspace?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (workspace?.role === 'instructor') {
      navigate('/instructor/dashboard');
    } else if (workspace?.role === 'user') {
      navigate('/user/dashboard');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Workspace Selector</Typography>
      <FormControl variant="outlined" fullWidth>
        <Select
          value={selectedWorkspace ? `${selectedWorkspace.workspaceId}-${selectedWorkspace.role}` : ''}
          onChange={handleWorkspaceChange}
          displayEmpty
        >
          {workspaces.map(ws => (
            <MenuItem key={`${ws.workspaceId}-${ws.role}`} value={`${ws.workspaceId}-${ws.role}`}>
              {`${ws.name} - ${ws.role}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );
};

export default WorkspaceSelector;