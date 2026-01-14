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

export const SubjectService = {
  // GET /subjects
  getAllSubjects: async () => {
    const q = query(collection(db, 'subjects'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // GET /subjects/:id
  getSubjectById: async (id) => {
    const docRef = doc(db, 'subjects', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const subjectData = { id: docSnap.id, ...docSnap.data() };
    
    // Fetch units (modules)
    const q = query(collection(db, 'units'), where('subjectId', '==', id));
    const unitsSnap = await getDocs(q);
    const units = unitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { ...subjectData, units };
  },

  // POST /subjects
  createSubject: async (subjectData) => {
    // Expected data: name, semester, department, facultyId
    const docRef = await addDoc(collection(db, 'subjects'), {
      ...subjectData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...subjectData };
  },

  // PUT /subjects/:id
  updateSubject: async (id, data) => {
    const docRef = doc(db, 'subjects', id);
    await updateDoc(docRef, data);
    return { id, ...data };
  },

  // DELETE /subjects/:id
  deleteSubject: async (id) => {
    const docRef = doc(db, 'subjects', id);
    await deleteDoc(docRef);
  },

  // Helper: Get Units for a subject
  getUnits: async (subjectId) => {
    const q = query(collection(db, 'units'), where('subjectId', '==', subjectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
