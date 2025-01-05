// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAHJi9R4fSYUtLJdQ7qX5KS50lc9W1rUFE",
  authDomain: "ai-trip-planner-27f6c.firebaseapp.com",
  projectId: "ai-trip-planner-27f6c",
  storageBucket: "ai-trip-planner-27f6c.firebasestorage.app",
  messagingSenderId: "384914014569",
  appId: "1:384914014569:web:70f2973183f6883bf23df8",
  measurementId: "G-GTDW3BREKQ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);