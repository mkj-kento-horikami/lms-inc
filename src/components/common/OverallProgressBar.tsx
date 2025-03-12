import React from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';

interface OverallProgressBarProps {
  progress: number;
}

const OverallProgressBar: React.FC<OverallProgressBarProps> = ({ progress }) => {
  const isCompleted = progress === 100;

  return (
    <Box my={2}>
      <Typography variant="h6">全体の進捗</Typography>
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
      <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
      {isCompleted && <Typography variant="body2" color="textSecondary">🎉 全体を達成しました！ 🎉</Typography>}
    </Box>
  );
};

export default OverallProgressBar;