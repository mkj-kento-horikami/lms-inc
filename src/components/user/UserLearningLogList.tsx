import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface LearningLog {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  url: string;
  clickedAt: any;
}

const UserLearningLogList: React.FC = () => {
  const [logs, setLogs] = useState<LearningLog[]>([]);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchLogs = async (userId: string) => {
      try {
        const q = query(collection(db, 'learningLogs'), where('userId', '==', userId));
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

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchLogs(currentUser.uid);
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
  );
};

export default UserLearningLogList;