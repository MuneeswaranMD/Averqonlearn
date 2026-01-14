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

export const CourseService = {
  // GET /api/courses
  getAllCourses: async () => {
    const q = query(collection(db, 'courses'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // GET /api/courses/:id
  getCourseById: async (id) => {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const courseData = { id: docSnap.id, ...docSnap.data() };
    
    // Fetch modules
    const q = query(collection(db, 'modules'), where('courseId', '==', id));
    const modulesSnap = await getDocs(q);
    const modules = modulesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { ...courseData, modules };
  },

  // POST /api/courses
  createCourse: async (courseData) => {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...courseData };
  },

  // PUT /api/courses/:id
  updateCourse: async (id, data) => {
    const docRef = doc(db, 'courses', id);
    await updateDoc(docRef, data);
    return { id, ...data };
  },

  // DELETE /api/courses/:id
  deleteCourse: async (id) => {
    const docRef = doc(db, 'courses', id);
    await deleteDoc(docRef);
  },

  // GET /api/modules/:courseId
  getModules: async (courseId) => {
    const q = query(collection(db, 'modules'), where('courseId', '==', courseId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
