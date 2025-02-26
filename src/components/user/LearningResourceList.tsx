import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, doc, updateDoc, increment, serverTimestamp, addDoc } from 'firebase/firestore';

interface LearningResource {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
  clickCount: number;
  lastClickedAt: any;
}

const LearningResourceList: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'learningResources'));
        const resourceData: LearningResource[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          category: doc.data().category,
          title: doc.data().title,
          description: doc.data().description,
          url: doc.data().url,
          clickCount: doc.data().clickCount || 0,
          lastClickedAt: doc.data().lastClickedAt ? doc.data().lastClickedAt.toDate() : null,
        }));
        setResources(resourceData);
      } catch (error: any) {
        setError('学習用リソースの取得に失敗しました。');
      }
    };

    fetchResources();
  }, []);

  const handleResourceClick = async (resource: LearningResource) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('ユーザーが認証されていません。');
        return;
      }

      const resourceRef = doc(db, 'learningResources', resource.id);
      await updateDoc(resourceRef, {
        clickCount: increment(1),
        lastClickedAt: serverTimestamp(),
      });

      // 学習ログを追加
      await addDoc(collection(db, 'learningLogs'), {
        userId: user.uid,
        userEmail: user.email,
        resourceId: resource.id,
        resourceTitle: resource.title,
        resourceUrl: resource.url,
        clickedAt: serverTimestamp(),
      });

      // Update local state
      setResources(resources.map(r =>
        r.id === resource.id
          ? { ...r, clickCount: r.clickCount + 1, lastClickedAt: new Date() }
          : r
      ));
    } catch (error: any) {
      setError('クリックの記録に失敗しました。');
    }
  };

  return (
    <div>
      <h2>学習用リソース一覧</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>カテゴリ</th>
            <th>タイトル</th>
            <th>説明</th>
            <th>URL</th>
            <th>クリック数</th>
            <th>最終学習時間</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr key={resource.id}>
              <td>{resource.category}</td>
              <td>{resource.title}</td>
              <td>{resource.description}</td>
              <td>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleResourceClick(resource)}
                >
                  {resource.url}
                </a>
              </td>
              <td>{resource.clickCount}</td>
              <td>{resource.lastClickedAt ? resource.lastClickedAt.toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LearningResourceList;