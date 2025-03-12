import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
} from '@mui/material';
import { LearningRecord } from '../../types/LearningRecord';

interface LearningRecordsTableProps {
  learningRecords: LearningRecord[];
  order: 'asc' | 'desc';
  orderBy: keyof LearningRecord;
  handleRequestSort: (property: keyof LearningRecord) => void;
}

const LearningRecordsTable: React.FC<LearningRecordsTableProps> = ({
  learningRecords,
  order,
  orderBy,
  handleRequestSort,
}) => {
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
                ワークスペース
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'userName'}
                direction={orderBy === 'userName' ? order : 'asc'}
                onClick={() => handleRequestSort('userName')}
              >
                ユーザー名
              </TableSortLabel>
            </TableCell>
            <TableCell>カテゴリー</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'urlTitle'}
                direction={orderBy === 'urlTitle' ? order : 'asc'}
                onClick={() => handleRequestSort('urlTitle')}
              >
                URLタイトル
              </TableSortLabel>
            </TableCell>
            <TableCell>URL</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'timestamp'}
                direction={orderBy === 'timestamp' ? order : 'asc'}
                onClick={() => handleRequestSort('timestamp')}
              >
                日時
              </TableSortLabel>
            </TableCell>
            <TableCell>ステータス</TableCell>
            <TableCell>クリック数</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRecords.map((record) => (
            <TableRow key={`${record.userId}_${record.urlId}`}>
              <TableCell>{record.workspaceName}</TableCell>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.category}</TableCell>
              <TableCell>{record.urlTitle}</TableCell>
              <TableCell>
                <a href={record.url} target="_blank" rel="noopener noreferrer">
                  {record.url}
                </a>
              </TableCell>
              <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>{record.clickCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LearningRecordsTable;