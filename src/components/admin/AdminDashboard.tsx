import React from 'react';
import UserList from './UserList';
import LearningResourceForm from './LearningResourceForm';
import LearningResourceList from './LearningResourceList';
import LearningLogList from './LearningLogList';
import WorkspaceForm from './WorkspaceForm';
import WorkspaceInviteForm from './WorkspaceInviteForm';
import WorkspaceList from './WorkspaceList';

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
      <WorkspaceList />
    </div>
  );
};

export default AdminDashboard;