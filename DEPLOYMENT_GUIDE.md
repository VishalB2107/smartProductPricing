# 🚀 Deployment Guide - Smart Product Pricing

> **Last Updated**: April 2026  
> **Recommended Platform**: Vercel (easiest, fastest)  
> **Typical Deployment Time**: 15-20 minutes

## 📋 Quick Navigation
- [Prerequisites](#prerequisites)
- [Deployment Checklist](#deployment-checklist)
- [Option 1: Vercel (Recommended)](#option-1-vercel-recommended) ⭐
- [Option 2: Netlify](#option-2-netlify)
- [Option 3: GitHub Pages](#option-3-github-pages)
- [Option 4: Custom Server](#option-4-custom-server)
- [Backend Deployment](#backend-deployment)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting deployment, ensure you have:

- [ ] **GitHub Account** - Sign up at [github.com](https://github.com)
- [ ] **Git installed** - Check with `git --version`
- [ ] **Node.js installed** - Check with `node -v` (should be 14.0+)
- [ ] **Project files ready** - You should have this folder and all its contents
- [ ] **CSV files in root** - `sample_test.csv` and `sample_test_out.csv` present
- [ ] **Initial commit made** - Code should be committed to git

> 💡 **Tip**: Run `npm run build` in the frontend folder first to ensure there are no build errors before deploying.

---

## 🎯 Deployment Checklist

Use this checklist to track your progress through the deployment process:

- [ ] **Step 1**: Create GitHub account & repository
- [ ] **Step 2**: Push code to GitHub
- [ ] **Step 3**: Create deployment account (Vercel/Netlify/other)
- [ ] **Step 4**: Connect repository & deploy
- [ ] **Step 5**: Verify deployment works
- [ ] **Step 6**: Test all features on live site
- [ ] **Step 7**: Optional - Deploy backend
- [ ] **Step 8**: Set up monitoring (optional)

---

## Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- ✅ Easiest setup (5 minutes)
- ✅ Best performance (global CDN)
- ✅ Free tier is generous
- ✅ Auto-deploys on git push
- ✅ Built-in analytics
- ✅ Works great with Vite

### Step 1A: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **New Repository** (or use the + menu)
3. Name it: `smart-product-pricing`
4. Optional: Add description "AI-powered product price finder"
5. Choose **Public** (required for free Vercel)
6. Skip initializing readme (we already have files)
7. Click **Create Repository**

### Step 1B: Push Your Code to GitHub

Open PowerShell in your project folder and run these commands:

```powershell
# Navigate to your project
cd "C:\Users\Vishal B\Documents\smartProductPricing"

# Configure git with your info
git config user.name "Your Name"
git config user.email "your.email@github.com"

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/smart-product-pricing.git

# Rename default branch to main
git branch -M main

# Push your code
git push -u origin main
```

**What to replace:**
- `YOUR_USERNAME` → Your GitHub username
- `Your Name` → Your actual name
- `your.email@github.com` → Your email

✅ **Success**: Go to github.com/YOUR_USERNAME/smart-product-pricing and see your code

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** (top right)
3. Click **Continue with GitHub** (recommended)
4. Click **Authorize** when GitHub asks
5. Complete account setup (enter name, company optional)

✅ **Success**: You're logged into Vercel dashboard

### Step 3: Deploy on Vercel

**Method A: Via Dashboard (Recommended)**

1. Click **Add New** → **Project** in Vercel dashboard
2. See list of your GitHub repos
3. Click **Import** next to `smart-product-pricing`
4. **Framework Preset**: Select "Other" or "Vite"
5. **Build Command**: Keep as is (or use `cd frontend && npm run build`)
6. **Output Directory**: `frontend/dist` or `dist`
7. **Install Command**: Keep default
8. Click **Deploy** button

**Method B: Via CLI**

```powershell
# Install Vercel CLI (first time only)
npm install -g vercel

# From project root
cd "C:\Users\Vishal B\Documents\smartProductPricing"

# Deploy
vercel

# Follow prompts, select your project
``

### Step 4: Verify Deployment

After a few seconds, you'll see:
- ✅ **Deployment Status**: "Success" (green checkmark)
- ✅ **Production URL**: Like `https://smart-product-pricing-username.vercel.app`
- ✅ **Visit URL**: Click it to see your live site!

Vercel will also show:
- Build logs (should have no errors)
- Analytics tab
- Settings tab
- Domains tab

✅ **Success Indicators:**
- Site loads without errors
- See your product finder interface
- Can upload/select product images
- No 404 errors in browser console

---



## Option 2: Netlify

**Alternative option. Still easy (5-10 minutes).**

### Why Netlify?
- ✅ Drag & drop deployment option
- ✅ Great UI
- ✅ Excellent performance
- ✅ Free tier available

### Prerequisites
- Same GitHub setup as Vercel (see Option 1, Steps 1A & 1B)

### Step 1: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Click **Sign Up**
3. Click **GitHub** (recommended)
4. Click **Authorize** when asked
5. Complete setup

### Step 2: Deploy via Repository

1. Click **New site from Git** (in dashboard)
2. Choose **GitHub**
3. Search for `smart-product-pricing`
4. Click it to connect
5. Configure build settings:
   - **Branch**: `main` (default)
   - **Build Command**: `cd frontend && npm run build`
   - **Publish Directory**: `frontend/dist`
6. Click **Deploy Site**

### Step 3: Verify Deployment

- ✅ Status changes to "Published" (green)
- ✅ Random URL like `https://xyz-abc-123.netlify.app`
- ✅ Click **Visit Site** to see your live app

### Environment Variables (if needed)

If you deploy backend later:

1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Click **Edit Variables**
3. Add: `VITE_API_URL=https://your-backend-url.com`
4. Redeploy site

---

## Option 3: GitHub Pages

**Free option. Good for portfolios (10 minutes).**

### Why GitHub Pages?
- ✅ Completely free
- ✅ Hosted on GitHub
- ✅ Good for portfolios
- ✅ No external services needed

### Prerequisites
- [ ] Your repository is **PUBLIC** (required)
- [ ] Code already pushed to GitHub (see Option 1)

### Step 1: Update Vite Config

Edit `frontend/vite.config.js`:

```javascript
export default defineConfig({
  base: '/smart-product-pricing/',  // Add this line
  plugins: [react()],
  // ... rest of config
})
```

Replace `/smart-product-pricing/` with `/your-repo-name/` if different.

### Step 2: Add Deploy Script

Edit `frontend/package.json` and add this script:

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

```powershell
cd frontend
npm install -D gh-pages
```

### Step 4: GitHub Repository Settings

1. Go to your GitHub repository
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `gh-pages` and `/ (root)`
4. Click **Save**

### Step 5: Deploy Your Site

```powershell
cd "C:\Users\Vishal B\Documents\smartProductPricing\frontend"
npm run deploy
```

### Step 6: Access Your Site

After a few minutes, your site will be at:

```
https://YOUR_USERNAME.github.io/smart-product-pricing/
```

✅ **Note**: GitHub Pages doesn't support backend APIs. It's frontend-only.

---

## Option 4: Custom Server

**For full control (15-20 minutes)**

Choose one option below based on your server type.

### Option 4A: Apache Web Server

```bash
# Build the frontend
cd frontend
npm run build

# SSH into server
ssh user@your-server.com

# Copy dist folder to Apache root
scp -r dist/* user@your-server.com:/var/www/html/

# Create .htaccess file on server for routing
cat > /var/www/html/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF

# Restart Apache
systemctl restart apache2
```

### Option 4B: Nginx Web Server

```bash
# Build locally
cd frontend
npm run build

# Copy to server
scp -r dist/* user@your-server.com:/usr/share/nginx/html/

# SSH and configure
ssh user@your-server.com

# Edit Nginx config
sudo nano /etc/nginx/sites-available/default
```

Add this block:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri /index.html;
    }
}
```

Then restart:

```bash
sudo systemctl restart nginx
```

### Option 4C: Node.js/Express on VPS

```bash
# Create production server
cd C:\Users\Vishal B\Documents\smartProductPricing

# Build frontend
cd frontend
npm run build
cd ..

# Create production server file
cat > server-prod.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('frontend/dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

# Upload to your VPS
scp server-prod.js package.json user@your-server.com:~/app/

# On server
ssh user@your-server.com
cd app
npm install express
node server-prod.js
```

---



## Backend Deployment

> **Current Status**: Your backend (`server.js`) is set to local testing. This is optional for deployment.

### Do You Need to Deploy the Backend?

Your current setup:
- ✅ **Frontend** - Runs as static HTML/JavaScript (deploys easily on Vercel/Netlify)
- ✅ **CSV Data** - Included with frontend (no backend needed)
- ✅ **API** - Vercel supports serverless functions (optional)

**You only need to deploy backend if:**
- You want real-time data updates
- You have a database
- You need server-side processing

**If you just want to deploy the current app**: Skip this section, your frontend deployment is complete! ✅

### Option 1: Deploy Backend to Heroku

**Why?** - Easy, free tier available, beginner-friendly

```bash
# Install Heroku CLI (if needed)
npm install -g heroku

# Login to Heroku
heroku login

# Navigate to backend folder
cd backend

# Create new Heroku app
heroku create your-app-name
# Replace your-app-name with something like "smartpricing-api"

# Deploy
git push heroku main

# Get your backend URL
heroku apps:info your-app-name
# Backend will be at: https://your-app-name.herokuapp.com
```

Then update your frontend to use it:

`.env.production` in frontend folder:
```
VITE_API_URL=https://your-app-name.herokuapp.com
```

### Option 2: Deploy Backend to Railway

**Why?** - Modern, easier than Heroku, good free tier

1. Go to [railway.app](https://railway.app)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Select your repo
5. Configure:
   - **Root Directory**: `backend`
   - **Port**: 5000 (default)
6. Click Deploy

You'll get a URL like: `https://backend-production-xyz.railway.app`

### Option 3: Deploy on Custom VPS

This is the `backend/server.js` file. To run it on your server:

```bash
# SSH to your server
ssh user@your-server.com

# Clone repo
git clone https://github.com/YOUR_USERNAME/smart-product-pricing.git
cd smart-product-pricing/backend

# Install dependencies
npm install

# Run the server
npm start
# Or: node server.js

# For persistent running (install PM2)
npm install -g pm2
pm2 start server.js --name "pricing-api"
pm2 save
pm2 startup
```

Restart server if it goes down:
```bash
pm2 monit  # Monitor running apps
pm2 restart pricing-api
```

### Connect Frontend to Backend

Once backend is deployed, update frontend:

In `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.com
```

Then redeploy frontend on Vercel/Netlify.

---

## Post-Deployment Verification

Now that your site is live, verify everything works! ✅

### Step 1: Open Your Live Site

Visit your deployed URL (from Vercel/Netlify):
- Example: `https://smart-product-pricing-username.vercel.app`

### Step 2: Test in Browser

**Check Console for Errors:**
1. Right-click → **Inspect** (or F12)
2. Go to **Console** tab
3. Look for red error messages
4. **Should see**: No errors

**Check Network Tab:**
1. Inspector → **Network** tab
2. Reload page (F5)
3. **Should see**:
   - CSS files loading ✅
   - JavaScript loading ✅
   - Images loading ✅
   - No 404 errors ✅

### Step 3: Test Functionality

- [ ] **Page Loads**: See the product finder UI
- [ ] **Navigation**: Can navigate between pages
- [ ] **Product Search**: Can search/filter products
- [ ] **Upload Image**: Can upload or paste image URL
- [ ] **Price Lookup**: Returns results
- [ ] **Responsive**: Works on phone-sized screens

### Step 4: Test on Mobile

Open URL on your phone or tablet:
- [ ] Layout looks good
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] No horizontal scrolling
- [ ] Images load properly

### Step 5: Performance Check

Run Lighthouse in Chrome DevTools:

1. Open DevTools (F12)
2. Go to **Lighthouse** tab (may be under ">>")
3. Select "Mobile"
4. Click **Analyze page load**

**Target Scores:**
- ✅ Performance: 80+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 90+

### Step 6: Browser Compatibility

Test on multiple browsers:
- [ ] Chrome/Edge (Windows)
- [ ] Firefox (Windows)
- [ ] Safari (if you have Mac)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iPhone)

### Step 7: Check Deployment Dashboard

**If using Vercel:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Check **Deployments** tab - should show successful deployment
4. Check **Logs** tab - should show no errors during build
5. Check **Analytics** - see your visitors

**If using Netlify:**
1. Go to [netlify.com/app](https://netlify.com/app)
2. Click your site
3. Check **Deployments** - should be "Published"
4. Check **Build log** - should show successful build
5. Check **Analytics** - see visitor data

---

## Troubleshooting

### Problem: "Cannot GET /"

**Cause**: Incorrect routing configuration  
**Solution**:
- Vercel/Netlify: Usually handles this automatically
- Custom server: Make sure you have `res.sendFile('dist/index.html')`
- GitHub Pages: Check `base` in `vite.config.js`

### Problem: Blank White Page

**Cause**: Build error or missing files  
**Solution**:
1. Check browser console for JS errors
2. Check deployment dashboard build logs
3. Try `npm run build` locally to find errors
4. Commit and push fixes
5. Redeploy

### Problem: Images Not Loading

**Cause**: Wrong image paths  
**Solution**:
- For Vercel/Netlify: Use absolute paths like `/images/file.jpg`
- For GitHub Pages: Use `/smart-product-pricing/images/file.jpg`
- Check that images exist in `public` folder

### Problem: Too Slow

**Cause**: Large bundle size  
**Solution**:
```bash
# Check what's making bundle big
npm run build
# Look at output sizes

# Install size analyzer (optional)
npm install -D vite-plugin-visualizer
```

Then in `vite.config.js`:
```javascript
import { visualizer } from 'vite-plugin-visualizer';

export default {
  plugins: [
    visualizer()
  ]
}
```

Run build again to see bundle visualization.

### Problem: API Calls Fail (if using backend)

**Cause**: Wrong API URL configuration  
**Solution**:
1. Check `.env.production` has correct backend URL
2. Make sure backend is actually running
3. Check backend's CORS settings if on different domain
4. Redeploy frontend after changing env

### Problem: Deployment Fails

**If Vercel/Netlify build fails:**

1. Check **Build logs** in deployment dashboard
2. Read error message carefully
3. Common causes:
   - Missing dependencies: `npm install` locally, commit changes
   - Node version mismatch: Specify in `package.json` engines field
   - Port conflict: Vercel may use different port
4. Fix locally, commit, push again

### Problem: After Update, Old Version Shows

**Cause**: Browser cache  
**Solution**:
- [ ] Hard refresh: `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- [ ] Or clear browser cache completely
- [ ] Wait 5 minutes for CDN to update

---

## Congratulations! 🎉

Your site is live! Here's what to do next:

### Immediate
- [ ] Share your URL with friends
- [ ] Test thoroughly
- [ ] Report any bugs you find

### Short Term
- [ ] Monitor error logs on deployment dashboard
- [ ] Check performance regularly  
- [ ] Update content as needed
- [ ] Gather user feedback

### Long Term
- [ ] Keep dependencies updated: `npm update`
- [ ] Fix security vulnerabilities: `npm audit fix`
- [ ] Optimize performance based on real user data
- [ ] Consider adding more features

### Setting Up Auto-Updates

When you push new code to GitHub, your site auto-updates! 

```bash
# Make changes locally
# Test with `npm run dev`
# Commit and push
git add .
git commit -m "Fixed bug: ..."
git push origin main

# Vercel/Netlify automatically rebuilds and deploys
# Check dashboard after a few minutes
```

---

## Support & Resources

**Got Stuck?**

1. **Check Console**: Press F12, look for red errors
2. **Read Logs**: Check deployment dashboard build/runtime logs
3. **Common Issues**: See [Troubleshooting](#troubleshooting) section above
4. **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
5. **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)

---

**Happy Deploying! 🚀**


