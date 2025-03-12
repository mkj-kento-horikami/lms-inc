import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

type UserRole = 'admin' | 'instructor' | 'user' | null;

interface AuthContextProps {
  currentUser: User | null;
  userRole: UserRole;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  userRole: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

interface UserData extends DocumentData {
  role: UserRole;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ユーザーロールを取得する関数
  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        return userData.role;
      }
      console.error('User document does not exist:', userId);
      return null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);
        setCurrentUser(user);

        if (user) {
          const role = await fetchUserRole(user.uid);
          if (isMounted) {
            setUserRole(role);
          }
        } else {
          if (isMounted) {
            setUserRole(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Authentication error:', error);
          setError('認証エラーが発生しました。再度ログインしてください。');
          setUserRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const value: AuthContextProps = {
    currentUser,
    userRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};