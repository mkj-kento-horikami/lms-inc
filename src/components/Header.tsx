import React from 'react';
import { Link } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import { useWorkspace } from '../contexts/WorkspaceContext';

const Header: React.FC = () => {
  const { selectedWorkspace } = useWorkspace();
  const logout = useLogout();

  return (
    <header>
      <h1>Header</h1>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          {selectedWorkspace && (
            <>
              <li>Workspace: {selectedWorkspace.workspaceId}</li>
              <li>Role: {selectedWorkspace.role}</li>
              <li><button onClick={logout}>Logout</button></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;