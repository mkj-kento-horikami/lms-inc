import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserManagement from './UserManagement';
import LearningRecords from './LearningRecords';
import LearningURLs from './LearningURLs';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { LearningLog } from '../../types/LearningLog';
import { LearningResource } from '../../types/LearningResource';
import { User } from '../../types/User';

const InstructorDashboard: React.FC = () => {
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
        name: doc.data().name,
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
      <h2>Instructor Dashboard</h2>
      <Routes>
        <Route path="/instructor/user-management" element={<UserManagement />} />
        <Route path="/instructor/learning-records" element={<LearningRecords />} />
        <Route path="/instructor/learning-urls" element={<LearningURLs />} />
      </Routes>
    </div>
  );
};

export default InstructorDashboard;