import React, { useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const WorkspaceInviteForm: React.FC = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'workspaceInvites'), {
        workspaceId: workspaceId,
        createdAt: new Date(),
      });
      setInviteLink(`${window.location.origin}/invite/${docRef.id}`);
      setError(null);
    } catch (error: any) {
      setError('招待リンクの生成に失敗しました。');
      setInviteLink(null);
    }
  };

  return (
    <div>
      <h2>招待リンクの生成</h2>
      <form onSubmit={handleGenerateLink}>
        <div>
          <label>ワークスペースID</label>
          <input
            type="text"
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            required
          />
        </div>
        <button type="submit">生成</button>
      </form>
      {inviteLink && <p>招待リンク: <a href={inviteLink}>{inviteLink}</a></p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default WorkspaceInviteForm;