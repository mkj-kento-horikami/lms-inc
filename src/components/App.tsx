import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';
import PasswordReset from './PasswordReset';
import UserProfile from './user/UserProfile';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
import InstructorDashboard from './instructor/InstructorDashboard';
import Header from './Header';
import '../styles/App.css'; // パスが正しいか確認

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data()?.role);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/profile" element={<UserProfile />} />
            {userRole === 'admin' && <Route path="/dashboard" element={<AdminDashboard />} />}
            {userRole === 'user' && <Route path="/dashboard" element={<UserDashboard />} />}
            {userRole === 'instructor' && <Route path="/dashboard" element={<InstructorDashboard />} />}
            {/* 他のルート */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;