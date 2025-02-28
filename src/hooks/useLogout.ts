import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useWorkspace } from '../contexts/WorkspaceContext';

const useLogout = () => {
  const navigate = useNavigate();
  const { setSelectedWorkspace } = useWorkspace();

  const logout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      await signOut(auth);
      setSelectedWorkspace(null); // ログアウト時にワークスペースをリセット
      alert('You have been logged out.');
      navigate('/login');
    }
  };

  return logout;
};

export default useLogout;