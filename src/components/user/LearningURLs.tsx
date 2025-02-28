import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, query, where } from 'firebase/firestore';
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
  Button,
} from '@mui/material';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import '../../styles.css';

interface LearningURL {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
}

interface LearningLog {
  id: string;
  userId: string;
  urlId: string;
  status: string;
  clickCount: number;
  lastClicked: string;
}

const LearningURLs: React.FC = () => {
  const { selectedWorkspace } = useWorkspace();
  const [learningUrls, setLearningUrls] = useState<LearningURL[]>([]);
  const [learningLogs, setLearningLogs] = useState<LearningLog[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const learningUrlsSnapshot = await getDocs(collection(db, 'learningUrls'));
      const learningUrlsData = learningUrlsSnapshot.docs.map(doc => {
        const data = doc.data() as LearningURL;
        return {
          ...data,
          id: doc.id,
        };
      });

      if (user) {
        const learningLogsQuery = query(collection(db, 'learningLogs'), where('userId', '==', user.uid));
        const learningLogsSnapshot = await getDocs(learningLogsQuery);
        const learningLogsData = learningLogsSnapshot.docs.map(doc => {
          const data = doc.data() as LearningLog;
          return {
            ...data,
            id: doc.id,
          };
        });
        setLearningLogs(learningLogsData);
      }

      setLearningUrls(learningUrlsData);
    };

    fetchData();
  }, [user]);

  const handleClick = async (urlId: string) => {
    if (!user) return;

    const existingLog = learningLogs.find(log => log.urlId === urlId);

    if (existingLog) {
      const logRef = doc(db, 'learningLogs', existingLog.id);
      await updateDoc(logRef, {
        status: 'complete',
        clickCount: existingLog.clickCount + 1,
        lastClicked: new Date().toISOString(),
      });
      setLearningLogs(learningLogs.map(log => log.id === existingLog.id ? {
        ...log,
        status: 'complete',
        clickCount: log.clickCount + 1,
        lastClicked: new Date().toISOString(),
      } : log));
    } else {
      const newLog = {
        userId: user.uid,
        urlId,
        status: 'complete',
        clickCount: 1,
        lastClicked: new Date().toISOString(),
      };
      const logRef = await addDoc(collection(db, 'learningLogs'), newLog);
      setLearningLogs([...learningLogs, { id: logRef.id, ...newLog }]);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Learning URLs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Click Count</TableCell>
              <TableCell>Last Clicked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learningUrls.map(url => {
              const log = learningLogs.find(log => log.urlId === url.id);
              return (
                <TableRow key={url.id}>
                  <TableCell>{url.category}</TableCell>
                  <TableCell>{url.title}</TableCell>
                  <TableCell>{url.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleClick(url.id)} href={url.url} target="_blank" rel="noopener noreferrer">
                      {url.url}
                    </Button>
                  </TableCell>
                  <TableCell>{log ? log.clickCount : 0}</TableCell>
                  <TableCell>{log ? new Date(log.lastClicked).toLocaleString() : 'Never'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LearningURLs;