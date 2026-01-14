import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWNwA5QGBug-3EknweIASBITfT9vM2lfU",
  authDomain: "munees-ed613.firebaseapp.com",
  projectId: "munees-ed613",
  storageBucket: "munees-ed613.firebasestorage.app",
  messagingSenderId: "61722437820",
  appId: "1:61722437820:web:99986341830e8dcf42c8b9",
  measurementId: "G-275EL3FT2V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };

export default app;
