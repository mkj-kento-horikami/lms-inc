import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Workspace } from '../../types/Workspace';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableSortLabel,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Edit, Delete, FileCopy, Refresh } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles.css';

const WorkspaceManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', createdBy: '' });
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Workspace>('name');

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const querySnapshot = await getDocs(collection(db, 'workspaces'));
      const workspacesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        inviteURL: doc.data().inviteURL || generateInviteURL(doc.id)
      })) as Workspace[];
      setWorkspaces(workspacesData);
    };

    fetchWorkspaces();
  }, []);

  const handleAddWorkspace = async () => {
    if (currentUser) {
      const docRef = await addDoc(collection(db, 'workspaces'), {
        ...newWorkspace,
        createdBy: currentUser.displayName || currentUser.email,
      });
      setWorkspaces([...workspaces, { id: docRef.id, ...newWorkspace, createdBy: currentUser.displayName || currentUser.email, inviteURL: generateInviteURL(docRef.id) } as Workspace]);
      setNewWorkspace({ name: '', createdBy: '' });
    }
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setOpen(true);
  };

  const handleUpdateWorkspace = async () => {
    if (editingWorkspace) {
      const workspaceRef = doc(db, 'workspaces', editingWorkspace.id);
      const { id, ...updatedWorkspace } = editingWorkspace; // id を除いたオブジェクトを作成
      await updateDoc(workspaceRef, updatedWorkspace);
      setWorkspaces(workspaces.map(ws => (ws.id === editingWorkspace.id ? editingWorkspace : ws)));
      setEditingWorkspace(null);
      setOpen(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    await deleteDoc(doc(db, 'workspaces', workspaceId));
    setWorkspaces(workspaces.filter(ws => ws.id !== workspaceId));
  };

  const handleClose = () => {
    setOpen(false);
    setEditingWorkspace(null);
  };

  const generateInviteURL = (workspaceId: string) => {
    const inviteId = uuidv4();
    return `${window.location.origin}/invite/${inviteId}?workspaceId=${workspaceId}`;
  };

  const handleCopyToClipboard = (url: string | undefined) => {
    if (url) {
      navigator.clipboard.writeText(url);
    }
  };

  const handleRegenerateInviteURL = async (workspaceId: string) => {
    const newInviteURL = generateInviteURL(workspaceId);
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    await updateDoc(workspaceRef, { inviteURL: newInviteURL });
    setWorkspaces(workspaces.map(ws => ws.id === workspaceId ? { ...ws, inviteURL: newInviteURL } : ws));
  };

  const handleRequestSort = (property: keyof Workspace) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedWorkspaces = [...workspaces].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return (order === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
    }

    return 0;
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Workspace Management</Typography>

      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add New Workspace</Typography>
          <form onSubmit={e => { e.preventDefault(); handleAddWorkspace(); }}>
            <TextField
              label="Workspace Name"
              value={newWorkspace.name}
              onChange={e => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
              fullWidth
              margin="normal"
            />
          </form>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained" color="primary" onClick={handleAddWorkspace}>Add Workspace</Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Workspace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the workspace information below.
          </DialogContentText>
          {editingWorkspace && (
            <form onSubmit={e => { e.preventDefault(); handleUpdateWorkspace(); }}>
              <TextField
                label="Workspace Name"
                value={editingWorkspace.name}
                onChange={e => setEditingWorkspace({ ...editingWorkspace, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Created By"
                value={editingWorkspace.createdBy}
                onChange={e => setEditingWorkspace({ ...editingWorkspace, createdBy: e.target.value })}
                fullWidth
                margin="normal"
              />
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button type="submit" color="primary">Update Workspace</Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Typography variant="h6" gutterBottom>Existing Workspaces</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'createdBy'}
                  direction={orderBy === 'createdBy' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdBy')}
                >
                  Created By
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">Actions</TableCell>
              <TableCell className="table-head-cell">Invite URL</TableCell>
              <TableCell className="table-head-cell">Copy/Regenerate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedWorkspaces.map(workspace => (
              <TableRow key={workspace.id} className="table-row">
                <TableCell>{workspace.id}</TableCell>
                <TableCell>{workspace.name}</TableCell>
                <TableCell>{workspace.createdBy}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <IconButton className="icon-button" onClick={() => handleEditWorkspace(workspace)}><Edit fontSize="small" /></IconButton>
                    <IconButton className="icon-button" onClick={() => handleDeleteWorkspace(workspace.id)}><Delete fontSize="small" /></IconButton>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{workspace.inviteURL || ''}</Typography>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {workspace.inviteURL && (
                      <IconButton className="icon-button" onClick={() => handleCopyToClipboard(workspace.inviteURL)}><FileCopy fontSize="small" /></IconButton>
                    )}
                    <IconButton className="icon-button" onClick={() => handleRegenerateInviteURL(workspace.id)}><Refresh fontSize="small" /></IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default WorkspaceManagement;