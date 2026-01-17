import api from './api';

export const ExamService = {
    getExams: async () => {
        const response = await api.get('/exams');
        return response.data;
    },

    getExamById: async (id) => {
        const response = await api.get(`/exams/${id}`);
        return response.data;
    },

    submitExam: async (examId, answers, violations = []) => {
        const response = await api.post('/exams/submit', { examId, answers, violations });
        return response.data;
    },

    logViolation: async (examId, type) => {
        const response = await api.post('/exams/log-violation', { examId, type });
        return response.data;
    },

    getResults: async () => {
        const response = await api.get('/exams/results');
        return response.data;
    },

    createExam: async (examData) => {
        const response = await api.post('/exams', examData);
        return response.data;
    },

    getAnalytics: async (examId) => {
        const response = await api.get(`/exams/analytics/${examId}`);
        return response.data;
    },

    getTPOAnalytics: async () => {
        const response = await api.get('/exams/tpo-analytics');
        return response.data;
    },

    executeCode: async (code, language) => {
        const response = await api.post('/exams/execute', { code, language });
        return response.data;
    },

    logActivity: async (examId, action, details) => {
        try {
            const response = await api.post('/exams/log-action', { examId, action, details });
            return response.data;
        } catch (err) {
            console.error("Failed to log activity", err);
        }
    }
};
