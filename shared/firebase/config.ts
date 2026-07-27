import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA1yn6tz3nVrhRB87jtLIOi3RGKO1ky2x4",
  authDomain: "seniorease-d6f48.firebaseapp.com",
  projectId: "seniorease-d6f48",
  storageBucket: "seniorease-d6f48.firebasestorage.app",
  messagingSenderId: "826864422591",
  appId: "1:826864422591:web:3256d7bc156b435a92c00a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);