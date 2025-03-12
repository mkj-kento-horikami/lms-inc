import React from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';

interface CategoryProgressBarProps {
  category: string;
  progress: number;
  completed: number;
  total: number;
}

const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({ category, progress, completed, total }) => {
  const isCompleted = progress === 100;

  return (
    <Box my={2}>
      <Typography variant="h6">{category}</Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          backgroundColor: isCompleted ? '#ffe4e1' : undefined,
          '& .MuiLinearProgress-bar': {
            backgroundColor: isCompleted ? 'pink' : undefined,
          },
        }}
      />
      <Typography variant="body2" color="textSecondary">{`${completed}/${total} (${progress}%)`}</Typography>
      {isCompleted && <Typography variant="body2" color="textSecondary">達成！</Typography>}
    </Box>
  );
};

export default CategoryProgressBar;