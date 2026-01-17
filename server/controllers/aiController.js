const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Subject, Content } = require('../models/Subject');
const User = require('../models/User');
const Batch = require('../models/Batch');

const PROMPTS = {
    student: `SYSTEM: You are a friendly AI tutor for college students. Use only the provided academic context. Explain clearly with examples. Do not assume knowledge beyond syllabus.
    RESPONSE RULES: Simple language, Step-by-step explanation, No hallucination.`,
    
    faculty: `SYSTEM: You are an academic assistant for faculty. Focus on analytics, question generation, and insights.
    RESPONSE RULES: Structured output, Use bullet points, Academic tone.`,
    
    placement: `SYSTEM: You are a placement analytics assistant. Use only student and placement data. Provide insights and recommendations.
    OUTPUT: Eligible students, Skill gaps, Readiness score.`,
    
    collegeAdmin: `SYSTEM: You are an institutional intelligence assistant. Summarize data and generate reports.
    RESPONSE RULES: Executive summary, Data-driven, Actionable insights.`
};

const askAI = async (req, res) => {
    try {
        const { question, subjectId, history } = req.body;
        const user = req.user;

        // 1. Initialize Cloud AI (Gemini)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
             return res.json({ 
                 answer: "System Error: IA API Key is missing.", 
                 source: "System" 
             });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // 2. Permission + Scope Filter (RAG Context Fetching)
        let retrievalContext = "";
        
        if (subjectId) {
            const subject = await Subject.findById(subjectId);
            if (subject && subject.collegeId.toString() === user.collegeId.toString()) {
                
                // Role-based filtering logic
                let canAccess = false;
                if (user.role === 'collegeAdmin' || user.role === 'superAdmin') {
                    canAccess = true;
                } else if (user.role === 'faculty') {
                    // Check if faculty is assigned to this subject or one of its batches
                    canAccess = subject.instructorId?.toString() === user._id.toString();
                    if (!canAccess) {
                        const batchMatch = await Batch.findOne({ _id: { $in: subject.batches }, facultyIds: user._id });
                        if (batchMatch) canAccess = true;
                    }
                } else if (user.role === 'student') {
                    // Check if student belongs to one of the batches assigned to this subject
                    const myBatches = await Batch.find({ studentIds: user._id, isActive: true });
                    const myBatchIds = myBatches.map(b => b._id.toString());
                    canAccess = subject.batches.some(bId => myBatchIds.includes(bId.toString()));
                }

                if (canAccess) {
                    const contents = await Content.find({ subjectId, isVisible: true }).select('title description type unit');
                    retrievalContext += `INSTITUTIONAL CONTENT [Subject: ${subject.title}]:\n`;
                    retrievalContext += `Description: ${subject.description}\n`;
                    if (contents.length > 0) {
                        retrievalContext += `MATERIALS:\n${contents.map(c => `- [${c.unit}] ${c.title} (${c.type}): ${c.description}`).join('\n')}\n`;
                    }
                }
            }
        }

        // 3. Prompt Assembly (Role-Aware)
        const rolePrompt = PROMPTS[user.role] || PROMPTS.student;
        
        const systemPrompt = `
        ${rolePrompt}
        
        INSTITUTIONAL CONTEXT:
        ${retrievalContext || "No specific course context provided. Answer based on general academic principles but state that you are using general knowledge."}

        USER QUESTION: ${question}
        
        INSTRUCTIONS:
        - If the context contains the answer, prioritize it.
        - Detect if the user wants to generate a quiz or assessment. 
        - If they do, at the end of your response, add the tag [INTENT: GENERATE_QUIZ].
        `;

        // 4. LLM Generation
        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(systemPrompt);
        const response = await result.response;
        const text = response.text ? response.text() : "I'm sorry, I couldn't generate a response.";

        // 5. Intent Detection & Action Triggering
        let suggestedAction = null;
        if (text.includes('[INTENT: GENERATE_QUIZ]')) {
            suggestedAction = 'GENERATE_QUIZ';
        }

        res.json({ 
            answer: text.replace('[INTENT: GENERATE_QUIZ]', '').trim(), 
            source: "Averqon AI Kernel",
            suggestedAction,
            contextUsed: !!retrievalContext
        });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI Service temporarily unavailable." });
    }
};

const generateQuiz = async (req, res) => {
    try {
        const { subjectId, topic } = req.body;
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let context = "";
        if (subjectId) {
            const contents = await Content.find({ subjectId }).limit(5);
            context = contents.map(c => c.description).join("\n");
        }

        const prompt = `
        Generate 3 multiple choice questions based on this context/topic: "${topic || "Syllabus"}".
        Context: ${context}
        
        Return ONLY a JSON array in this format:
        [
          { "question": "...", "options": ["...", "...", "...", "..."], "correct": 0 }
        ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON
        const jsonMatch = text.match(/\[.*\]/s);
        const mcqs = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        res.json(mcqs);
    } catch (error) {
        console.error("Quiz Gen Error:", error);
        res.status(500).json([]);
    }
};

module.exports = { askAI, generateQuiz };
