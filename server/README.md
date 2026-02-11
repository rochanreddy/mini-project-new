# FitFlow AI Coach Backend Server

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_key_here

# Start the server
npm run dev
```

## Endpoints

### POST /api/ai/coach
AI fitness coach chat endpoint

**Request:**
```json
{
  "message": "What workout should I do?",
  "history": [],
  "userContext": "Level: 15, Workouts: 42"
}
```

**Response:**
```json
{
  "reply": "Based on your level...",
  "timestamp": "2026-02-10T..."
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T...",
  "geminiConfigured": true
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |
| `PORT` | No | Server port (default: 3001) |

## Security

- All API keys must be in `.env` file
- Never commit `.env` to version control
- CORS enabled for frontend access
- Input validation on all endpoints
- Safety keyword filtering

## Getting Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the key (starts with `AIzaSy...`)
5. Add to `server/.env`

## Dependencies

- `express` - Web server
- `@google/generative-ai` - Gemini SDK
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

## Development

```bash
# Install with nodemon for auto-restart
npm install

# Run with auto-reload
npm run dev

# Production
npm start
```

## Troubleshooting

**"GEMINI_API_KEY not configured"**
- Create `server/.env` file
- Add `GEMINI_API_KEY=your_key`
- Restart server

**Port already in use**
- Change PORT in `.env`
- Or kill process: `lsof -ti:3001 | xargs kill`

**CORS errors**
- Verify CORS is enabled
- Check frontend URL in CORS config
