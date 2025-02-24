import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Workspace {
  id: string;
  name: string;
  representativeName: string;
  representativeEmail: string;
  domain: string;
}

const WorkspaceList: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'workspaces'));
        const workspaceData: Workspace[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          representativeName: doc.data().representativeName,
          representativeEmail: doc.data().representativeEmail,
          domain: doc.data().domain,
        }));
        setWorkspaces(workspaceData);
      } catch (error: any) {
        setError('ワークスペースの取得に失敗しました。');
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <div>
      <h2>ワークスペース一覧</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ワークスペース名</th>
            <th>代表者名</th>
            <th>代表メール</th>
            <th>ドメイン</th>
            <th>招待用URL</th>
          </tr>
        </thead>
        <tbody>
          {workspaces.map(workspace => (
            <tr key={workspace.id}>
              <td>{workspace.name}</td>
              <td>{workspace.representativeName}</td>
              <td>{workspace.representativeEmail}</td>
              <td>{workspace.domain}</td>
              <td>
                <a href={`${window.location.origin}/invite/${workspace.id}`}>
                  {`${window.location.origin}/invite/${workspace.id}`}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkspaceList;