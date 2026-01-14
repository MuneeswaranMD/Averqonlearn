import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

export const FacultyService = {
  // GET /faculty
  getAllFaculty: async () => {
    const q = query(collection(db, 'faculty'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // GET /faculty/:id
  getFacultyById: async (id) => {
    const docRef = doc(db, 'faculty', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
  },

  // POST /faculty
  addFaculty: async (facultyData) => {
     // name, subject, department, email
    const docRef = await addDoc(collection(db, 'faculty'), facultyData);
    return { id: docRef.id, ...facultyData };
  },

  // Helper: map auth uid to faculty profile if exists
  getFacultyProfileByEmail: async (email) => {
     const q = query(collection(db, 'faculty'), where('email', '==', email));
     const snapshot = await getDocs(q);
     if (!snapshot.empty) {
         const doc = snapshot.docs[0];
         return { id: doc.id, ...doc.data() };
     }
     return null;
  }
};
