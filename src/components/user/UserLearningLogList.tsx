import React from 'react';
import useLearningLogs from '../../hooks/useLearningLogs';

const UserLearningLogList: React.FC = () => {
  const { logs, error, user, handleLinkClick } = useLearningLogs('');

  return (
    <div>
      <h2>学習記録リスト</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>URL</th>
            <th>クリックした時間</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.title}</td>
              <td>
                <a
                  href={log.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(log)}
                >
                  {log.url}
                </a>
              </td>
              <td>{log.clickedAt.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserLearningLogList;