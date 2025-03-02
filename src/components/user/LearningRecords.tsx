import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { LearningRecord } from '../../types/LearningRecord';
import LearningRecordsTable from '../common/LearningRecordsTable';

const UserLearningRecords: React.FC = () => {
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof LearningRecord>('timestamp');
  const user = auth.currentUser;

  useEffect(() => {
    const fetchLearningRecords = async () => {
      try {
        if (user) {
          const learningRecordsQuery = query(
            collection(db, 'learningRecords'),
            where('userId', '==', user.uid)
          );
          const querySnapshot = await getDocs(learningRecordsQuery);
          const recordsData = querySnapshot.docs.map((doc) => doc.data() as LearningRecord);
          setLearningRecords(recordsData);
        }
      } catch (error) {
        console.error('Error fetching learning records: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningRecords();
  }, [user]);

  const handleRequestSort = (property: keyof LearningRecord) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <LearningRecordsTable
      learningRecords={learningRecords}
      order={order}
      orderBy={orderBy}
      handleRequestSort={handleRequestSort}
    />
  );
};

export default UserLearningRecords;