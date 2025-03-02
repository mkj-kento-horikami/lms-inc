import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import '../../styles.css';
import { LearningRecord } from '../../types/LearningRecord';
import { LearningURL } from '../../types/LearningURL';
import LearningURLsTable from '../common/LearningURLsTable';

const LearningURLs: React.FC = () => {
  const { selectedWorkspace } = useWorkspace();
  const [learningURLs, setLearningURLs] = useState<LearningURL[]>([]);
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const learningURLsSnapshot = await getDocs(collection(db, 'learningUrls'));
        const learningURLsData = learningURLsSnapshot.docs.map(doc => {
          const data = doc.data() as LearningURL;
          return {
            ...data,
            id: doc.id,
          };
        });

        console.log('Fetched Learning URLs:', learningURLsData);

        if (user) {
          const learningRecordsQuery = query(collection(db, 'learningRecords'), where('userId', '==', user.uid));
          const learningRecordsSnapshot = await getDocs(learningRecordsQuery);
          const learningRecordsData = learningRecordsSnapshot.docs.map(doc => {
            const data = doc.data() as LearningRecord;
            return {
              ...data,
              id: doc.id,
            };
          });

          console.log('Fetched Learning Records:', learningRecordsData);

          setLearningRecords(learningRecordsData);
        }

        setLearningURLs(learningURLsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleClick = async (resource: LearningURL) => {
    if (!user || !selectedWorkspace) return;

    const existingRecord = learningRecords.find(record => record.urlId === resource.id);

    if (existingRecord) {
      const recordRef = doc(db, 'learningRecords', existingRecord.id);
      await updateDoc(recordRef, {
        status: 'completed',
        clickCount: existingRecord.clickCount + 1,
        timestamp: new Date().toISOString(),
      });
      setLearningRecords(learningRecords.map(record => record.id === existingRecord.id ? {
        ...record,
        status: 'completed',
        clickCount: record.clickCount + 1,
        timestamp: new Date().toISOString(),
      } : record));
    } else {
      const newRecord: LearningRecord = {
        id: '', // 一時的なIDを設定
        userId: user.uid,
        userName: user.displayName || '',
        workspaceId: selectedWorkspace.workspaceId,
        workspaceName: selectedWorkspace.name,
        urlId: resource.id,
        urlTitle: resource.title,
        url: resource.url,
        category: resource.category, // category プロパティを追加
        status: 'completed',
        timestamp: new Date().toISOString(),
        clickCount: 1, // 初期クリック数を設定
      };
      const recordRef = await addDoc(collection(db, 'learningRecords'), newRecord);
      newRecord.id = recordRef.id; // 実際のIDを設定
      setLearningRecords([...learningRecords, newRecord]);
    }
  };

  return (
    <LearningURLsTable
      learningResources={learningURLs}
      learningRecords={learningRecords}
      handleClick={handleClick}
    />
  );
};

export default LearningURLs;