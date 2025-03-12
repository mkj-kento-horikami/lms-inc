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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LearningRecord } from '../../types/LearningRecord';
import { LearningURL } from '../../types/LearningURL';

interface LearningURLsTableProps {
  learningResources: LearningURL[];
  learningRecords: LearningRecord[];
  handleClick: (resource: LearningURL, contentUrl: string) => void;
  handleStatusChange: (recordId: string, newStatus: 'completed' | 'not completed') => void;
}

const LearningURLsTable: React.FC<LearningURLsTableProps> = ({ learningResources, learningRecords, handleClick, handleStatusChange }) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>学習教材</Typography>
      {learningResources.map(resource => {
        const record = learningRecords.find(record => record.urlId === resource.id);
        
        return (
          <Accordion key={resource.id} sx={{ mb: 2 }}>
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
                    <Typography variant="h6">{resource.mainTitle}</Typography>
                    <Chip
                      label={resource.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {record && (
                      <Chip
                        label={`クリック数: ${record.clickCount}`}
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    {resource.mainDescription}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 200, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    ステータス:
                  </Typography>
                  {record ? (
                    <Select
                      size="small"
                      value={record.status}
                      onChange={(e) => handleStatusChange(record.id, e.target.value as 'completed' | 'not completed')}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="completed">完了</MenuItem>
                      <MenuItem value="not completed">未完了</MenuItem>
                    </Select>
                  ) : '記録なし'}
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>タイトル</TableCell>
                      <TableCell>説明</TableCell>
                      <TableCell>URL</TableCell>
                      <TableCell align="right">最終アクセス</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resource.contents.map((content, index) => (
                      <TableRow key={index}>
                        <TableCell>{content.title}</TableCell>
                        <TableCell>{content.description}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleClick(resource, content.url)}
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            variant="text"
                          >
                            {content.url}
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          {record ? new Date(record.timestamp).toLocaleString() : 'なし'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Container>
  );
};

export default LearningURLsTable;