import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface LearningResource {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
}

const LearningResourceList: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'learningResources'));
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

    fetchResources();
  }, []);

  const handleEdit = (resource: LearningResource) => {
    setEditingResource(resource);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'learningResources', id));
      setResources(resources.filter(resource => resource.id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSave = async () => {
    if (editingResource) {
      try {
        const resourceDoc = doc(db, 'learningResources', editingResource.id);
        await updateDoc(resourceDoc, {
          category: editingResource.category,
          title: editingResource.title,
          description: editingResource.description,
          url: editingResource.url,
        });
        setResources(resources.map(resource => resource.id === editingResource.id ? editingResource : resource));
        setEditingResource(null);
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingResource) {
      setEditingResource({ ...editingResource, [e.target.name]: e.target.value });
    }
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
            <th>アクション</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr key={resource.id}>
              <td>{resource.category}</td>
              <td>{resource.title}</td>
              <td>{resource.description}</td>
              <td><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.url}</a></td>
              <td>
                <button onClick={() => handleEdit(resource)}>編集</button>
                <button onClick={() => handleDelete(resource.id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingResource && (
        <div>
          <h3>編集中のリソース</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div>
              <label>カテゴリ</label>
              <input
                type="text"
                name="category"
                value={editingResource.category}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>タイトル</label>
              <input
                type="text"
                name="title"
                value={editingResource.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>説明</label>
              <textarea
                name="description"
                value={editingResource.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>URL</label>
              <input
                type="url"
                name="url"
                value={editingResource.url}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">保存</button>
            <button type="button" onClick={() => setEditingResource(null)}>キャンセル</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LearningResourceList;