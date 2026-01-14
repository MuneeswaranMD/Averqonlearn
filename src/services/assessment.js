import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';

export const AssessmentService = {
  // GET /api/assessments (All or by course)
  getAllAssessments: async () => {
    const q = query(collection(db, 'assessments'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // GET Assessment details with Questions
  getAssessmentById: async (id) => {
    const docRef = doc(db, 'assessments', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    
    // Fetch questions separately
    const q = query(collection(db, 'questions'), where('assessmentId', '==', id));
    const qSnapshot = await getDocs(q);
    const questions = qSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    return { id: docSnap.id, ...docSnap.data(), questions };
  },

  submitResult: async (resultData) => {
    const docRef = await addDoc(collection(db, 'results'), {
      ...resultData,
      submittedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...resultData };
  }
};
