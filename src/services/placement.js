import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';

export const PlacementService = {
  // GET /api/jobs
  getAllJobs: async () => {
    const q = query(collection(db, 'jobs'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // POST /api/jobs
  postJob: async (jobData) => {
    const docRef = await addDoc(collection(db, 'jobs'), {
      ...jobData,
      postedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...jobData };
  },

  // POST /api/apply
  applyForJob: async (applicationData) => {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...applicationData,
      appliedAt: new Date().toISOString(),
      status: 'Applied'
    });
    return { id: docRef.id, ...applicationData };
  },

  // GET /api/applications (For a user)
  getUserApplications: async (userId) => {
    const q = query(collection(db, 'applications'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
