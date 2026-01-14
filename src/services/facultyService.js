import api from './api';

export const FacultyService = {
    // Get subjects taught by faculty
    getTaughtSubjects: async (facultyId) => {
        const response = await api.get('/academic/subjects', {
            params: { instructorId: facultyId }
        });
        return response.data;
    },

    // Get students in a subject
    getSubjectStudents: async (collegeId, dept) => {
        const response = await api.get('/users/role/student', {
            params: { collegeId, dept }
        });
        return response.data;
    },

    // Content Management
    uploadContent: async (data) => {
        const response = await api.post('/academic/content', data);
        return response.data;
    },

    getContentByFaculty: async (facultyId, type) => {
        const response = await api.get('/academic/content', {
            params: { facultyId, type }
        });
        return response.data;
    },

    deleteContent: async (id) => {
        const response = await api.delete(`/academic/content/${id}`);
        return response.data;
    },

    // Get student performance data
    getStudentPerformance: async (subjectId) => {
        return [
            { id: 1, name: 'Real Student Data Soon', score: 85, attendance: '92%' }
        ];
    }
};
