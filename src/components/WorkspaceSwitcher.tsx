import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const WorkspaceSwitcher: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');

  useEffect(() => {
    const fetchWorkspaces = async (userId: string) => {
      const querySnapshot = await getDocs(collection(db, 'workspaces'));
      const userWorkspaces: any[] = [];
      querySnapshot.forEach((doc) => {
        const workspace = doc.data();
        if (workspace.users && workspace.users.includes(userId)) {
          userWorkspaces.push({ id: doc.id, ...workspace });
        }
      });
      setWorkspaces(userWorkspaces);
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchWorkspaces(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWorkspace(e.target.value);
    // ワークスペースの切り替え処理を実装
  };

  return (
    <div>
      <label>ワークスペースを切り替える</label>
      <select value={selectedWorkspace} onChange={handleWorkspaceChange}>
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WorkspaceSwitcher;