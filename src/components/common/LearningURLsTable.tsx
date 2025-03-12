import React from 'react';
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
  Select,
  MenuItem,
} from '@mui/material';
import { LearningRecord } from '../../types/LearningRecord';
import { LearningURL } from '../../types/LearningURL';

interface LearningURLsTableProps {
  learningResources: LearningURL[];
  learningRecords: LearningRecord[];
  handleClick: (resource: LearningURL) => void;
  handleStatusChange: (recordId: string, newStatus: 'completed' | 'not completed') => void;
}

const LearningURLsTable: React.FC<LearningURLsTableProps> = ({ learningResources, learningRecords, handleClick, handleStatusChange }) => {
  console.log('Learning Resources in Table:', learningResources);
  console.log('Learning Records in Table:', learningRecords);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>学習教材</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>カテゴリー</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell>説明</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>クリック数</TableCell>
              <TableCell>最終アクセス</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learningResources.map(resource => {
              const record = learningRecords.find(record => record.urlId === resource.id);
              return (
                <TableRow key={resource.id}>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>{resource.mainTitle}</TableCell>
                  <TableCell>{resource.mainDescription}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleClick(resource)} href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.url}
                    </Button>
                  </TableCell>
                  <TableCell>{record ? record.clickCount : 0}</TableCell>
                  <TableCell>{record ? new Date(record.timestamp).toLocaleString() : 'なし'}</TableCell>
                  <TableCell>
                    {record ? (
                      <Select
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.id, e.target.value as 'completed' | 'not completed')}
                      >
                        <MenuItem value="completed">完了</MenuItem>
                        <MenuItem value="not completed">未完了</MenuItem>
                      </Select>
                    ) : '記録なし'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LearningURLsTable;