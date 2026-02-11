# 🚀 FitFlow Companion - Complete Deployment Guide

## Overview

This guide covers deploying both the frontend (React + Vite) and backend (Express + Gemini) of the FitFlow Companion app.

---

## 📋 Pre-Deployment Checklist

### Security
- [ ] All `.env` files in `.gitignore`
- [ ] No API keys in code
- [ ] HTTPS configured for production
- [ ] CORS restricted to your domain
- [ ] Environment variables set on hosting platform

### Testing
- [ ] All features tested locally
- [ ] Backend health endpoint responds
- [ ] AI Coach chat works
- [ ] Gamification features work
- [ ] Social features work
- [ ] Mobile responsive

### Performance
- [ ] Frontend built with `npm run build`
- [ ] Images optimized
- [ ] API response times acceptable
- [ ] Loading states implemented

---

## 🎯 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
**Best for**: Easy deployment, automatic HTTPS, good free tier

### Option 2: Netlify (Frontend) + Render (Backend)
**Best for**: Similar to Vercel, alternative option

### Option 3: Single Server (VPS)
**Best for**: Full control, all-in-one hosting

---

## 🔷 Option 1: Vercel + Railway

### Backend Deployment (Railway)

1. **Sign up at Railway.app**
   ```
   https://railway.app
   ```

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js

3. **Configure Environment Variables**
   - Go to project settings
   - Click "Variables"
   - Add:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     PORT=3001
     ```

4. **Deploy**
   - Railway automatically deploys
   - Note your backend URL: `https://your-app.railway.app`

5. **Verify**
   ```bash
   curl https://your-app.railway.app/api/health
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Configure Environment**
   Create `.env.production`:
   ```env
   VITE_API_URL=https://your-app.railway.app
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

5. **Set Environment Variables in Vercel Dashboard**
   - Go to project settings
   - Environment Variables
   - Add `VITE_API_URL`

6. **Verify**
   Visit your Vercel URL and test AI Coach

---

## 🔶 Option 2: Netlify + Render

### Backend Deployment (Render)

1. **Sign up at Render.com**
   ```
   https://render.com
   ```

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   ```
   GEMINI_API_KEY=your_api_key
   PORT=3001
   ```

4. **Deploy**
   - Render auto-deploys on git push
   - Note URL: `https://your-app.onrender.com`

### Frontend Deployment (Netlify)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Create `netlify.toml`**
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

5. **Environment Variables**
   - Netlify dashboard → Site settings → Environment variables
   - Add `VITE_API_URL`

---

## 🖥️ Option 3: VPS (Digital Ocean / AWS / Linode)

### Server Setup

1. **Create Ubuntu 22.04 Server**

2. **SSH into server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2**
   ```bash
   npm install -g pm2
   ```

5. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/fitflow-companion.git
   cd fitflow-companion
   ```

### Backend Setup

1. **Configure Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   nano .env  # Add your GEMINI_API_KEY
   ```

2. **Start with PM2**
   ```bash
   pm2 start index.js --name fitflow-backend
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/fitflow
   ```

   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/fitflow /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Setup SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Frontend Setup

1. **Build Frontend**
   ```bash
   cd /path/to/fitflow-companion
   nano .env.production  # Set VITE_API_URL
   npm run build
   ```

2. **Configure Nginx for Frontend**
   ```bash
   sudo nano /etc/nginx/sites-available/fitflow-frontend
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /path/to/fitflow-companion/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Enable and Restart**
   ```bash
   sudo ln -s /etc/nginx/sites-available/fitflow-frontend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## 🔒 Production Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_production_api_key
PORT=3001
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com
```

---

## 🧪 Post-Deployment Testing

1. **Health Check**
   ```bash
   curl https://api.yourdomain.com/api/health
   ```

2. **AI Coach Test**
   ```bash
   curl -X POST https://api.yourdomain.com/api/ai/coach \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello coach!"}'
   ```

3. **Frontend Test**
   - Visit https://yourdomain.com
   - Test all navigation
   - Complete a workout
   - Chat with AI Coach
   - Check leaderboard
   - Add friends

---

## 📊 Monitoring

### Backend Monitoring
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs fitflow-backend

# Restart
pm2 restart fitflow-backend
```

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g railway
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🚨 Troubleshooting

### Issue: CORS errors in production
**Solution**: Update CORS config in `server/index.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Issue: Environment variables not loading
**Solution**: 
- Verify `.env` file exists in production
- Check hosting platform environment variable settings
- Restart server after changes

### Issue: Build fails
**Solution**:
- Check Node.js version (use v18+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors

---

## 📈 Scaling

### As your app grows:

1. **Database**: Add PostgreSQL/MongoDB for persistence
2. **Caching**: Implement Redis for API responses
3. **CDN**: Use Cloudflare for static assets
4. **Load Balancer**: Add for multiple backend instances
5. **Queue System**: Use BullMQ for background jobs

---

## ✅ Production Checklist

- [ ] HTTPS enabled
- [ ] Environment variables configured
- [ ] CORS properly restricted
- [ ] Error logging setup
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Domain configured
- [ ] SSL certificates valid
- [ ] All features tested in production
- [ ] Documentation updated

---

## 🎉 You're Live!

Your FitFlow Companion app is now deployed and ready to help users achieve their fitness goals! 🏋️‍♀️🚀

For support, check:
- `AI_COACH_SETUP.md` - Setup guide
- `AI_COACH_README.md` - Feature documentation
- Hosting provider documentation
