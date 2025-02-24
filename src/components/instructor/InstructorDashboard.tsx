import React from 'react';
import InstructorLearningLogList from './InstructorLearningLogList';

const InstructorDashboard: React.FC = () => {
  return (
    <div>
      <h2>Instructor Dashboard</h2>
      <p>Welcome, instructor!</p>
      <InstructorLearningLogList />
    </div>
  );
};

export default InstructorDashboard;