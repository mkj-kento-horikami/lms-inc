import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const InvitePage: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvite = async () => {
      try {
        const inviteDoc = await getDoc(doc(db, 'workspaceInvites', inviteId!));
        if (!inviteDoc.exists()) {
          setError('無効な招待リンクです。');
          return;
        }

        const workspaceId = inviteDoc.data()?.workspaceId;

        onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            await setDoc(doc(db, `workspaces/${workspaceId}/users`, currentUser.uid), {
              email: currentUser.email,
              uid: currentUser.uid,
              role: 'user',
            }, { merge: true });

            navigate('/dashboard');
          } else {
            setError('ログインしてください。');
          }
        });
      } catch (error: any) {
        setError('招待リンクの処理に失敗しました。');
      }
    };

    handleInvite();
  }, [inviteId, navigate]);

  return (
    <div>
      <h2>招待リンクの処理</h2>
      {error && <p>{error}</p>}
    </div>
  );
};

export default InvitePage;