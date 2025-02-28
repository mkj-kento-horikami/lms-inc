import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { User } from '../../types/User';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [workspaceUsers, setWorkspaceUsers] = useState<{ [key: string]: User[] }>({});
  const [newUser, setNewUser] = useState({ name: '', email: '', isAdmin: false, workspaces: [], role: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

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

  const handleEditUser = async (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      const userRef = doc(db, 'users', editingUser.id);
      const { id, ...updatedUser } = editingUser; // id を除いたオブジェクトを作成
      await updateDoc(userRef, updatedUser);
      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div>
      <h2>User Management</h2>

      <h3>Add New User</h3>
      <form onSubmit={e => { e.preventDefault(); handleAddUser(); }}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={e => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={e => setNewUser({ ...newUser, email: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={newUser.isAdmin}
            onChange={e => setNewUser({ ...newUser, isAdmin: e.target.checked })}
          />
          Is Admin
        </label>
        <button type="submit">Add User</button>
      </form>

      {editingUser && (
        <div>
          <h3>Edit User</h3>
          <form onSubmit={e => { e.preventDefault(); handleUpdateUser(); }}>
            <input
              type="text"
              placeholder="Name"
              value={editingUser.name}
              onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={editingUser.email}
              onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
            />
            <label>
              <input
                type="checkbox"
                checked={editingUser.isAdmin}
                onChange={e => setEditingUser({ ...editingUser, isAdmin: e.target.checked })}
              />
              Is Admin
            </label>
            <button type="submit">Update User</button>
          </form>
        </div>
      )}

      <h3>Admin Users</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>Admin</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Workspace Users</h3>
      {Object.keys(workspaceUsers).map(workspaceId => (
        <div key={workspaceId}>
          <h4>Workspace: {workspaceId}</h4>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workspaceUsers[workspaceId].map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default UserManagement;