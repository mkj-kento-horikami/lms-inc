import React, { useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const WorkspaceForm: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const domain = representativeEmail.split('@')[1];
    try {
      await addDoc(collection(db, 'workspaces'), {
        name: workspaceName,
        representativeName: representativeName,
        representativeEmail: representativeEmail,
        domain: domain,
      });
      setMessage('ワークスペースが追加されました。');
      setError(null);
      setWorkspaceName('');
      setRepresentativeName('');
      setRepresentativeEmail('');
    } catch (error: any) {
      setError('ワークスペースの追加に失敗しました。');
      setMessage(null);
    }
  };

  return (
    <div>
      <h2>ワークスペースの追加</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ワークスペース名</label>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>代表者名</label>
          <input
            type="text"
            value={representativeName}
            onChange={(e) => setRepresentativeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>代表メール</label>
          <input
            type="email"
            value={representativeEmail}
            onChange={(e) => setRepresentativeEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">追加</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default WorkspaceForm;