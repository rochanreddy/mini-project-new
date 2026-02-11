import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for the AI fitness coach
const SYSTEM_PROMPT = `You are a professional fitness coach named "FitFlow Coach".
Give safe, positive, motivating advice.
Do not give medical diagnosis.
Keep responses under 80 words.
Use friendly tone with emojis.
Focus on motivation, workout suggestions, and healthy habits.
If user mentions pain, injury, or illness, advise them to consult a professional trainer or doctor.
Be supportive and non-judgmental.`;

// Safety keywords that require special handling
const SAFETY_KEYWORDS = ['pain', 'injury', 'hurt', 'illness', 'sick', 'injured', 'doctor', 'hospital'];

// Check if message contains safety concerns
const hasSafetyConcern = (message) => {
  const lowerMessage = message.toLowerCase();
  return SAFETY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

// AI Coach endpoint
app.post('/api/ai/coach', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid message format',
        reply: "I didn't quite catch that. Can you rephrase your question? 💪"
      });
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ 
        error: 'API key not configured',
        reply: "Coach is resting. Try again soon 💪"
      });
    }

    // Safety check
    if (hasSafetyConcern(message)) {
      return res.json({
        reply: "I'm concerned about what you mentioned. Please consult a professional trainer or doctor for personalized medical advice. Your health and safety are the priority! 🏥",
        isSafetyWarning: true
      });
    }

    // Prepare conversation context (last 3 messages for efficiency)
    const recentHistory = history.slice(-3);
    let contextPrompt = SYSTEM_PROMPT + '\n\n';
    
    if (recentHistory.length > 0) {
      contextPrompt += 'Recent conversation:\n';
      recentHistory.forEach(msg => {
        contextPrompt += `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}\n`;
      });
    }
    
    contextPrompt += `\nUser: ${message}\nCoach:`;

    // Call Gemini API (using stable model name)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 200,
      }
    });
    
    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    let reply = response.text();

    // Ensure response isn't too long
    if (reply.length > 300) {
      reply = reply.substring(0, 297) + '...';
    }

    // Log for monitoring (without sensitive data)
    console.log(`AI Coach request processed: ${message.substring(0, 50)}...`);

    res.json({ 
      reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Coach error:', error.message);
    
    // Handle specific error cases
    if (error.message?.includes('API key')) {
      return res.status(500).json({ 
        error: 'Configuration error',
        reply: "Coach is resting. Try again soon 💪"
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'Rate limit',
        reply: "I'm a bit overwhelmed right now. Give me a moment and try again! 😅"
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      reply: "Coach is resting. Try again soon 💪"
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Start server 
app.listen(PORT, () => {
  console.log(`🏋️ FitFlow AI Coach Server running on port ${PORT}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
});

export default app;
