import React from 'react';
import UserList from './UserList';
import LearningResourceForm from './LearningResourceForm';
import LearningResourceList from './LearningResourceList';
import LearningLogList from './LearningLogList';
import WorkspaceForm from './WorkspaceForm';
import WorkspaceList from './WorkspaceList';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h2>管理者ダッシュボード</h2>
      <p>管理者の方、ようこそ！</p>
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