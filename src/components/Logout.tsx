import React, { useEffect } from 'react';
import useLogout from '../hooks/useLogout';

const Logout: React.FC = () => {
  const logout = useLogout();

  useEffect(() => {
    logout();
  }, [logout]);

  return <div>Logging out...</div>;
};

export default Logout;