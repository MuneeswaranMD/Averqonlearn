import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const UserService = {
  // GET user profile
  getUserProfile: async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  },

  // UPDATE user profile
  updateUserProfile: async (uid, data) => {
    const docRef = doc(db, 'users', uid);
    // use setDoc with merge: true to create if not exists or update if exists
    await setDoc(docRef, data, { merge: true });
    return { uid, ...data };
  }
};
