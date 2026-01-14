import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const AIService = {
    askTutor: async (collegeId, subjectId, userMessage) => {
        try {
            // 1. Fetch relevant context from Firestore (Notes & Videos)
            const q = query(
                collection(db, 'content'),
                where('collegeId', '==', collegeId)
            );
            
            const snapshot = await getDocs(q);
            const contextItems = snapshot.docs.map(doc => doc.data());

            // 2. Simple "Reasoning" Engine (Keyword Matching)
            const message = userMessage.toLowerCase();
            let relevantContext = contextItems.filter(item => 
                item.description?.toLowerCase().includes(message) ||
                item.title?.toLowerCase().includes(message) ||
                (subjectId && item.subjectId === subjectId)
            );

            // 3. Generate Simulated AI Response
            if (relevantContext.length > 0) {
                const bestMatch = relevantContext[0];
                return {
                    text: `Based on your course materials for "${bestMatch.title}", here's what I found: ${bestMatch.description}. This is covered in ${bestMatch.unit}.`,
                    context: bestMatch,
                    suggestedAction: 'GENERATE_QUIZ'
                };
            }

            return {
                text: "I couldn't find specific matches in your uploaded notes for that topic. However, generally speaking, most engineering curriculums treat this as a core concept. Would you like me to explain it based on standard academic patterns?",
                context: null
            };

        } catch (error) {
            console.error("AI Tutor Error:", error);
            return { text: "I'm having trouble accessing the academic cluster right now. Please try again in a moment." };
        }
    },

    generateMCQs: async (context) => {
        // Mock MCQ generation based on context
        return [
            { question: `Which unit covers ${context?.title}?`, options: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4'], correct: 0 },
            { question: `What is a primary focus of this topic?`, options: ['Efficiency', 'Hardware', 'Networking', 'None'], correct: 0 }
        ];
    },

    summarize: async (text) => {
        return `SUMMARY: ${text.slice(0, 100)}... [This topic is essential for your upcoming assessments]`;
    }
};
