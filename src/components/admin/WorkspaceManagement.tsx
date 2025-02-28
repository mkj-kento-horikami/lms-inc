import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface Workspace {
  id: string;
  name: string;
  createdBy: string;
}

const WorkspaceManagement: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const querySnapshot = await getDocs(collection(db, 'workspaces'));
      const workspacesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Workspace[];
      setWorkspaces(workspacesData);
    };

    fetchWorkspaces();
  }, []);

  return (
    <div>
      <h2>Workspace Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {workspaces.map(workspace => (
            <tr key={workspace.id}>
              <td>{workspace.id}</td>
              <td>{workspace.name}</td>
              <td>{workspace.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkspaceManagement;