import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { LearningRecord } from '../../types/LearningRecord';

const LearningRecords: React.FC = () => {
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof LearningRecord>('timestamp');

  useEffect(() => {
    const fetchLearningRecords = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'learningRecords'));
        const recordsData = querySnapshot.docs.map(doc => doc.data() as LearningRecord);
        setLearningRecords(recordsData);
      } catch (error) {
        console.error("Error fetching learning records: ", error);
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

  const sortedRecords = [...learningRecords].sort((a, b) => {
    if (orderBy === 'timestamp') {
      return order === 'asc'
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return order === 'asc'
        ? (a[orderBy] < b[orderBy] ? -1 : 1)
        : (a[orderBy] > b[orderBy] ? -1 : 1);
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'workspaceName'}
                direction={orderBy === 'workspaceName' ? order : 'asc'}
                onClick={() => handleRequestSort('workspaceName')}
              >
                Workspace
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'userId'}
                direction={orderBy === 'userId' ? order : 'asc'}
                onClick={() => handleRequestSort('userId')}
              >
                User ID
              </TableSortLabel>
            </TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'urlId'}
                direction={orderBy === 'urlId' ? order : 'asc'}
                onClick={() => handleRequestSort('urlId')}
              >
                URL ID
              </TableSortLabel>
            </TableCell>
            <TableCell>URL Title</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'timestamp'}
                direction={orderBy === 'timestamp' ? order : 'asc'}
                onClick={() => handleRequestSort('timestamp')}
              >
                Timestamp
              </TableSortLabel>
            </TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRecords.map(record => (
            <TableRow key={`${record.userId}_${record.urlId}`}>
              <TableCell>{record.workspaceName}</TableCell>
              <TableCell>{record.userId}</TableCell>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.urlId}</TableCell>
              <TableCell>{record.urlTitle}</TableCell>
              <TableCell><a href={record.url} target="_blank" rel="noopener noreferrer">{record.url}</a></TableCell>
              <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
              <TableCell>{record.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LearningRecords;