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
    getContent: async (subjectId) => {
        const response = await api.get('/academic/content', {
            params: { subjectId }
        });
        return response.data;
    },

    // Results & Assessments
    getExamResults: async (studentId) => {
        // Placeholder for initial migration
        return [];
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
