import api from './api';

export const ProgressService = {
    updateVideoProgress: async (subjectId, contentId, watchedDuration, isCompleted) => {
        const response = await api.post('/progress/video-progress', { subjectId, contentId, watchedDuration, isCompleted });
        return response.data;
    },

    getMyCourses: async () => {
        const response = await api.get('/progress/my-courses');
        return response.data;
    },

    getMyHistory: async () => {
        const response = await api.get('/progress/my-history');
        return response.data;
    },

    getMyAnalysis: async () => {
        const response = await api.get('/progress/my-analysis');
        return response.data;
    },

    // For Faculty/Admins
    getStudentHistory: async (studentId) => {
        const response = await api.get(`/progress/student-history/${studentId}`);
        return response.data;
    },
    
    getStudentAnalysis: async (studentId) => {
        const response = await api.get(`/progress/student-analysis/${studentId}`);
        return response.data;
    }
};
