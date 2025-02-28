import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';
import { Edit, Delete, FileCopy } from '@mui/icons-material';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import '../../styles.css';

interface User {
  id: string;
  name: string;
  email: string;
  workspaces: { workspaceId: string; role: string }[];
}

const UserManagement: React.FC = () => {
  const { selectedWorkspace } = useWorkspace();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => {
        const data = doc.data() as User;
        return {
          ...data,
          id: doc.id,
        };
      }).filter(user => user.workspaces.some((ws: any) => ws.workspaceId === selectedWorkspace?.workspaceId));
      setUsers(usersData);
    };

    const fetchInviteLink = async () => {
      if (selectedWorkspace) {
        const workspaceDoc = await getDoc(doc(db, 'workspaces', selectedWorkspace.workspaceId));
        if (workspaceDoc.exists()) {
          const workspaceData = workspaceDoc.data();
          setInviteLink(workspaceData.inviteURL);
        }
      }
    };

    if (selectedWorkspace) {
      fetchUsers();
      fetchInviteLink();
    }
  }, [selectedWorkspace]);

  const generateInviteLink = async () => {
    if (selectedWorkspace) {
      const newInviteLink = `${window.location.origin}/invite/${selectedWorkspace.workspaceId}-${uuidv4()}`;
      await updateDoc(doc(db, 'workspaces', selectedWorkspace.workspaceId), { inviteURL: newInviteLink });
      setInviteLink(newInviteLink);
    }
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard');
  };

  const handleAddUser = async () => {
    if (!selectedWorkspace) return;

    const docRef = await addDoc(collection(db, 'users'), {
      ...newUser,
      workspaces: [{ workspaceId: selectedWorkspace.workspaceId, role: newUser.role }]
    });
    setUsers([...users, { id: docRef.id, ...newUser, workspaces: [{ workspaceId: selectedWorkspace.workspaceId, role: newUser.role }] }]);
    setNewUser({ name: '', email: '', role: 'user' });
  };

  const handleEditUser = (user: User) => {
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>User Management</Typography>

      <Typography variant="h6" gutterBottom>Add New User</Typography>
      <form onSubmit={e => { e.preventDefault(); handleAddUser(); }}>
        <TextField
          label="Name"
          value={newUser.name}
          onChange={e => setNewUser({ ...newUser, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">Add User</Button>
      </form>

      <Typography variant="h6" gutterBottom>Invite Link</Typography>
      <Box display="flex" alignItems="center">
        <TextField
          value={inviteLink}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <IconButton onClick={handleCopyInviteLink}>
          <FileCopy />
        </IconButton>
        <Button onClick={generateInviteLink} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
          Regenerate
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the user information below.
          </DialogContentText>
          {editingUser && (
            <form onSubmit={e => { e.preventDefault(); handleUpdateUser(); }}>
              <TextField
                label="Name"
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
                  value={editingUser.workspaces.find((ws: any) => ws.workspaceId === selectedWorkspace?.workspaceId)?.role || ''}
                  onChange={e => {
                    const updatedWorkspaces = editingUser.workspaces.map((ws: any) =>
                      ws.workspaceId === selectedWorkspace?.workspaceId ? { ...ws, role: e.target.value } : ws
                    );
                    setEditingUser({ ...editingUser, workspaces: updatedWorkspaces });
                  }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="instructor">Instructor</MenuItem>
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

      <Typography variant="h6" gutterBottom>Existing Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.workspaces.find((ws: any) => ws.workspaceId === selectedWorkspace?.workspaceId)?.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditUser(user)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UserManagement;