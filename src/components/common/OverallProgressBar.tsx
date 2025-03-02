import React from 'react';
import { Typography, LinearProgress, Box } from '@mui/material';

interface OverallProgressBarProps {
  progress: number;
}

const OverallProgressBar: React.FC<OverallProgressBarProps> = ({ progress }) => {
  return (
    <Box mb={4}>
      <Typography variant="h6">全体の達成率: {progress.toFixed(2)}%</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default OverallProgressBar;