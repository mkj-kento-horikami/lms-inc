import React from 'react';
import { LearningLog } from '../../types/LearningLog';

interface LearningLogListProps {
  logs: LearningLog[];
}

const LearningLogList: React.FC<LearningLogListProps> = ({ logs }) => {
  return (
    <div>
      <h2>Learning Logs</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            <h3>{log.title}</h3>
            <p>{log.content}</p>
            <p>{log.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningLogList;