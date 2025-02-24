import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface LearningLog {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  url: string;
  clickedAt: any;
}

const InstructorLearningLogList: React.FC = () => {
  const [logs, setLogs] = useState<LearningLog[]>([]);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [workspace, setWorkspace] = useState<string>('');

  useEffect(() => {
    const fetchLogs = async (workspace: string) => {
      try {
        const q = query(collection(db, `workspaces/${workspace}/learningLogs`), orderBy('clickedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const logsData: LearningLog[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          userId: doc.data().userId,
          userEmail: doc.data().userEmail,
          title: doc.data().title,
          url: doc.data().url,
          clickedAt: doc.data().clickedAt.toDate(),
        }));
        setLogs(logsData);
      } catch (error: any) {
        setError(error.message);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocSnapshot = await getDocs(collection(db, `workspaces/${workspace}/users`));
        if (!userDocSnapshot.empty) {
          const userData = userDocSnapshot.docs[0].data();
          setWorkspace(userData.workspace);
          fetchLogs(userData.workspace);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>学習記録リスト</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ユーザーID</th>
            <th>ユーザーメール</th>
            <th>タイトル</th>
            <th>URL</th>
            <th>クリックした時間</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.userId}</td>
              <td>{log.userEmail}</td>
              <td>{log.title}</td>
              <td><a href={log.url} target="_blank" rel="noopener noreferrer">{log.url}</a></td>
              <td>{log.clickedAt.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorLearningLogList;