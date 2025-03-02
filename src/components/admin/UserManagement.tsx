import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebaseConfig';
import { User } from '../../types/User';
import {
  Container,
  Typography,
  TextField,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import UserManagementTable from '../common/UserManagementTable';
import '../../styles.css';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [workspaceUsers, setWorkspaceUsers] = useState<{ [key: string]: User[] }>({});
  const [unassignedUsers, setUnassignedUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', isAdmin: false, workspaces: [], role: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [newWorkspace, setNewWorkspace] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('user');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof User>('name');

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
      const unassigned: User[] = [];
      usersData.forEach(user => {
        if (user.workspaces.length === 0) {
          unassigned.push(user);
        } else {
          user.workspaces.forEach(ws => {
            if (!workspaceUserMap[ws.workspaceId]) {
              workspaceUserMap[ws.workspaceId] = [];
            }
            workspaceUserMap[ws.workspaceId].push({ ...user, role: ws.role });
          });
        }
      });
      setWorkspaceUsers(workspaceUserMap);
      setUnassignedUsers(unassigned);

      setUsers(usersData);
    };

    const fetchWorkspaces = async () => {
      const querySnapshot = await getDocs(collection(db, 'workspaces'));
      const workspaceData = querySnapshot.docs.map(doc => doc.id);
      setWorkspaces(workspaceData);
    };

    fetchUsers();
    fetchWorkspaces();
  }, []);

  const handleAddUser = async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
    const userId = userCredential.user.uid;
    const docRef = await addDoc(collection(db, 'users'), { ...newUser, id: userId });
    setUsers([...users, { id: docRef.id, ...newUser } as User]);
    setNewUser({ name: '', email: '', password: '', isAdmin: false, workspaces: [], role: '' });
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

  const handleWorkspaceChange = (workspaceId: string, role: string) => {
    if (editingUser) {
      const newWorkspaces = editingUser.workspaces.map(ws => 
        ws.workspaceId === workspaceId ? { ...ws, role } : ws
      );
      setEditingUser({ ...editingUser, workspaces: newWorkspaces });
    }
  };

  const handleAddWorkspace = () => {
    if (editingUser && newWorkspace) {
      const newWorkspaces = [...editingUser.workspaces, { workspaceId: newWorkspace, role: newRole }];
      setEditingUser({ ...editingUser, workspaces: newWorkspaces });
      setNewWorkspace('');
      setNewRole('user');
    }
  };

  const handleRemoveWorkspace = (workspaceId: string) => {
    if (editingUser) {
      const newWorkspaces = editingUser.workspaces.filter(ws => ws.workspaceId !== workspaceId);
      setEditingUser({ ...editingUser, workspaces: newWorkspaces });
    }
  };

  const handleRequestSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return (order === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
    }

    return 0;
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>User Management</Typography>

      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
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
            <TextField
              label="Password"
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newUser.isAdmin}
                  onChange={e => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                />
              }
              label="Is Admin"
            />
          </form>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained" color="primary" onClick={handleAddUser}>Add User</Button>
        </CardActions>
      </Card>

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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editingUser.isAdmin}
                    onChange={e => setEditingUser({ ...editingUser, isAdmin: e.target.checked })}
                  />
                }
                label="Is Admin"
              />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Workspace</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {editingUser.workspaces.map(ws => (
                      <TableRow key={ws.workspaceId}>
                        <TableCell>{ws.workspaceId}</TableCell>
                        <TableCell>
                          <FormControl fullWidth>
                            <Select
                              value={ws.role}
                              onChange={(e) => handleWorkspaceChange(ws.workspaceId, e.target.value as string)}
                            >
                              <MenuItem value="instructor">Instructor</MenuItem>
                              <MenuItem value="user">User</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleRemoveWorkspace(ws.workspaceId)} color="secondary">Remove</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid container spacing={2} alignItems="center" style={{ marginTop: '16px' }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Add Workspace</InputLabel>
                    <Select
                      value={newWorkspace}
                      onChange={(e) => setNewWorkspace(e.target.value as string)}
                    >
                      {workspaces.filter(ws => !editingUser.workspaces.some(userWs => userWs.workspaceId === ws)).map(workspace => (
                        <MenuItem key={workspace} value={workspace}>
                          {workspace}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as string)}
                    >
                      <MenuItem value="instructor">Instructor</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={handleAddWorkspace} color="primary" variant="contained">Add</Button>
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button type="submit" color="primary">Update User</Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <UserManagementTable
        users={adminUsers}
        order={order}
        orderBy={orderBy}
        handleRequestSort={handleRequestSort}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        title="Admin Users"
      />

      <UserManagementTable
        users={unassignedUsers}
        order={order}
        orderBy={orderBy}
        handleRequestSort={handleRequestSort}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        title="Unassigned Users"
      />

      {Object.keys(workspaceUsers).map(workspaceId => (
        <UserManagementTable
          key={workspaceId}
          users={workspaceUsers[workspaceId]}
          order={order}
          orderBy={orderBy}
          handleRequestSort={handleRequestSort}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
          title={`Workspace: ${workspaceId}`}
        />
      ))}
    </Container>
  );
};

export default AdminUserManagement;