import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT = `You are a professional fitness coach named "FitFlow Coach".
Give safe, positive, motivating advice.
Do not give medical diagnosis.
Keep responses under 150 words.
Use friendly tone with emojis.
Focus on motivation, workout suggestions, and healthy habits.
If user mentions pain, injury, or illness, advise them to consult a professional trainer or doctor.
Be supportive and non-judgmental.

IMPORTANT: When the user asks about a specific exercise or workout, ALWAYS include:
1. A brief description of how to perform it
2. A YouTube search link in this format: https://www.youtube.com/results?search_query=how+to+do+EXERCISE+NAME+form
3. Optionally a link to ExRx.net or similar for the exercise

Example format for exercise links:
📺 Watch how to do it: https://www.youtube.com/results?search_query=how+to+do+squats+proper+form
📖 Detailed guide: https://exrx.net/WeightExercises/Quadriceps/BBSquat

Always replace spaces with + in YouTube search URLs. Include these links whenever discussing specific exercises.`;

const SAFETY_KEYWORDS = ['pain', 'injury', 'hurt', 'illness', 'sick', 'injured', 'doctor', 'hospital'];

const hasSafetyConcern = (message) => {
  const lowerMessage = message.toLowerCase();
  return SAFETY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

app.post('/api/ai/coach', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid message format',
        reply: "I didn't quite catch that. Can you rephrase your question? 💪"
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not configured');
      return res.status(500).json({ 
        error: 'API key not configured',
        reply: "Coach is resting. Try again soon 💪"
      });
    }

    if (hasSafetyConcern(message)) {
      return res.json({
        reply: "I'm concerned about what you mentioned. Please consult a professional trainer or doctor for personalized medical advice. Your health and safety are the priority! 🏥",
        isSafetyWarning: true
      });
    }

    const recentHistory = history.slice(-3);
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'openrouter/free',
      messages,
      temperature: 0.9,
      max_tokens: 400,
    });

    let reply = completion.choices[0]?.message?.content || "I'm here to help! Ask me anything about fitness 💪";

    if (reply.length > 600) {
      reply = reply.substring(0, 597) + '...';
    }

    console.log(`AI Coach request processed: ${message.substring(0, 50)}...`);

    res.json({ 
      reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Coach error:', error.message);
    
    if (error.message?.includes('API key') || error.code === 'invalid_api_key') {
      return res.status(500).json({ 
        error: 'Configuration error',
        reply: "Invalid API key. Please check your OPENROUTER_API_KEY in server/.env 🔑"
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit') || error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit',
        reply: "Rate limit reached. Please wait a moment and try again ⏳"
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      reply: "Coach is resting. Try again soon 💪"
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    apiConfigured: !!process.env.OPENROUTER_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`🏋️ FitFlow AI Coach Server running on port ${PORT}`);
  console.log(`🤖 AI API: ${process.env.OPENROUTER_API_KEY ? '✅ Configured (OpenRouter)' : '❌ Not configured'}`);
});

export default app;
