import api from './api';

export const AIService = {
    askTutor: async (collegeId, subjectId, question, history = []) => {
        try {
            const response = await api.post('/ai/ask', {
                collegeId,
                subjectId,
                question,
                history
            });

            return {
                text: response.data.answer,
                context: response.data.contextUsed,
                suggestedAction: response.data.suggestedAction,
                source: response.data.source
            };
        } catch (error) {
            console.error("AI Tutor Error:", error);
            throw error;
        }
    },

    generateMCQs: async (subjectId, topic) => {
        try {
            const response = await api.post('/ai/generate-quiz', { subjectId, topic });
            return response.data;
        } catch (error) {
            console.error("Quiz Gen Error:", error);
            return [];
        }
    },

    summarize: async (text) => {
        return `SUMMARY: ${text.slice(0, 100)}... [This topic is essential for your upcoming assessments]`;
    }
};
