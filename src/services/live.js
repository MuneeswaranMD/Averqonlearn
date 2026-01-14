import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

export const LiveService = {
  // GET /api/live (All future/live classes)
  getUpcomingClasses: async () => {
    // In a real app, filtering by date would be better
    const q = query(
      collection(db, 'liveClasses'), 
      orderBy('startTime', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // GET /api/live (Today's classes)
  getTodayClasses: async () => {
    // Simplified query for demonstration
    const q = query(collection(db, 'liveClasses'));
    const snapshot = await getDocs(q);
    const classes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Client-side filter for "today" to keep specific date logic simple
    const today = new Date().toDateString();
    return classes.filter(c => new Date(c.startTime).toDateString() === today);
  },

  createClass: async (classData) => {
    const docRef = await addDoc(collection(db, 'liveClasses'), classData);
    return { id: docRef.id, ...classData };
  },

  updateClass: async (id, data) => {
    const docRef = doc(db, 'liveClasses', id);
    await updateDoc(docRef, data);
  },

  deleteClass: async (id) => {
    await deleteDoc(doc(db, 'liveClasses', id));
  }
};
