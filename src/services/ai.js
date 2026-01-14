const API_URL = 'http://localhost:5000/api';

export const AIService = {
  // POST /api/ai/ask
  askTutor: async (userId, courseId, lessonId, question, context = {}) => {
    try {
      const response = await fetch(`${API_URL}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId,
          lessonId,
          question,
          context // Includes lesson notes/transcript if available
        }),
      });
      
      if (!response.ok) {
        throw new Error('AI Service Failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error asking AI Tutor:', error);
      throw error;
    }
  }
};
