import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface LearningURL {
  id: string;
  workspaceId: string;
  url: string;
  createdBy: string;
}

const LearningURLManagement: React.FC = () => {
  const [urls, setUrls] = useState<LearningURL[]>([]);

  useEffect(() => {
    const fetchURLs = async () => {
      const querySnapshot = await getDocs(collection(db, 'learningUrls'));
      const urlsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LearningURL[];
      setUrls(urlsData);
    };

    fetchURLs();
  }, []);

  return (
    <div>
      <h2>Learning URL Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Workspace ID</th>
            <th>URL</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {urls.map(url => (
            <tr key={url.id}>
              <td>{url.id}</td>
              <td>{url.workspaceId}</td>
              <td>{url.url}</td>
              <td>{url.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LearningURLManagement;