import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { User } from '../../types/User';
import {
  Container,
  Typography,
  TextField,
  Checkbox,
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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [workspaceUsers, setWorkspaceUsers] = useState<{ [key: string]: User[] }>({});
  const [newUser, setNewUser] = useState({ name: '', email: '', isAdmin: false, workspaces: [], role: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      const admins = usersData.filter(user => user.isAdmin);
      setAdminUsers(admins);

      const workspaceUserMap: { [key: string]: User[] } = {};
      usersData.forEach(user => {
        user.workspaces.forEach(ws => {
          if (!workspaceUserMap[ws.workspaceId]) {
            workspaceUserMap[ws.workspaceId] = [];
          }
          workspaceUserMap[ws.workspaceId].push({ ...user, role: ws.role });
        });
      });
      setWorkspaceUsers(workspaceUserMap);

      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    const docRef = await addDoc(collection(db, 'users'), newUser);
    setUsers([...users, { id: docRef.id, ...newUser } as User]);
    setNewUser({ name: '', email: '', isAdmin: false, workspaces: [], role: '' });
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
      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
      setOpen(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(user => user.id !== userId));
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
        <label>
          <Checkbox
            checked={newUser.isAdmin}
            onChange={e => setNewUser({ ...newUser, isAdmin: e.target.checked })}
          />
          Is Admin
        </label>
        <Button type="submit" variant="contained" color="primary">Add User</Button>
      </form>

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
              <label>
                <Checkbox
                  checked={editingUser.isAdmin}
                  onChange={e => setEditingUser({ ...editingUser, isAdmin: e.target.checked })}
                />
                Is Admin
              </label>
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button type="submit" color="primary">Update User</Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Typography variant="h6" gutterBottom>Admin Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditUser(user)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>Workspace Users</Typography>
      {Object.keys(workspaceUsers).map(workspaceId => (
        <div key={workspaceId}>
          <Typography variant="subtitle1">Workspace: {workspaceId}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workspaceUsers[workspaceId].map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditUser(user)}><Edit /></IconButton>
                      <IconButton onClick={() => handleDeleteUser(user.id)}><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ))}
    </Container>
  );
};

export default UserManagement;