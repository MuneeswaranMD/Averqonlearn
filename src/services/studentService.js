import api from './api';

export const StudentService = {
    // Subjects & Progress
    getEnrolledSubjects: async (studentId) => {
        const response = await api.get('/academic/subjects', {
            params: { studentId }
        });
        return response.data;
    },

    // Course Content
    getContent: async (params) => {
        // params can be { subjectId, type, collegeId }
        const response = await api.get('/academic/content', {
            params
        });
        return response.data;
    },

    // Results & Assessments
    // Results & Assessments
    getResults: async (studentId) => {
        const response = await api.get('/exams/results');
        return response.data;
    },

    // Placement Stats
    getPlacementStatus: async (studentId) => {
        const response = await api.get('/placements/applications', {
            params: { studentId }
        });
        return response.data;
    },

    // Legacy wrappers (if needed)
    getVideoClasses: async (collegeId) => {
        const response = await api.get('/academic/content', {
            params: { collegeId, type: 'video' }
        });
        return response.data;
    },

    getNotes: async (collegeId) => {
        const response = await api.get('/academic/content', {
            params: { collegeId, type: 'note' }
        });
        return response.data;
    }
};
