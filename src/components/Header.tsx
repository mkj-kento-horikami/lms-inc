import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import WorkspaceSwitcher from './WorkspaceSwitcher';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/signup">Signup</Link></li>
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
          <WorkspaceSwitcher />
        </div>
      )}
    </header>
  );
};

export default Header;