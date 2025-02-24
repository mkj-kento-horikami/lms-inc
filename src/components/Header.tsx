import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import WorkspaceSwitcher from './WorkspaceSwitcher';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user role and workspace
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setRole('admin');
          setWorkspaceName(null);
        } else {
          const workspaceSnapshot = await getDocs(collection(db, 'workspaces'));
          for (const workspaceDoc of workspaceSnapshot.docs) {
            const userWorkspaceDoc = await getDoc(doc(db, `workspaces/${workspaceDoc.id}/users`, currentUser.uid));
            if (userWorkspaceDoc.exists()) {
              setRole(userWorkspaceDoc.data().role);
              setWorkspaceName(workspaceDoc.data().name);
              break;
            }
          }
        }
      } else {
        setUser(null);
        setRole(null);
        setWorkspaceName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <header>
      <nav>
        <ul>
          {!user && <li><Link to="/signup">Signup</Link></li>}
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/logout">Logout</Link></li>
          <li><Link to="/password-reset">Password Reset</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <p>UID: {user.uid}</p>
          {workspaceName && <p>Workspace: {workspaceName}</p>}
          {role && <p>Role: {role}</p>}
          <WorkspaceSwitcher />
        </div>
      )}
    </header>
  );
};

export default Header;