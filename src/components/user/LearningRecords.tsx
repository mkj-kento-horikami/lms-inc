import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
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
import '../../styles.css';

interface LearningRecord {
  id: string;
  userId: string;
  urlId: string;
  status: string;
  timestamp: string;
}

interface LearningURL {
  id: string;
  title: string;
}

const LearningRecords: React.FC = () => {
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([]);
  const [learningUrls, setLearningUrls] = useState<LearningURL[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const learningRecordsQuery = query(collection(db, 'learningRecords'), where('userId', '==', user.uid));
      const learningRecordsSnapshot = await getDocs(learningRecordsQuery);
      const learningUrlsSnapshot = await getDocs(collection(db, 'learningUrls'));

      const learningRecordsData = learningRecordsSnapshot.docs.map(doc => {
        const data = doc.data() as LearningRecord;
        return {
          ...data,
          id: doc.id,
        };
      });

      const learningUrlsData = learningUrlsSnapshot.docs.map(doc => {
        const data = doc.data() as LearningURL;
        return {
          ...data,
          id: doc.id,
        };
      });

      setLearningRecords(learningRecordsData);
      setLearningUrls(learningUrlsData);
    };

    fetchData();
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Learning Records</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learningRecords.map(record => (
              <TableRow key={record.id}>
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