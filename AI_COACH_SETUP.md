# 🤖 AI Fitness Coach Setup Guide

## Overview

The AI Fitness Coach is powered by **Google Gemini API** and provides personalized workout suggestions, motivation, and health guidance through an intelligent chat interface.

---

## 🔐 Security Architecture

### ✅ Secure Implementation
- **Backend-Only API Calls**: All Gemini API calls go through Express backend
- **Environment Variables**: API keys stored in `.env` file (never in code)
- **CORS Protection**: Backend validates requests
- **Git Ignored**: `.env` files are excluded from version control

### ❌ What We DON'T Do
- ❌ Store API keys in frontend code
- ❌ Expose keys in client-side JavaScript
- ❌ Commit API keys to GitHub
- ❌ Hardcode sensitive credentials

---

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** (comes with Node.js)
3. **Google Gemini API Key** (free tier available)

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy your API key (looks like: `AIzaSyC...`)

**Important**: Keep this key secret! Never share it publicly.

### Step 2: Install Backend Dependencies

```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install
```

Dependencies installed:
- `express` - Web server framework
- `@google/generative-ai` - Official Gemini SDK
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Step 3: Configure Environment Variables

1. In the `server` folder, create a `.env` file:

```bash
# Copy the example file
cp .env.example .env
```

2. Open `.env` and add your API key:

```env
# FitFlow AI Coach Server Configuration

# Your Gemini API key from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE

# Server port (default: 3001)
PORT=3001
```

3. Replace `YOUR_ACTUAL_API_KEY_HERE` with your actual Gemini API key

### Step 4: Start the Backend Server

```bash
# From the server folder
npm run dev
```

You should see:
```
🏋️ FitFlow AI Coach Server running on port 3001
🤖 Gemini API: ✅ Configured
```

### Step 5: Configure Frontend

1. In the **root** project folder, create a `.env` file:

```env
# Frontend Configuration

# Backend API URL
VITE_API_URL=http://localhost:3001
```

2. Start the frontend development server:

```bash
# From the root folder
npm run dev
```

### Step 6: Test the AI Coach

1. Open your browser to `http://localhost:8080`
2. Navigate to **AI Coach** in the sidebar
3. Try asking: "What workout should I do today?"
4. The AI should respond within 2-3 seconds

---

## 🧪 Testing the Setup

### Health Check Endpoint

Test if the backend is running:

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T...",
  "geminiConfigured": true
}
```

### Test AI Coach

```bash
curl -X POST http://localhost:3001/api/ai/coach \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello coach!"}'
```

Expected response:
```json
{
  "reply": "Hey there! 👋 Ready to crush some goals today?",
  "timestamp": "2026-02-10T..."
}
```

---

## 📁 File Structure

```
fitflow-companion/
├── server/                    # Backend server
│   ├── index.js              # Express server + Gemini integration
│   ├── package.json          # Backend dependencies
│   ├── .env                  # ⚠️ Secret keys (git ignored)
│   └── .env.example          # Example configuration
│
├── src/
│   ├── pages/
│   │   └── AICoach.tsx       # Main chat interface
│   ├── components/ai/
│   │   ├── ChatMessage.tsx   # Message bubble component
│   │   ├── ChatInput.tsx     # Input with send button
│   │   └── TypingIndicator.tsx  # Loading animation
│   └── App.tsx               # Route configuration
│
├── .env                      # Frontend config (git ignored)
└── AI_COACH_SETUP.md        # This file
```

---

## 🎯 Features Implemented

### ✅ AI Capabilities
- Workout suggestions based on user level and history
- Personalized motivation messages
- Health and fitness tips
- Rest and recovery recommendations
- Overtraining warnings
- Safety filters for medical concerns

### ✅ Chat Features
- Real-time messaging with Gemini
- Context awareness (remembers last 3 messages)
- Auto-scroll to latest message
- Typing indicator while AI responds
- Suggested quick prompts
- Chat history persistence (localStorage)
- Clear chat functionality

### ✅ Security Features
- All API calls through secure backend
- Environment variable protection
- Safety keyword detection
- Error handling and retry logic
- Rate limiting awareness

### ✅ UI Features
- Beautiful gradient-themed interface
- Responsive mobile design
- User messages on right (blue)
- AI messages on left (gray)
- Safety warnings in amber
- Loading states and error messages

---

## 🧠 System Prompt

The AI coach uses this system prompt:

```
You are a professional fitness coach named "FitFlow Coach".
Give safe, positive, motivating advice.
Do not give medical diagnosis.
Keep responses under 80 words.
Use friendly tone with emojis.
Focus on motivation, workout suggestions, and healthy habits.
If user mentions pain, injury, or illness, advise them to consult a professional trainer or doctor.
Be supportive and non-judgmental.
```

---

## 🚨 Safety Features

### Automatic Safety Checks

The system detects keywords like:
- pain, injury, hurt
- illness, sick, injured
- doctor, hospital

When detected, the AI responds:
> "I'm concerned about what you mentioned. Please consult a professional trainer or doctor for personalized medical advice. Your health and safety are the priority! 🏥"

### Context Awareness

The AI receives user context:
- Current level
- Total workouts completed
- Current streak
- Last 3 messages in conversation

This allows personalized responses like:
- "Great job on your 7-day streak! 🔥"
- "Since you're level 15, try intermediate workouts"

---

## ⚡ Performance Optimizations

1. **Context Limiting**: Only last 3 messages sent to API
2. **Response Caching**: Chat history stored in localStorage
3. **Error Retry**: Automatic retry on network failures
4. **Loading States**: User feedback during API calls
5. **Auto-scroll**: Smooth scrolling to new messages

---

## 🐛 Troubleshooting

### Problem: "Coach is resting. Try again soon 💪"

**Causes**:
1. Backend server not running
2. Invalid API key
3. Network connection issues

**Solutions**:
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# Restart backend server
cd server
npm run dev

# Verify .env file exists and has correct API key
cat server/.env
```

### Problem: "API key not configured"

**Solution**:
1. Check `server/.env` file exists
2. Verify `GEMINI_API_KEY=` has your actual key
3. Restart the backend server

### Problem: Rate limit errors

**Cause**: Too many requests to Gemini API

**Solution**:
- Wait a few minutes
- Gemini free tier has daily limits
- Consider upgrading to paid tier for higher limits

### Problem: CORS errors

**Cause**: Frontend can't connect to backend

**Solution**:
1. Verify backend is running on port 3001
2. Check `VITE_API_URL` in frontend `.env`
3. Ensure CORS is enabled in `server/index.js`

---

## 📊 API Usage & Costs

### Free Tier Limits (Gemini API)
- **60 requests per minute**
- **1,500 requests per day**
- Perfect for testing and small projects

### Paid Tier
- Higher rate limits
- Priority support
- See [Google AI Pricing](https://ai.google.dev/pricing)

### Current Usage
Each chat message = 1 API request

**Typical daily usage**:
- 10 users × 20 messages/day = 200 requests
- Well within free tier limits ✅

---

## 🔮 Future Enhancements

Ready for expansion:
- [ ] Voice chat integration
- [ ] Image analysis (form check)
- [ ] Workout plan generation
- [ ] Nutrition advice
- [ ] Integration with fitness trackers
- [ ] Multi-language support
- [ ] Conversation export
- [ ] Admin dashboard for monitoring

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] `.env` files in `.gitignore`
- [ ] No API keys in frontend code
- [ ] HTTPS enabled for production
- [ ] CORS restricted to your domain
- [ ] Rate limiting implemented
- [ ] Input validation and sanitization
- [ ] Error messages don't expose sensitive info
- [ ] API key rotation policy in place

---

## 📝 Environment Variables Reference

### Backend (`server/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | - | Your Google Gemini API key |
| `PORT` | ❌ No | 3001 | Backend server port |

### Frontend (`.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ❌ No | http://localhost:3001 | Backend API URL |

---

## 🎉 Quick Start Checklist

- [ ] Get Gemini API key from Google AI Studio
- [ ] Create `server/.env` with your API key
- [ ] Install backend dependencies: `cd server && npm install`
- [ ] Start backend: `npm run dev`
- [ ] Create frontend `.env` with API URL
- [ ] Start frontend: `npm run dev`
- [ ] Navigate to AI Coach page
- [ ] Test with "Hello coach!"

---

## 📞 Support

**Issues?**
- Check troubleshooting section above
- Review console logs in browser (F12)
- Check backend terminal for errors

**API Key Help**:
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

## ✨ Success!

You should now have a fully functional AI Fitness Coach! 

The coach will:
- Suggest personalized workouts
- Provide motivation and encouragement
- Give health and fitness tips
- Warn about overtraining
- Remember conversation context
- Prioritize user safety

**Try asking:**
- "What workout should I do today?"
- "How can I stay motivated?"
- "Tips for building consistency?"
- "I'm feeling tired, should I rest?"

Enjoy your AI-powered fitness journey! 💪🤖
