import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import WorkspaceManagement from './WorkspaceManagement';
import LearningURLManagement from './LearningURLManagement';
import LearningRecords from './LearningRecords';
import LearningLogList from '../common/LearningLogList';
import LearningResourceList from '../common/LearningResourceList';
import UserList from '../common/UserList';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { LearningLog } from '../../types/LearningLog';
import { LearningResource } from '../../types/LearningResource';
import { User } from '../../types/User';

const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<LearningLog[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const querySnapshot = await getDocs(collection(db, 'learningLogs'));
      const logsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content || '',
        date: doc.data().date || '',
        userId: doc.data().userId,
        userEmail: doc.data().userEmail,
        url: doc.data().url,
        clickedAt: doc.data().clickedAt
      })) as LearningLog[];
      setLogs(logsData);
    };

    const fetchResources = async () => {
      const querySnapshot = await getDocs(collection(db, 'learningResources'));
      const resourcesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        url: doc.data().url
      })) as LearningResource[];
      setResources(resourcesData);
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name, // name プロパティを追加
        email: doc.data().email,
        role: doc.data().role
      })) as User[];
      setUsers(usersData);
    };

    fetchLogs();
    fetchResources();
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Routes>
        <Route path="/admin/workspace-management" element={<WorkspaceManagement />} />
        <Route path="/admin/learning-url-management" element={<LearningURLManagement />} />
        <Route path="/admin/learning-records" element={<LearningRecords />} />
      </Routes>
      <LearningLogList logs={logs} />
      <LearningResourceList resources={resources} />
      <UserList users={users} />
    </div>
  );
};

export default AdminDashboard;