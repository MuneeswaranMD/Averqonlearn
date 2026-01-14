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

export const ContentService = {
  // --- UNITS (Modules) ---

  // POST /units
  createUnit: async (unitData) => {
    // Expected: subjectId, title, order
    const docRef = await addDoc(collection(db, 'units'), unitData);
    return { id: docRef.id, ...unitData };
  },

  // --- LESSONS ---

  // GET /lessons?unitId=...
  getLessonsByUnit: async (unitId) => {
    const q = query(collection(db, 'lessons'), where('unitId', '==', unitId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // POST /lessons
  createLesson: async (lessonData) => {
    // Expected: unitId, title, youtubeVideoId, pptUrl, notesPdf
    const docRef = await addDoc(collection(db, 'lessons'), lessonData);
    return { id: docRef.id, ...lessonData };
  },

  // --- EXAMS ---
  
  // GET /exams?subjectId=...
  getExamsBySubject: async (subjectId) => {
    const q = query(collection(db, 'exams'), where('subjectId', '==', subjectId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // POST /exams
  createExam: async (examData) => {
    // Expected: subjectId, type (Internal/Model/Semester), totalMarks
    const docRef = await addDoc(collection(db, 'exams'), examData);
    return { id: docRef.id, ...examData };
  },

  // --- RESULTS ---

  // POST /results
  publishResult: async (resultData) => {
    // Expected: studentId, examId, marks, grade
    const docRef = await addDoc(collection(db, 'results'), resultData);
    return { id: docRef.id, ...resultData };
  },

  getStudentResults: async (studentId) => {
      const q = query(collection(db, 'results'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
