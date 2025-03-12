import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';

const Signup: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get('workspaceId');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateInvite = async () => {
      if (!inviteId || !workspaceId) {
        setError('無効なリンクです');
        return;
      }

      const inviteDoc = await getDoc(doc(db, 'invites', inviteId));
      if (!inviteDoc.exists()) {
        setError('無効なリンクです');
      }
    };

    validateInvite();
  }, [inviteId, workspaceId]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        id: userId,
        name,
        email,
        workspaces: [{ workspaceId, role: 'user' }],
      });

      setSuccess(true);
      navigate(`/workspace/${workspaceId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('サインアップ中にエラーが発生しました');
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Signup</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success ? (
        <Alert severity="success">サインアップに成功しました！</Alert>
      ) : (
        <form onSubmit={handleSignup}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">Signup</Button>
        </form>
      )}
    </Container>
  );
};

export default Signup;
