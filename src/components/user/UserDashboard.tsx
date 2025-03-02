import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { LearningRecord } from '../../types/LearningRecord';
import { LearningURL } from '../../types/LearningURL';
import { Container, Typography } from '@mui/material';
import CategoryProgressBar from '../common/CategoryProgressBar';
import OverallProgressBar from '../common/OverallProgressBar';

interface CategoryProgress {
  category: string;
  progress: number;
  completed: number;
  total: number;
}

const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState<number>(0);

  useEffect(() => {
    const fetchLearningData = async () => {
      if (!currentUser) return;

      // Fetch LearningURLs
      const learningURLsSnapshot = await getDocs(collection(db, 'learningUrls'));
      const learningURLsData = learningURLsSnapshot.docs.map(doc => doc.data() as LearningURL);

      // Fetch LearningRecords
      const learningRecordsQuery = query(collection(db, 'learningRecords'), where('userId', '==', currentUser.uid));
      const learningRecordsSnapshot = await getDocs(learningRecordsQuery);
      const learningRecordsData = learningRecordsSnapshot.docs.map(doc => doc.data() as LearningRecord);

      const categoryCounts: { [key: string]: { total: number; completed: number } } = {};

      learningURLsData.forEach(url => {
        if (!categoryCounts[url.category]) {
          categoryCounts[url.category] = { total: 0, completed: 0 };
        }
        categoryCounts[url.category].total += 1;
      });

      learningRecordsData.forEach(record => {
        if (record.clickCount > 0) {
          categoryCounts[record.category].completed += 1;
        }
      });

      const progressData = Object.keys(categoryCounts).map(category => ({
        category,
        progress: (categoryCounts[category].completed / categoryCounts[category].total) * 100,
        completed: categoryCounts[category].completed,
        total: categoryCounts[category].total,
      }));

      setCategoryProgress(progressData);

      // Calculate overall progress
      const totalCompleted = progressData.reduce((sum, category) => sum + category.completed, 0);
      const totalURLs = progressData.reduce((sum, category) => sum + category.total, 0);
      const overallProgress = (totalCompleted / totalURLs) * 100;
      setOverallProgress(overallProgress);
    };

    fetchLearningData();
  }, [currentUser]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>ユーザーダッシュボード</Typography>
      <OverallProgressBar progress={overallProgress} />
      {categoryProgress.map(({ category, progress, completed, total }) => (
        <CategoryProgressBar
          key={category}
          category={category}
          progress={progress}
          completed={completed}
          total={total}
        />
      ))}
    </Container>
  );
};

export default UserDashboard;