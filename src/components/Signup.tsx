import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Signup: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard');
      }
    });

    const fetchWorkspace = async () => {
      if (inviteId) {
        const inviteDoc = await getDoc(doc(db, 'workspaceInvites', inviteId));
        if (inviteDoc.exists()) {
          const workspaceId = inviteDoc.data()?.workspaceId;
          setWorkspaceId(workspaceId);
          const workspaceDoc = await getDoc(doc(db, 'workspaces', workspaceId));
          if (workspaceDoc.exists()) {
            setWorkspaceName(workspaceDoc.data()?.name);
          } else {
            setError('無効なワークスペースです。');
          }
        } else {
          setError('無効な招待リンクです。');
        }
      }
    };

    fetchWorkspace();

    return () => checkAuth();
  }, [inviteId, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId) {
      setError('ワークスペースが指定されていません。');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, `workspaces/${workspaceId}/users`, user.uid), {
        email: user.email,
        uid: user.uid,
        role: 'user',
      });
      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('このメールアドレスは既に使用されています。');
      } else if (error.code === 'auth/too-many-requests') {
        setError('リクエストが多すぎます。しばらくしてから再試行してください。');
      } else if (error.code === 'auth/invalid-credential') {
        setError('無効な資格情報です。');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {workspaceName ? (
        <form onSubmit={handleSignup}>
          <div>
            <label>ワークスペース</label>
            <input type="text" value={workspaceName} readOnly />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Signup</button>
        </form>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default Signup;
