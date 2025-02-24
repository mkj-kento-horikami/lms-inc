import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Workspace {
  id: string;
  name: string;
  representativeName: string;
  representativeEmail: string;
  domain: string;
  createdAt: string;
  inviteCreatedAt: string;
}

const WorkspaceList: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'workspaces'));
        const workspaceData: Workspace[] = await Promise.all(querySnapshot.docs.map(async doc => {
          const workspace = doc.data();
          const inviteSnapshot = await getDocs(collection(db, 'workspaceInvites'));
          const inviteDoc = inviteSnapshot.docs.find(invite => invite.data().workspaceId === doc.id);
          return {
            id: doc.id,
            name: workspace.name,
            representativeName: workspace.representativeName,
            representativeEmail: workspace.representativeEmail,
            domain: workspace.domain,
            createdAt: workspace.createdAt ? workspace.createdAt.toDate().toLocaleString() : 'N/A',
            inviteCreatedAt: inviteDoc ? inviteDoc.data().createdAt.toDate().toLocaleString() : 'N/A',
          };
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
            <th>作成日</th>
            <th>招待用URL生成日</th>
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
              <td>{workspace.createdAt}</td>
              <td>{workspace.inviteCreatedAt}</td>
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