import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface Workspace {
  workspaceId: string;
  role: string;
}

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  isAdmin: boolean;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ workspaces, isAdmin }) => {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const { setSelectedWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const handleWorkspaceSelect = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
  };

  const handleContinue = () => {
    if (selectedWorkspaceId === 'admin') {
      setSelectedWorkspace({ workspaceId: 'admin', role: 'admin' });
      navigate('/admin-dashboard');
    } else if (selectedWorkspaceId) {
      const selectedWorkspace = workspaces.find(ws => ws.workspaceId === selectedWorkspaceId);
      if (selectedWorkspace) {
        setSelectedWorkspace(selectedWorkspace);
        navigate('/dashboard');
      }
    }
  };

  return (
    <div>
      <h2>Select a Workspace</h2>
      {workspaces.map((workspace) => (
        <div key={workspace.workspaceId}>
          <input
            type="radio"
            id={workspace.workspaceId}
            name="workspace"
            value={workspace.workspaceId}
            onChange={() => handleWorkspaceSelect(workspace.workspaceId)}
          />
          <label htmlFor={workspace.workspaceId}>{workspace.workspaceId}</label>
        </div>
      ))}
      {isAdmin && (
        <div>
          <input
            type="radio"
            id="admin"
            name="workspace"
            value="admin"
            onChange={() => handleWorkspaceSelect('admin')}
          />
          <label htmlFor="admin">Login as Admin</label>
        </div>
      )}
      <button onClick={handleContinue} disabled={!selectedWorkspaceId}>
        Continue
      </button>
    </div>
  );
};

export default WorkspaceSelector;