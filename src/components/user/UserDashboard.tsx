import React from 'react';
import LearningResourceList from './LearningResourceList';
import UserLearningLogList from './UserLearningLogList';

const UserDashboard: React.FC = () => {
  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Welcome, user!</p>
      <LearningResourceList />
      <UserLearningLogList />
    </div>
  );
};

export default UserDashboard;