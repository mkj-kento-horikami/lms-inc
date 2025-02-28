import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  SelectChangeEvent,
} from '@mui/material';

const WorkspaceSelector: React.FC = () => {
  const { currentUser } = useAuth();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (currentUser) {
        const q = query(collection(db, 'users'), where('id', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0].data();
        setWorkspaces(userData.workspaces);

        if (userData.workspaces.length === 1) {
          navigate(`/workspace/${userData.workspaces[0].workspaceId}`);
        }
      }
    };

    fetchWorkspaces();
  }, [currentUser, navigate]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkspace(event.target.value as string);
  };

  const handleSubmit = () => {
    if (selectedWorkspace) {
      navigate(`/workspace/${selectedWorkspace}`);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Workspace Selector</Typography>
      <FormControl fullWidth>
        <InputLabel>Workspace</InputLabel>
        <Select value={selectedWorkspace} onChange={handleChange}>
          {workspaces.map((workspace) => (
            <MenuItem key={workspace.workspaceId} value={workspace.workspaceId}>
              {workspace.workspaceId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!selectedWorkspace}
        style={{ marginTop: '16px' }}
      >
        Enter Workspace
      </Button>
    </Container>
  );
};

export default WorkspaceSelector;