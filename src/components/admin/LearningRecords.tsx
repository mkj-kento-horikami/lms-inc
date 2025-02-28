import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from '@mui/material';
import '../../styles.css';

const LearningRecords: React.FC = () => {
  const [learningRecords, setLearningRecords] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [learningUrls, setLearningUrls] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('timestamp');

  useEffect(() => {
    const fetchData = async () => {
      const learningRecordsSnapshot = await getDocs(collection(db, 'learningRecords'));
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const learningUrlsSnapshot = await getDocs(collection(db, 'learningUrls'));
      const workspacesSnapshot = await getDocs(collection(db, 'workspaces'));

      const learningRecordsData = learningRecordsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const learningUrlsData = learningUrlsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const workspacesData = workspacesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setLearningRecords(learningRecordsData);
      setUsers(usersData);
      setLearningUrls(learningUrlsData);
      setWorkspaces(workspacesData);
    };

    fetchData();
  }, []);

  const handleRequestSort = (property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedLearningRecords = [...learningRecords].sort((a, b) => {
    const aValue = a[orderBy] || '';
    const bValue = b[orderBy] || '';
    return (order === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
  });

  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getWorkspaceName = (workspaceId: string) => {
    const workspace = workspaces.find(workspace => workspace.id === workspaceId);
    return workspace ? workspace.name : 'Unknown Workspace';
  };

  const getLearningUrlTitle = (urlId: string) => {
    const learningUrl = learningUrls.find(url => url.id === urlId);
    return learningUrl ? learningUrl.title : 'Unknown Title';
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Learning Records</Typography>

      <Typography variant="h6" gutterBottom>All Learning Records</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'userId'}
                  direction={orderBy === 'userId' ? order : 'asc'}
                  onClick={() => handleRequestSort('userId')}
                >
                  User Name
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'workspaceId'}
                  direction={orderBy === 'workspaceId' ? order : 'asc'}
                  onClick={() => handleRequestSort('workspaceId')}
                >
                  Workspace
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'urlId'}
                  direction={orderBy === 'urlId' ? order : 'asc'}
                  onClick={() => handleRequestSort('urlId')}
                >
                  URL Title
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell className="table-head-cell">
                <TableSortLabel
                  active={orderBy === 'timestamp'}
                  direction={orderBy === 'timestamp' ? order : 'asc'}
                  onClick={() => handleRequestSort('timestamp')}
                >
                  Timestamp
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLearningRecords.map(learningRecord => (
              <TableRow key={learningRecord.id} className="table-row">
                <TableCell>{getUserName(learningRecord.userId)}</TableCell>
                <TableCell>{getWorkspaceName(learningRecord.workspaceId)}</TableCell>
                <TableCell>{getLearningUrlTitle(learningRecord.urlId)}</TableCell>
                <TableCell>{learningRecord.status}</TableCell>
                <TableCell>{learningRecord.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LearningRecords;