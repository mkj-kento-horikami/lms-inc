import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase Admin SDK
initializeAdminApp({
  credential: cert(serviceAccount),
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedData = async () => {
  try {
    const adminAuth = getAdminAuth();

    // Delete existing users if they exist
    try {
      await adminAuth.deleteUser('user123');
    } catch (error) {
      console.log('user123 does not exist or could not be deleted:', error.message);
    }

    try {
      await adminAuth.deleteUser('admin123');
    } catch (error) {
      console.log('admin123 does not exist or could not be deleted:', error.message);
    }

    try {
      await adminAuth.deleteUser('instructor123');
    } catch (error) {
      console.log('instructor123 does not exist or could not be deleted:', error.message);
    }

    // Create users in Firebase Authentication
    await adminAuth.createUser({
      uid: 'user123',
      email: 'user_taro@example.com',
      password: 'aaaaaa',
      displayName: 'User Taro',
    });

    await adminAuth.createUser({
      uid: 'admin123',
      email: 'admin_taro@example.com',
      password: 'aaaaaa',
      displayName: 'Admin Taro',
    });

    await adminAuth.createUser({
      uid: 'instructor123',
      email: 'instructor_taro@example.com',
      password: 'aaaaaa',
      displayName: 'Instructor Taro',
    });

    // Users Collection
    await setDoc(doc(db, 'users', 'user123'), {
      id: 'user123',
      name: 'User Taro',
      email: 'user_taro@example.com',
      isAdmin: false,
      workspaces: [
        { workspaceId: 'workspaceA', role: 'user' },
        { workspaceId: 'workspaceB', role: 'user' }
      ]
    });

    await setDoc(doc(db, 'users', 'admin123'), {
      id: 'admin123',
      name: 'Admin Taro',
      email: 'admin_taro@example.com',
      isAdmin: true,
      workspaces: [
        { workspaceId: 'workspaceA', role: 'admin' },
        { workspaceId: 'workspaceB', role: 'admin' }
      ]
    });

    await setDoc(doc(db, 'users', 'instructor123'), {
      id: 'instructor123',
      name: 'Instructor Taro',
      email: 'instructor_taro@example.com',
      isAdmin: false,
      workspaces: [
        { workspaceId: 'workspaceA', role: 'instructor' },
        { workspaceId: 'workspaceB', role: 'instructor' }
      ]
    });

    // Workspaces Collection
    await setDoc(doc(db, 'workspaces', 'workspaceA'), {
      id: 'workspaceA',
      name: 'AI Bootcamp',
      createdBy: 'admin123'
    });

    await setDoc(doc(db, 'workspaces', 'workspaceB'), {
      id: 'workspaceB',
      name: 'Web Development',
      createdBy: 'admin123'
    });

    // Learning URLs Collection
    await setDoc(doc(db, 'learningUrls', 'workspaceA_url456'), {
      id: 'url456',
      workspaceId: 'workspaceA',
      url: 'https://example.com/learning-course',
      createdBy: 'admin123'
    });

    // Learning Records Collection
    await setDoc(doc(db, 'learningRecords', 'user123_url456'), {
      userId: 'user123',
      workspaceId: 'workspaceA',
      urlId: 'url456',
      status: 'completed',
      timestamp: '2025-02-27T12:00:00Z'
    });

    console.log('シードデータの追加が完了しました。');
  } catch (error) {
    console.error('シードデータの追加中にエラーが発生しました:', error);
  }
};

seedData();