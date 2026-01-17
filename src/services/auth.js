import { auth } from '../firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import api from './api';

export const AuthService = {
  register: async (displayName, email, password, role = 'student', collegeId = null, collegeName = '') => {
    // 1. Create in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName });

    // 2. Create in MongoDB via our API
    const response = await api.post('/auth/register', { 
        displayName, 
        email, 
        password, 
        role, 
        collegeId, 
        collegeName,
        firebaseUid: user.uid
    });
    
    return response.data;
  },

  firebaseLogin: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // For Super Admin, we still want to fetch their profile from Mongo but authenticate via Firebase
    const response = await api.post('/auth/login', { email, password, bypassMongoAuth: true });
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('averqon_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  mongoLogin: async (email, password) => {
    // Standard MongoDB authentication for students/faculty/admins
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('averqon_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: async () => {
    try {
        await signOut(auth);
    } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('averqon_user');
    window.location.href = '/login';
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/auth/settings', settings);
    return response.data;
  }
};
