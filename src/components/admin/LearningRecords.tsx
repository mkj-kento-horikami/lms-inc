import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { LearningRecord } from '../../types/LearningRecord';
import LearningRecordsTable from '../common/LearningRecordsTable';

const AdminLearningRecords: React.FC = () => {
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof LearningRecord>('timestamp');

  useEffect(() => {
    const fetchLearningRecords = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'learningRecords'));
        const recordsData = querySnapshot.docs.map((doc) => doc.data() as LearningRecord);
        setLearningRecords(recordsData);
      } catch (error) {
        console.error('Error fetching learning records: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningRecords();
  }, []);

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

export default AdminLearningRecords;