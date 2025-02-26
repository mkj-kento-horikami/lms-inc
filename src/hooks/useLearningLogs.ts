import { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, query, where, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface LearningLog {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  url: string;
  clickedAt: any;
}

const useLearningLogs = (workspacePath: string = '', userId: string = '') => {
  const [logs, setLogs] = useState<LearningLog[]>([]);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  const fetchLogs = async (currentUserId: string) => {
    try {
      let logsQuery;
      if (workspacePath) {
        logsQuery = query(collection(db, `${workspacePath}/learningLogs`), orderBy('clickedAt', 'desc'));
      } else if (currentUserId) {
        logsQuery = query(collection(db, 'learningLogs'), where('userId', '==', currentUserId));
      } else {
        logsQuery = query(collection(db, 'learningLogs'), orderBy('clickedAt', 'desc'));
      }
      const querySnapshot = await getDocs(logsQuery);
      const logsData: LearningLog[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        userEmail: doc.data().userEmail,
        title: doc.data().title,
        url: doc.data().url,
        clickedAt: doc.data().clickedAt.toDate(),
      }));
      setLogs(logsData);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchLogs(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [workspacePath, userId, fetchLogs]); // 'fetchLogs'を依存関係に追加

  const handleLinkClick = async (log: LearningLog) => {
    try {
      await addDoc(collection(db, workspacePath ? `${workspacePath}/learningLogs` : 'learningLogs'), {
        userId: log.userId,
        userEmail: log.userEmail,
        title: log.title,
        url: log.url,
        clickedAt: Timestamp.now(),
      });
      // ログを再取得して更新
      fetchLogs(log.userId);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return { logs, error, user, handleLinkClick };
};

export default useLearningLogs;