import React from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const Logout: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // ログアウト成功時の処理
    } catch (error: any) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;