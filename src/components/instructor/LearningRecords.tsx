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
} from '@mui/material';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import '../../styles.css';

interface LearningRecord {
  id: string;
  userId: string;
  urlId: string;
  status: string;
  timestamp: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  workspaces: { workspaceId: string; role: string }[];
}

interface LearningURL {
  id: string;
  title: string;
}

const LearningRecords: React.FC = () => {
  const { selectedWorkspace } = useWorkspace();
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [learningUrls, setLearningUrls] = useState<LearningURL[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const learningRecordsSnapshot = await getDocs(collection(db, 'learningRecords'));
      const learningUrlsSnapshot = await getDocs(collection(db, 'learningUrls'));

      const usersData = usersSnapshot.docs.map(doc => {
        const data = doc.data() as User;
        return {
          ...data,
          id: doc.id,
        };
      }).filter(user => user.workspaces.some((ws: any) => ws.workspaceId === selectedWorkspace?.workspaceId));

      const learningRecordsData = learningRecordsSnapshot.docs.map(doc => {
        const data = doc.data() as LearningRecord;
        return {
          ...data,
          id: doc.id,
        };
      }).filter(record => usersData.some(user => user.id === record.userId));

      const learningUrlsData = learningUrlsSnapshot.docs.map(doc => {
        const data = doc.data() as LearningURL;
        return {
          ...data,
          id: doc.id,
        };
      });

      setUsers(usersData);
      setLearningRecords(learningRecordsData);
      setLearningUrls(learningUrlsData);
    };

    if (selectedWorkspace) {
      fetchData();
    }
  }, [selectedWorkspace]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Learning Records</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>URL Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learningRecords.map(record => (
              <TableRow key={record.id}>
                <TableCell>{users.find(user => user.id === record.userId)?.name || 'Unknown User'}</TableCell>
                <TableCell>{learningUrls.find(url => url.id === record.urlId)?.title || 'Unknown Title'}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LearningRecords;