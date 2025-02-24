import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface LearningResource {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
}

interface LearningLog {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  url: string;
  clickedAt: any;
}

const LearningResourceList: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [logs, setLogs] = useState<LearningLog[]>([]);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [workspace, setWorkspace] = useState<string>('');

  useEffect(() => {
    const fetchResources = async (workspace: string) => {
      try {
        const querySnapshot = await getDocs(collection(db, `workspaces/${workspace}/learningResources`));
        const resourcesData: LearningResource[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          category: doc.data().category,
          title: doc.data().title,
          description: doc.data().description,
          url: doc.data().url,
        }));
        setResources(resourcesData);
      } catch (error: any) {
        setError(error.message);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocSnapshot = await getDocs(collection(db, `workspaces/${workspace}/users`));
        if (!userDocSnapshot.empty) {
          const userData = userDocSnapshot.docs[0].data();
          setWorkspace(userData.workspace);
          fetchResources(userData.workspace);
          fetchLogs(currentUser.uid, userData.workspace);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchLogs = async (userId: string, workspace: string) => {
    try {
      const q = query(collection(db, `workspaces/${workspace}/learningLogs`), where('userId', '==', userId), orderBy('clickedAt', 'desc'));
      const querySnapshot = await getDocs(q);
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

  const handleLinkClick = async (resource: LearningResource) => {
    if (user) {
      try {
        await addDoc(collection(db, `workspaces/${workspace}/learningLogs`), {
          userId: user.uid,
          userEmail: user.email,
          title: resource.title,
          url: resource.url,
          clickedAt: new Date(),
        });
        fetchLogs(user.uid, workspace); // 更新後に再取得
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const getLogStats = (url: string) => {
    const userLogs = logs.filter(log => log.url === url);
    const count = userLogs.length;
    const lastViewed = count > 0 ? userLogs[0].clickedAt : null;
    return { count, lastViewed };
  };

  return (
    <div>
      <h2>学習用URLリスト</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>カテゴリ</th>
            <th>タイトル</th>
            <th>説明</th>
            <th>URL</th>
            <th>閲覧回数</th>
            <th>最新閲覧時刻</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => {
            const { count, lastViewed } = getLogStats(resource.url);
            return (
              <tr key={resource.id}>
                <td>{resource.category}</td>
                <td>{resource.title}</td>
                <td>{resource.description}</td>
                <td>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(resource)}
                  >
                    {resource.url}
                  </a>
                </td>
                <td>{count}</td>
                <td>{lastViewed ? lastViewed.toString() : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LearningResourceList;