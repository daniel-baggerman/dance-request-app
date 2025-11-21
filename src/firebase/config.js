import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5NxfQlfyR_f3LHFh_MniEEUUmEN_UDgA",
  authDomain: "dance-request-app.firebaseapp.com",
  projectId: "dance-request-app",
  storageBucket: "dance-request-app.firebasestorage.app",
  messagingSenderId: "613036253968",
  appId: "1:613036253968:web:d3fe986e0fa491f9d4bb95",
  measurementId: "G-8TKN85QF8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);