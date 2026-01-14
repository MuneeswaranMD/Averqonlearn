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
  where,
  writeBatch
} from 'firebase/firestore';

export const StudentService = {
  // GET /students with optional filters
  // filters can be { department: 'CSE', year: '3rd Year', section: 'A', placed: true }
  getAllStudents: async (filters = {}) => {
    let q = query(collection(db, 'students'));
    
    // Apply filters if they exist
    // Note: Firestore requires composite indexes for multiple where clauses
    if (filters.department) {
      q = query(q, where('department', '==', filters.department));
    }
    if (filters.year) {
      q = query(q, where('year', '==', filters.year));
    }
    if (filters.section) {
       q = query(q, where('section', '==', filters.section));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // GET /students/:id
  getStudentById: async (id) => {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  },

  // POST /students - Create a rich student profile
  createStudent: async (studentData) => {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: new Date().toISOString(),
      // Ensure defaults for complex objects if not provided
      skills: studentData.skills || [],
      enrolledSubjects: studentData.enrolledSubjects || [],
      completedCourses: studentData.completedCourses || [],
      examResults: studentData.examResults || [],
      placementProfile: studentData.placementProfile || { eligible: false, placed: false }
    });
    return { id: docRef.id, ...studentData };
  },

  // PUT /students/:id
  updateStudent: async (id, data) => {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, data);
    return { id, ...data };
  },

  // DELETE /students/:id
  deleteStudent: async (id) => {
    // Delete from students collection
    const docRef = doc(db, 'students', id);
    await deleteDoc(docRef);
    
    // Also try to delete from users collection if the ID matches or via query
    const userRef = doc(db, 'users', id);
    try {
        await deleteDoc(userRef);
    } catch (e) {
        // Ignore if not found
    }
  },

  // Batch Create Students (for Excel Upload)
  batchCreateStudents: async (studentsData) => {
      const batch = writeBatch(db);
      const results = [];
      
      studentsData.forEach(student => {
          // Sanitization: Firestore doesn't accept 'undefined', replace with 'null' or default
          const safeStudent = Object.keys(student).reduce((acc, key) => {
              acc[key] = student[key] === undefined ? null : student[key];
              return acc;
          }, {});

          // Use rollNo as ID if available, otherwise auto-ID
          const docRef = safeStudent.rollNo ? doc(db, 'students', safeStudent.rollNo) : doc(collection(db, 'students'));
          
          const finalData = {
              ...safeStudent,
              name: safeStudent.name || 'Unknown Student',
              createdAt: new Date().toISOString(),
              skills: safeStudent.skills || [],
              enrolledSubjects: safeStudent.enrolledSubjects || [],
              completedCourses: safeStudent.completedCourses || [],
              examResults: safeStudent.examResults || [],
              placementProfile: safeStudent.placementProfile || { eligible: false, placed: false }
          };
          batch.set(docRef, finalData);
          results.push({ id: docRef.id, ...finalData });
      });

      await batch.commit();
      return results;
  },

  // Batch Delete Students
  batchDeleteStudents: async (studentIds) => {
      const batch = writeBatch(db);
      studentIds.forEach(id => {
          const docRef = doc(db, 'students', id);
          batch.delete(docRef);
          
          const userRef = doc(db, 'users', id);
          batch.delete(userRef);
      });
      await batch.commit();
  },

  // Filter helper logic (client-side if needed for complex queries not indexed)
  filterStudents: (students, criteria) => {
    return students.filter(student => {
       let match = true;
       if (criteria.text) {
           const text = criteria.text.toLowerCase();
           match = match && (
               student.name?.toLowerCase().includes(text) || 
               student.rollNo?.toLowerCase().includes(text) ||
               student.email?.toLowerCase().includes(text)
           );
       }
       // Add other custom logic filters here
       return match;
    });
  }
};
