import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../contexts/WorkspaceContext';

const WorkspaceSelector: React.FC = () => {
  const { workspaces, isAdmin, setSelectedWorkspace } = useWorkspace();
  const navigate = useNavigate();

  console.log('WorkspaceSelector props:', { workspaces, isAdmin }); // デバッグ用ログ

  const handleSelectWorkspace = (workspaceId: string, role: string) => {
    const selectedWorkspace = workspaces.find(ws => ws.workspaceId === workspaceId) || { workspaceId, name: '', role };
    setSelectedWorkspace(selectedWorkspace);
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Workspace Selector</h2>
      <ul>
        {workspaces.length > 0 ? (
          workspaces.map(workspace => (
            <li key={workspace.workspaceId}>
              <button onClick={() => handleSelectWorkspace(workspace.workspaceId, workspace.role)}>
                {workspace.name}
              </button>
            </li>
          ))
        ) : (
          <p>No workspaces available</p>
        )}
        {isAdmin && (
          <li>
            <button onClick={() => handleSelectWorkspace('', 'admin')}>
              Login as Admin
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default WorkspaceSelector;