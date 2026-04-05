# 🚀 Deployment Guide - Smart Product Pricing

## Table of Contents
1. [Quick Deploy (Vercel)](#quick-deploy---vercel)
2. [Deploy to Netlify](#deploy-to-netlify)
3. [Deploy to GitHub Pages](#deploy-to-github-pages)
4. [Deploy to Your Own Server](#deploy-to-your-own-server)
5. [Backend Deployment](#backend-deployment)
6. [Post-Deployment Checks](#post-deployment-checks)

---

## Quick Deploy - Vercel

**Easiest option. Takes 5 minutes.**

### Prerequisites
- GitHub account (or sign up for Vercel)
- Project pushed to GitHub

### Step 1: Connect to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend folder
cd frontend
vercel
```

### Step 2: Configure Environment
When Vercel asks:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add backend URL

```
VITE_API_URL=http://your-backend-url.com:5000
```

### Step 3: Done! ✅
Vercel will:
- Build your app automatically
- Deploy to global CDN
- Provide free HTTPS
- Auto-update on git push

### Vercel Dashboard
- Monitor performance
- View analytics
- Rollback versions
- Configure domains

---

## Deploy to Netlify

**Alternative option. Takes 5-10 minutes.**

### Step 1: Prepare Your Site
```bash
# In frontend folder, ensure build is ready
npm run build
# Creates /dist folder
```

### Step 2: Deploy
**Option A: Drag & Drop**
1. Go to https://netlify.com
2. Login with GitHub
3. Drag `/dist` folder onto Netlify
4. Done!

**Option B: Connect Git**
1. https://netlify.app/drop
2. Click "Connect to Git"
3. Select your GitHub repo
4. Netlify auto-deploys on every push

### Step 3: Configure
Netlify > Site Settings > Build & Deploy

```
Build command: npm run build
Publish directory: dist
```

### Environment Variables
Netlify > Site Settings > Environment

```
VITE_API_URL=http://your-backend-url.com:5000
```

---

## Deploy to GitHub Pages

**Free option. Takes 10 minutes.**

### Requirement
- Your repo must be public

### Step 1: Update vite.config.js
```javascript
export default defineConfig({
  base: '/your-repo-name/',  // Add this line
  // ... rest of config
})
```

### Step 2: Add Deploy Script
Update `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Step 3: Install gh-pages
```bash
npm install -D gh-pages
```

### Step 4: Configure GitHub
1. GitHub > Settings > Pages
2. Select "Deploy from a branch"
3. Branch: `gh-pages`
4. Directory: `/ (root)`

### Step 5: Deploy
```bash
npm run deploy
```

Your site will be at: `https://yourusername.github.io/your-repo-name/`

---

## Deploy to Your Own Server

**For full control. Takes 15-20 minutes.**

### Option A: Apache Web Server

```bash
# 1. Build the app
npm run build

# 2. Upload /dist folder to server
scp -r dist/* user@your-server.com:/var/www/html/

# 3. Configure Apache (.htaccess)
cat > .htaccess << EOF
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF
```

### Option B: Nginx Web Server

```bash
# 1. Build the app
npm run build

# 2. Copy to server
scp -r dist/* user@your-server.com:/usr/share/nginx/html/

# 3. Configure Nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri /index.html;
    }
}
```

### Option C: Node.js Express

```bash
# 1. Build
npm run build

# 2. Create simple Express server
cat > server-prod.js << EOF
const express = require('express');
const app = express();

app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(3000, () => console.log('Server on port 3000'));
EOF

# 3. Deploy and run
npm install express
node server-prod.js
```

---

## Backend Deployment

### Your Backend is Running Locally

You need to deploy it first!

### Option 1: Deploy Backend to Heroku

```bash
cd backend

# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Push code
git push heroku main

# 5. Backend will be at: https://your-app-name.herokuapp.com
```

### Option 2: Deploy Backend to Railway.app

```bash
# Similar to Heroku, easier setup
# Visit https://railway.app
# Connect GitHub repo
# Auto-deploys on git push
```

### Option 3: Deploy to Your VPS/Server

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Clone repo
git clone https://github.com/your-username/smartProductPricing.git
cd smartProductPricing/backend

# 3. Install & run
npm install
npm start

# 4. Use PM2 for persistent running
npm install -g pm2
pm2 start server.js
pm2 save
```

---

## Frontend-Backend Connection

### For Local Development
```javascript
// src/App.jsx
axios.get("http://localhost:5000/products")
```

### For Production
```javascript
// Create environment variables
// .env.production
VITE_API_URL=https://your-backend-url.com

// src/App.jsx
axios.get(import.meta.env.VITE_API_URL + "/products")
```

---

## Post-Deployment Checks

### ✅ Test Your Live Site

1. **Open website**: Visit your deployed URL
2. **Check Console**: Open DevTools > Console
   - No errors?
   - API calls successful?
3. **Test Features**:
   - Can you see products loading?
   - Does search work?
   - Does filtering work?
   - Can you click product details?
4. **Check Network**: DevTools > Network tab
   - All chunks load?
   - API calls connect to backend?
   - CSS/JS files small?
5. **Test Mobile**: Use mobile device or DevTools > Toggle device toolbar
   - Is layout responsive?
   - Are buttons clickable?
   - Does it load fast?

### Lighthouse Audit

```
Chrome DevTools > Lighthouse > Mobile
- Performance: Should be 90+
- Accessibility: Should be 90+
- Best Practices: Should be 90+
- SEO: Should be 90+
```

### Browser Compatibility
Test on:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile Safari/Chrome

---

## Monitoring & Maintenance

### Set Up Monitoring

**Vercel/Netlify**: Built-in analytics
- Visit dashboard
- Monitor requests, errors, performance

**Custom Monitoring**:
```javascript
// Add to App.jsx
import { lazy } from 'react';

// Log page load time
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log(`Page took ${pageLoadTime}ms to load`);
  // Send to analytics service
});
```

### Update Frequently
```bash
# Keep dependencies updated
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

---

## Troubleshooting

### Issue: 404 errors after deployment

**Solution**: Ensure routing is configured
- Apache: Add .htaccess file
- Nginx: Configure try_files
- Express: use `res.sendFile('dist/index.html')`

### Issue: API calls fail on production

**Solution**: Update API URL in environment variables
```
VITE_API_URL=https://your-backend-url.com
```

### Issue: Slow performance

**Solution**: 
- Check bundle size: `npm run build`
- Verify gzip is enabled on server
- Use a CDN (Vercel/Netlify do this automatically)

### Issue: Build fails

**Solution**:
- Check Node version: `node -v` (should be > 14)
- Clear cache: `rm -r node_modules && npm install`
- Check for errors: `npm run build`

---

## Summary

| Platform | Ease | Cost | Performance | Time |
|----------|------|------|-------------|------|
| **Vercel** | ⭐⭐⭐⭐⭐ | Free | Excellent | 5 min |
| **Netlify** | ⭐⭐⭐⭐⭐ | Free | Excellent | 5 min |
| **GitHub Pages** | ⭐⭐⭐⭐ | Free | Good | 10 min |
| **Your VPS** | ⭐⭐⭐ | Paid | Good | 20 min |

**Recommendation**: Start with **Vercel** (easiest, best performance)

---

## Next Steps

1. ✅ Check that /dist folder exists
2. ✅ Choose deployment platform (Vercel recommended)
3. ✅ Deploy frontend
4. ✅ Deploy backend (Heroku/Railway)
5. ✅ Configure API URLs
6. ✅ Test live site thoroughly
7. ✅ Set up monitoring/analytics

**Your app is ready to go live!** 🚀
