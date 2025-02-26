import React from 'react';
import UserLearningLogList from './UserLearningLogList';

const UserDashboard: React.FC = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <UserLearningLogList />
    </div>
  );
};

export default UserDashboard;