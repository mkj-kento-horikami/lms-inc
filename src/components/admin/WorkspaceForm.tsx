import React, { useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const WorkspaceForm: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [representativePassword, setRepresentativePassword] = useState('');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const domain = representativeEmail.split('@')[1];
    try {
      // ワークスペースを追加
      const workspaceRef = await addDoc(collection(db, 'workspaces'), {
        name: workspaceName,
        representativeName: representativeName,
        representativeEmail: representativeEmail,
        domain: domain,
        createdAt: serverTimestamp(),
      });

      // 代表者をinstructorとしてユーザー登録
      const userCredential = await createUserWithEmailAndPassword(auth, representativeEmail, representativePassword);
      const user = userCredential.user;
      await setDoc(doc(db, `workspaces/${workspaceRef.id}/users`, user.uid), {
        email: user.email,
        uid: user.uid,
        role: 'instructor',
      });

      // Firestoreのusersコレクションに追加
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        uid: user.uid,
        role: 'instructor',
        workspaceId: workspaceRef.id,
      });

      // 招待リンクを生成
      const inviteRef = await addDoc(collection(db, 'workspaceInvites'), {
        workspaceId: workspaceRef.id,
        createdAt: serverTimestamp(),
      });

      setInviteLink(`${window.location.origin}/invite/${inviteRef.id}`);
      setMessage('ワークスペースが追加され、代表者が登録されました。');
      setError(null);
      setWorkspaceName('');
      setRepresentativeName('');
      setRepresentativeEmail('');
      setRepresentativePassword('');
    } catch (error: any) {
      setError('ワークスペースの追加または代表者の登録に失敗しました。');
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
        <div>
          <label>代表者パスワード</label>
          <input
            type="password"
            value={representativePassword}
            onChange={(e) => setRepresentativePassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">追加</button>
      </form>
      {inviteLink && <p>招待リンク: <a href={inviteLink}>{inviteLink}</a></p>}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default WorkspaceForm;