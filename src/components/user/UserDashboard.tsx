import React, { useEffect, useState } from 'react';
import LearningLogList from '../common/LearningLogList';
import LearningResourceList from '../common/LearningResourceList';
import UserList from '../common/UserList';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { LearningLog } from '../../types/LearningLog';
import { LearningResource } from '../../types/LearningResource';
import { User } from '../../types/User';

const UserDashboard: React.FC = () => {
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
      <h2>User Dashboard</h2>
      <LearningLogList logs={logs} />
      <LearningResourceList resources={resources} />
      <UserList users={users} />
    </div>
  );
};

export default UserDashboard;