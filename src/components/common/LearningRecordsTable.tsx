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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LearningRecord } from '../../types/LearningRecord';

interface LearningRecordsTableProps {
  learningRecords: LearningRecord[];
  order: 'asc' | 'desc';
  orderBy: keyof LearningRecord;
  handleRequestSort: (property: keyof LearningRecord) => void;
}

interface GroupedRecord {
  mainTitle: string;
  category: string;
  userName: string;
  workspaceName: string;
  status: 'completed' | 'not completed';
  contents: {
    url: string;
    timestamp: string;
    clickCount: number;
  }[];
}

const LearningRecordsTable: React.FC<LearningRecordsTableProps> = ({
  learningRecords,
  order,
  orderBy,
  handleRequestSort,
}) => {
  // レコードをメインタイトルでグループ化
  const groupedRecords = learningRecords.reduce<GroupedRecord[]>((acc, record) => {
    const existingGroup = acc.find(group =>
      group.mainTitle === record.urlTitle &&
      group.userName === record.userName &&
      group.workspaceName === record.workspaceName
    );

    if (existingGroup) {
      existingGroup.contents.push({
        url: record.url,
        timestamp: record.timestamp,
        clickCount: record.clickCount
      });
      // 最新のステータスを使用
      if (new Date(record.timestamp) > new Date(existingGroup.contents[0].timestamp)) {
        existingGroup.status = record.status;
      }
    } else {
      acc.push({
        mainTitle: record.urlTitle,
        category: record.category,
        userName: record.userName,
        workspaceName: record.workspaceName,
        status: record.status,
        contents: [{
          url: record.url,
          timestamp: record.timestamp,
          clickCount: record.clickCount
        }]
      });
    }
    return acc;
  }, []);

  // グループ化されたレコードをソート
  const sortedGroups = [...groupedRecords].sort((a, b) => {
    if (orderBy === 'timestamp') {
      return order === 'asc'
        ? new Date(a.contents[0].timestamp).getTime() - new Date(b.contents[0].timestamp).getTime()
        : new Date(b.contents[0].timestamp).getTime() - new Date(a.contents[0].timestamp).getTime();
    } else {
      const aValue = a[orderBy as keyof Omit<GroupedRecord, 'contents'>] || '';
      const bValue = b[orderBy as keyof Omit<GroupedRecord, 'contents'>] || '';
      return order === 'asc'
        ? (aValue < bValue ? -1 : 1)
        : (bValue < aValue ? -1 : 1);
    }
  });

  return (
    <Box>
      {sortedGroups.map((group, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: '12px 0',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6">{group.mainTitle}</Typography>
                  <Chip
                    label={group.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={group.status === 'completed' ? '完了' : '未完了'}
                    size="small"
                    color={group.status === 'completed' ? 'success' : 'warning'}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {group.workspaceName} - {group.userName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  総クリック数: {group.contents.reduce((sum, content) => sum + content.clickCount, 0)}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>URL</TableCell>
                    <TableCell align="right">クリック数</TableCell>
                    <TableCell align="right">最終アクセス</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.contents.map((content, contentIndex) => (
                    <TableRow key={contentIndex}>
                      <TableCell>
                        <a href={content.url} target="_blank" rel="noopener noreferrer">
                          {content.url}
                        </a>
                      </TableCell>
                      <TableCell align="right">{content.clickCount}</TableCell>
                      <TableCell align="right">
                        {new Date(content.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default LearningRecordsTable;