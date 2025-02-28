import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface LearningRecord {
  userId: string;
  workspaceId: string;
  urlId: string;
  status: string;
  timestamp: string;
}

const LearningRecords: React.FC = () => {
  const [records, setRecords] = useState<LearningRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const querySnapshot = await getDocs(collection(db, 'learningRecords'));
      const recordsData = querySnapshot.docs.map(doc => ({
        ...doc.data()
      })) as LearningRecord[];
      setRecords(recordsData);
    };

    fetchRecords();
  }, []);

  return (
    <div>
      <h2>Learning Records</h2>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Workspace ID</th>
            <th>URL ID</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={`${record.userId}_${record.urlId}`}>
              <td>{record.userId}</td>
              <td>{record.workspaceId}</td>
              <td>{record.urlId}</td>
              <td>{record.status}</td>
              <td>{record.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LearningRecords;