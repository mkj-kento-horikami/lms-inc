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
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learningResources.map(resource => {
              const record = learningRecords.find(record => record.urlId === resource.id);
              return (
                <TableRow key={resource.id}>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell>{resource.description}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleClick(resource)} href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.url}
                    </Button>
                  </TableCell>
                  <TableCell>{record ? record.clickCount : 0}</TableCell>
                  <TableCell>{record ? new Date(record.timestamp).toLocaleString() : 'Never'}</TableCell>
                  <TableCell>
                    {record ? (
                      <Select
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.id, e.target.value as 'completed' | 'not completed')}
                      >
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="not completed">Not Completed</MenuItem>
                      </Select>
                    ) : 'No Record'}
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