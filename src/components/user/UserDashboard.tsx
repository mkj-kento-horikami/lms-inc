import React from 'react';
import LearningResourceList from './LearningResourceList';
import UserLearningLogList from './UserLearningLogList';

const UserDashboard: React.FC = () => {
  return (
    <div>
      <h2>ユーザーダッシュボード</h2>
      <LearningResourceList />
      <UserLearningLogList />
    </div>
  );
};

export default UserDashboard;