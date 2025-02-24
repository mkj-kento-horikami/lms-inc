import React from 'react';
import UserList from './UserList';
import LearningResourceForm from './LearningResourceForm';
import LearningResourceList from './LearningResourceList';
import LearningLogList from './LearningLogList';
import WorkspaceForm from './WorkspaceForm';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, admin!</p>
      <UserList />
      <LearningResourceForm />
      <LearningResourceList />
      <LearningLogList />
      <WorkspaceForm />
    </div>
  );
};

export default AdminDashboard;