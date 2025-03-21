import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
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
    try {
      // Firebase Authenticationにユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const userId = userCredential.user.uid;

      // Firestoreのusersコレクションにユーザーを追加
      const userDoc = {
        ...newUser,
        id: userId,
        role: newUser.isAdmin ? 'Admin' : newUser.role
      };
      await setDoc(doc(db, 'users', userId), userDoc);

      // ローカルのユーザーリストを更新
      setUsers([...users, userDoc as User]);
      setNewUser({ name: '', email: '', password: '', isAdmin: false, workspaces: [], role: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      console.log('Updating user:', editingUser); // デバッグ用ログ
      const userRef = doc(db, 'users', editingUser.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const { id, ...updatedUser } = editingUser; // id を除いたオブジェクトを作成
        await updateDoc(userRef, updatedUser);
        setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
        setEditingUser(null);
        setOpen(false);
      } else {
        console.error('No document to update:', editingUser.id);
      }
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>ユーザー管理</Typography>

      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>新規ユーザー追加</Typography>
          <form onSubmit={e => { e.preventDefault(); handleAddUser(); }}>
            <TextField
              label="お名前"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="メールアドレス"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="パスワード"
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
              label="管理者権限"
            />
          </form>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained" color="primary" onClick={handleAddUser}>追加</Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ユーザー編集</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ユーザー情報を更新してください。
          </DialogContentText>
          {editingUser && (
            <form onSubmit={e => { e.preventDefault(); handleUpdateUser(); }}>
              <TextField
                label="お名前"
                value={editingUser.name}
                onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="メールアドレス"
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
                label="管理者権限"
              />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ワークスペース</TableCell>
                      <TableCell>権限</TableCell>
                      <TableCell>操作</TableCell>
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
                              <MenuItem value="instructor">講師</MenuItem>
                              <MenuItem value="user">一般ユーザー</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleRemoveWorkspace(ws.workspaceId)} color="secondary">削除</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid container spacing={2} alignItems="center" style={{ marginTop: '16px' }}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>ワークスペース追加</InputLabel>
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
                    <InputLabel>権限</InputLabel>
                    <Select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as string)}
                    >
                      <MenuItem value="instructor">講師</MenuItem>
                      <MenuItem value="user">一般ユーザー</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Button onClick={handleAddWorkspace} color="primary" variant="contained">追加</Button>
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={handleClose} color="primary">キャンセル</Button>
                <Button type="submit" color="primary">更新</Button>
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
        title="管理者ユーザー"
      />

      <UserManagementTable
        users={unassignedUsers}
        order={order}
        orderBy={orderBy}
        handleRequestSort={handleRequestSort}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        title="未割り当てユーザー"
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
          title={`ワークスペース: ${workspaceId}`}
        />
      ))}
    </Container>
  );
};

export default AdminUserManagement;