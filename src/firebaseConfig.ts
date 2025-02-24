import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyB4A6zSs_kP78em2ywaqWFzUAqe6lqJhrM",
  authDomain: "lms-inc-b0bc1.firebaseapp.com",
  projectId: "lms-inc-b0bc1",
  storageBucket: "lms-inc-b0bc1.firebasestorage.app",
  messagingSenderId: "18093679559",
  appId: "1:18093679559:web:4de22c8fd4e3aca79c6fe2",
  measurementId: "G-VWFNTQLT7P"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, analytics };