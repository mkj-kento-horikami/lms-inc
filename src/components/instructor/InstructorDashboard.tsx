import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import LearningResourceList from '../user/LearningResourceList';
import UserLearningLogList from '../user/UserLearningLogList';

interface User {
  id: string;
  email: string;
  role: string;
}

interface LearningLog {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  url: string;
  clickedAt: any;
}

const InstructorDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<LearningLog[]>([]);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const workspaceSnapshot = await getDocs(collection(db, 'workspaces'));
          for (const workspaceDoc of workspaceSnapshot.docs) {
            const userWorkspaceDoc = await getDoc(doc(db, `workspaces/${workspaceDoc.id}/users`, user.uid));
            if (userWorkspaceDoc.exists() && userWorkspaceDoc.data().role === 'instructor') {
              setWorkspaceId(workspaceDoc.id);
              await fetchUsers(workspaceDoc.id);
              await fetchLogs(workspaceDoc.id);
              await fetchInviteLink(workspaceDoc.id);
              break;
            }
          }
        }
      } catch (error: any) {
        setError('データの取得に失敗しました。');
      }
    };

    const fetchUsers = async (workspaceId: string) => {
      try {
        const usersSnapshot = await getDocs(collection(db, `workspaces/${workspaceId}/users`));
        const usersData: User[] = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          email: doc.data().email,
          role: doc.data().role,
        }));
        setUsers(usersData);
      } catch (error: any) {
        setError('ユーザーの取得に失敗しました。');
      }
    };

    const fetchLogs = async (workspaceId: string) => {
      try {
        const logsQuery = query(collection(db, 'learningLogs'), where('workspaceId', '==', workspaceId));
        const logsSnapshot = await getDocs(logsQuery);
        const logsData: LearningLog[] = logsSnapshot.docs.map(doc => ({
          id: doc.id,
          userId: doc.data().userId,
          userEmail: doc.data().userEmail,
          title: doc.data().title,
          url: doc.data().url,
          clickedAt: doc.data().clickedAt.toDate(),
        }));
        setLogs(logsData);
      } catch (error: any) {
        setError('学習記録の取得に失敗しました。');
      }
    };

    const fetchInviteLink = async (workspaceId: string) => {
      try {
        const inviteSnapshot = await getDocs(collection(db, 'workspaceInvites'));
        const inviteDoc = inviteSnapshot.docs.find(invite => invite.data().workspaceId === workspaceId);
        if (inviteDoc) {
          setInviteLink(`${window.location.origin}/invite/${inviteDoc.id}`);
        }
      } catch (error: any) {
        setError('招待リンクの取得に失敗しました。');
      }
    };

    fetchWorkspaceData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!workspaceId) return;
    try {
      await updateDoc(doc(db, `workspaces/${workspaceId}/users`, userId), {
        role: newRole,
      });
      setUsers(users.map(user => (user.id === userId ? { ...user, role: newRole } : user)));
    } catch (error: any) {
      setError('ロールの変更に失敗しました。');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!workspaceId) return;
    if (window.confirm('このユーザーを削除してもよろしいですか？')) {
      try {
        await deleteDoc(doc(db, `workspaces/${workspaceId}/users`, userId));
        setUsers(users.filter(user => user.id !== userId));
      } catch (error: any) {
        setError('ユーザーの削除に失敗しました。');
      }
    }
  };

  const handleRegenerateInvite = async () => {
    if (!workspaceId) return;
    try {
      const inviteRef = await addDoc(collection(db, 'workspaceInvites'), {
        workspaceId: workspaceId,
        createdAt: serverTimestamp(),
      });
      const newInviteLink = `${window.location.origin}/invite/${inviteRef.id}`;
      setInviteLink(newInviteLink);
      alert(`新しい招待リンク: ${newInviteLink}`);
    } catch (error: any) {
      setError('招待リンクの再生成に失敗しました。');
    }
  };

  return (
    <div>
      <h2>講師ダッシュボード</h2>
      {error && <p>{error}</p>}
      <div>
        <h3>ユーザー一覧</h3>
        <table>
          <thead>
            <tr>
              <th>メールアドレス</th>
              <th>ロール</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                    <option value="user">ユーザー</option>
                    <option value="instructor">講師</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDeleteUser(user.id)}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>学習記録</h3>
        <table>
          <thead>
            <tr>
              <th>タイトル</th>
              <th>URL</th>
              <th>クリックした時間</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.title}</td>
                <td><a href={log.url} target="_blank" rel="noopener noreferrer">{log.url}</a></td>
                <td>{log.clickedAt.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3>招待リンク</h3>
        {inviteLink && <p>招待リンク: <a href={inviteLink}>{inviteLink}</a></p>}
        <button onClick={handleRegenerateInvite}>招待リンク再生成</button>
      </div>
      <div>
        <h3>学習用リソース一覧</h3>
        <LearningResourceList />
      </div>
      <div>
        <h3>自分の学習記録</h3>
        <UserLearningLogList />
      </div>
    </div>
  );
};

export default InstructorDashboard;