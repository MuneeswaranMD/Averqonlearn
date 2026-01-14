require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('Averqon Learn API Running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/colleges', require('./routes/collegeRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));

// AI Route (Existing)
app.post('/api/ai/ask', async (req, res) => {
  const { userId, courseId, lessonId, question, context } = req.body;
  try {
    const lessonContext = context?.notes || "General React Context";
    const mockAnswer = `(AI Simulated Response) 
    Hey there! Great question about ${question}. 
    Based on the lesson "${lessonId}", here is the explanation...`;
    res.json({ answer: mockAnswer });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Error Handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
