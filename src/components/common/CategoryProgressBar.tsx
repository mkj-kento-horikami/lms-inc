import React from 'react';
import { Typography, LinearProgress, Box } from '@mui/material';

interface CategoryProgressBarProps {
  category: string;
  progress: number;
  completed: number;
  total: number;
}

const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({ category, progress, completed, total }) => {
  return (
    <Box mb={2}>
      <Typography variant="h6">{category} 達成率: {progress.toFixed(2)}% ({completed}/{total})</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default CategoryProgressBar;