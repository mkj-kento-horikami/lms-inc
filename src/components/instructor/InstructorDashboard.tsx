import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserManagement from './UserManagement';
import LearningRecords from './LearningRecords';
import LearningURLs from './LearningURLs';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { LearningLog } from '../../types/LearningLog';
import { LearningResource } from '../../types/LearningResource';
import { User } from '../../types/User';
import {
  Container,
  Typography,
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
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles.css';

const InstructorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [learningRecords, setLearningRecords] = useState<any[]>([]);
  const [learningUrls, setLearningUrls] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const learningRecordsSnapshot = await getDocs(collection(db, 'learningRecords'));
      const learningUrlsSnapshot = await getDocs(collection(db, 'learningUrls'));
      const workspacesSnapshot = await getDocs(collection(db, 'workspaces'));

      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const learningRecordsData = learningRecordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const learningUrlsData = learningUrlsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const workspacesData = workspacesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(usersData);
      setLearningRecords(learningRecordsData);
      setLearningUrls(learningUrlsData);
      setWorkspaces(workspacesData);
    };

    fetchData();
  }, []);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      const userRef = doc(db, 'users', editingUser.id);
      const { id, ...updatedUser } = editingUser; // id を除いたオブジェクトを作成
      await updateDoc(userRef, updatedUser);
      setUsers(users.map(u => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
      setOpen(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleWorkspaceChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkspace(event.target.value as string);
  };

  const filteredUsers = users.filter(user => user.workspaces.some((ws: any) => ws.workspaceId === selectedWorkspace));
  const filteredLearningRecords = learningRecords.filter(record => record.workspaceId === selectedWorkspace);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Instructor Dashboard</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Workspace</InputLabel>
        <Select value={selectedWorkspace} onChange={handleWorkspaceChange}>
          {workspaces.map(workspace => (
            <MenuItem key={workspace.id} value={workspace.id}>
              {workspace.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h6" gutterBottom>Users in Workspace</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.workspaces.find((ws: any) => ws.workspaceId === selectedWorkspace)?.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditUser(user)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the user information below.
          </DialogContentText>
          {editingUser && (
            <form onSubmit={e => { e.preventDefault(); handleUpdateUser(); }}>
              <TextField
                label="User Name"
                value={editingUser.name}
                onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={editingUser.email}
                onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={editingUser.workspaces.find((ws: any) => ws.workspaceId === selectedWorkspace)?.role || ''}
                  onChange={e => {
                    const updatedWorkspaces = editingUser.workspaces.map((ws: any) =>
                      ws.workspaceId === selectedWorkspace ? { ...ws, role: e.target.value } : ws
                    );
                    setEditingUser({ ...editingUser, workspaces: updatedWorkspaces });
                  }}
                >
                  <MenuItem value="instructor">Instructor</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button type="submit" color="primary">Update User</Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Typography variant="h6" gutterBottom>Learning Records in Workspace</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>URL Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLearningRecords.map(record => (
              <TableRow key={record.id}>
                <TableCell>{users.find(user => user.id === record.userId)?.name || 'Unknown User'}</TableCell>
                <TableCell>{learningUrls.find(url => url.id === record.urlId)?.title || 'Unknown Title'}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default InstructorDashboard;