import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  workspaceName: string | null;
  role: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData: User[] = [];

        // Fetch admin users
        const adminSnapshot = await getDocs(collection(db, 'users'));
        adminSnapshot.forEach(adminDoc => {
          if (adminDoc.data().role === 'admin') {
            userData.push({
              id: adminDoc.id,
              email: adminDoc.data().email,
              workspaceName: null,
              role: 'admin',
            });
          }
        });

        // Fetch workspace users
        const workspaceSnapshot = await getDocs(collection(db, 'workspaces'));
        for (const workspaceDoc of workspaceSnapshot.docs) {
          const workspaceId = workspaceDoc.id;
          const workspaceName = workspaceDoc.data().name;
          const userSnapshot = await getDocs(collection(db, `workspaces/${workspaceId}/users`));

          userSnapshot.forEach(userDoc => {
            userData.push({
              id: userDoc.id,
              email: userDoc.data().email,
              workspaceName: workspaceName,
              role: userDoc.data().role,
            });
          });
        }

        setUsers(userData);
      } catch (error: any) {
        setError('ユーザーの取得に失敗しました。');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>ユーザー一覧</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>メールアドレス</th>
            <th>ワークスペース</th>
            <th>役割</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.workspaceName || ''}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;