import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { LearningRecord } from '../../types/LearningRecord';
import LearningRecordsTable from '../common/LearningRecordsTable';

const InstructorLearningRecords: React.FC = () => {
  const { selectedWorkspace } = useWorkspace();
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof LearningRecord>('timestamp');

  useEffect(() => {
    const fetchLearningRecords = async () => {
      try {
        if (selectedWorkspace) {
          const learningRecordsQuery = query(
            collection(db, 'learningRecords'),
            where('workspaceId', '==', selectedWorkspace.workspaceId)
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
  }, [selectedWorkspace]);

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

export default InstructorLearningRecords;