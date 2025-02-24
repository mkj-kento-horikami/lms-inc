import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface LearningLog {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  url: string;
  clickedAt: any;
}

const LearningLogList: React.FC = () => {
  const [logs, setLogs] = useState<LearningLog[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'learningLogs'));
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

    fetchLogs();
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

export default LearningLogList;