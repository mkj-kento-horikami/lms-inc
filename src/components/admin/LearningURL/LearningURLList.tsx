import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  TableSortLabel,
  Chip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { LearningURL } from '../../../types/LearningURL';
import { LEARNING_URL_MESSAGES } from '../../../constants/learningURL';

interface LearningURLListProps {
  learningUrls: LearningURL[];
  onEdit: (learningUrl: LearningURL) => void;
  onDelete: (id: string) => void;
  orderBy: keyof LearningURL;
  order: 'asc' | 'desc';
  onRequestSort: (property: keyof LearningURL) => void;
}

const LearningURLList: React.FC<LearningURLListProps> = ({
  learningUrls,
  onEdit,
  onDelete,
  orderBy,
  order,
  onRequestSort
}) => {
  const createSortHandler = (property: keyof LearningURL) => () => {
    onRequestSort(property);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        登録済み学習URL
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={createSortHandler('category')}
                >
                  {LEARNING_URL_MESSAGES.TABLE.CATEGORY}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'mainTitle'}
                  direction={orderBy === 'mainTitle' ? order : 'asc'}
                  onClick={createSortHandler('mainTitle')}
                >
                  {LEARNING_URL_MESSAGES.TABLE.MAIN_TITLE}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'mainDescription'}
                  direction={orderBy === 'mainDescription' ? order : 'asc'}
                  onClick={createSortHandler('mainDescription')}
                >
                  {LEARNING_URL_MESSAGES.TABLE.MAIN_DESCRIPTION}
                </TableSortLabel>
              </TableCell>
              <TableCell>{LEARNING_URL_MESSAGES.TABLE.CONTENTS}</TableCell>
              <TableCell>{LEARNING_URL_MESSAGES.TABLE.ACTIONS}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learningUrls.map(learningUrl => (
              <TableRow key={learningUrl.id}>
                <TableCell>
                  <Chip
                    label={learningUrl.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{learningUrl.mainTitle}</TableCell>
                <TableCell>{learningUrl.mainDescription}</TableCell>
                <TableCell>
                  {learningUrl.contents.map((content, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">{content.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {content.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        component="a"
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {content.url}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => onEdit(learningUrl)}
                      size="small"
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(learningUrl.id)}
                      size="small"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LearningURLList;