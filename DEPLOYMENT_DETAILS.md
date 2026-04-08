# 📋 DEPLOYMENT DETAILS - Smart Product Pricing

**Last Updated:** April 8, 2026  
**Project Status:** Ready for Deployment ✅  
**Deployment Platform:** Vercel (Serverless)

---

## 🎯 DEPLOYMENT STATUS SUMMARY

| Component | Status | Location | Public URL |
|-----------|--------|----------|-----------|
| **Frontend** | Ready ✅ | `/frontend/` | `https://smart-product-pricing-[username].vercel.app` |
| **Backend API** | Ready ✅ | `/api/` | `https://smart-product-pricing-[username].vercel.app/api/product-by-image` |
| **Database** | Ready ✅ | `/dataset/` & `/sample_test.csv` | Deployed with project |
| **Git Repository** | Not initialized yet | N/A | Needs to be created |
| **Vercel Project** | Not deployed yet | N/A | Pending deployment |

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────┐
│                    END USER (Browser)                        │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌──────────────────────────────────────────────────────────────┐
│    FRONTEND (React + Vite - Deployed to Vercel Edge)        │
│  Domain: https://smart-product-pricing-[username].vercel.app │
├──────────────────────────────────────────────────────────────┤
│  • React Components (PriceFinder, Dashboard, Navbar)         │
│  • Vite build system - optimized bundle                      │
│  • Uses API endpoint: /api/product-by-image                  │
│  • File: /frontend/src/components/PriceFinder.jsx             │
└────────────────┬──────────────────────────────────────────────┘
                 │ POST/GET via Axios
                 │ JSON Request/Response
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  BACKEND (Serverless API Functions - Vercel Serverless)     │
│  Endpoint: /api/product-by-image                            │
├──────────────────────────────────────────────────────────────┤
│  • Node.js serverless function                              │
│  • File: /api/product-by-image.js                            │
│  • Handles: Image URL matching & file upload                 │
│  • CORS enabled for cross-origin requests                    │
└────────────────┬──────────────────────────────────────────────┘
                 │ File System Read
                 ▼
┌──────────────────────────────────────────────────────────────┐
│            DATA FILES (CSV Database)                         │
│  Location: Root directory (deployed with project)            │
├──────────────────────────────────────────────────────────────┤
│  • sample_test.csv   - Product data (image links)            │
│  • sample_test_out.csv - Price data                          │
│  • dataset/train.csv - Alternative dataset                   │
│  • Limit: 1,000 products (for performance)                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔗 API ENDPOINTS - COMPLETE REFERENCE

### **1. FIND PRODUCT BY IMAGE URL (PRIMARY ENDPOINT)**

**Endpoint Name:** `/api/product-by-image`  
**Method:** `POST`  
**Full URL (Production):** `https://smart-product-pricing-[username].vercel.app/api/product-by-image`  
**Full URL (Local Dev):** `http://localhost:5000/api/product-by-image`

**Request Format:**
```json
{
  "imageUrl": "https://m.media-amazon.com/images/I/41UuQWi9FKL.jpg"
}
```

**Response Format (Success):**
```json
{
  "success": true,
  "found": true,
  "description": "Product description from CSV",
  "price": 29.99,
  "source": "url-match"
}
```

**Response Format (Not Found):**
```json
{
  "success": false,
  "found": false,
  "message": "No product found for the provided image URL"
}
```

**CORS Headers:** ✅ Enabled
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

---

### **2. GET ALL PRODUCTS (SECONDARY ENDPOINT)**

**Endpoint Name:** `/api/products`  
**Method:** `GET`  
**Full URL (Production):** `https://smart-product-pricing-[username].vercel.app/api/products`  
**Full URL (Local Dev):** `http://localhost:5000/api/products`

**Query Parameters:**
- `id` (optional): Get specific product by ID

**Response Format:**
```json
{
  "success": true,
  "total": 1000,
  "products": [
    {
      "id": "1",
      "description": "Product 1",
      "image_link": "https://...",
      "price": 29.99
    },
    // ... more products
  ]
}
```

**Purpose:** Used for dashboard and product listings

---

## 📁 FILE STRUCTURE & CONFIGURATION

### **Root Files (Critical for Deployment)**

```
smartProductPricing/
├── package.json                    ← ⭐ ROOT PACKAGE.JSON (required)
├── vercel.json                     ← ⭐ VERCEL CONFIG (required)
├── sample_test.csv                ← ⭐ PRODUCT DATA (required)
├── sample_test_out.csv            ← Price data (required)
└── .gitignore                      ← Git ignore patterns
```

### **package.json Configuration (Root)**

```json
{
  "name": "smart-product-pricing",
  "version": "1.0.0",
  "description": "Smart Product Pricing - AI-powered product price finder",
  "type": "commonjs",
  "scripts": {
    "build": "cd frontend && npm run build",
    "dev": "concurrently \"cd backend && npm start\" \"cd frontend && npm run dev\"",
    "deploy": "vercel"
  },
  "engines": {
    "node": "20.x"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "csv-parser": "^3.2.0",
    "express": "^5.2.1",
    "express-fileupload": "^1.5.2"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

### **vercel.json Configuration**

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### **Frontend vite.config.js Configuration**

**Key Settings:**
- Port: 3000
- Build Output: `/frontend/dist`
- Proxy Target: `http://localhost:5000` (local dev only)
- API Endpoint: Uses `VITE_API_URL` env var or `/api/product-by-image`

**Proxy Configuration:**
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    rewrite: (path) => path
  }
}
```

---

## ⚡ CRITICAL CONFIGURATION DETAILS

### **Frontend Configuration**

**File:** `/frontend/src/components/PriceFinder.jsx` (Lines 60-80)

```javascript
const apiUrl = import.meta.env.VITE_API_URL || "/api/product-by-image";
console.log("🔍 Making API request to:", apiUrl);

response = await axios.post(
  apiUrl,
  { imageUrl: imageUrl.trim() },
  { headers: { "Content-Type": "application/json" } }
);
```

**Key Points:**
- ✅ Uses environment variable `VITE_API_URL` if available
- ✅ Falls back to `/api/product-by-image` (relative path)
- ✅ In production (Vercel), relative path `/api/...` works automatically
- ✅ CORS is handled by Vercel same-origin requests

---

### **Backend API Configuration**

**File:** `/api/product-by-image.js` (Vercel Serverless Function)

**CORS Headers Added:**
```javascript
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
```

**Data Loading:**
- Reads from `sample_test.csv` in project root
- Limits to 1,000 products for performance
- Matches product by image URL (exact match first, then substring)
- Returns price from `sample_test_out.csv`

---

## 📝 DEPLOYMENT STEPS COMPLETED TO DATE

### **Step 1: Project Structure Setup ✅**
- Created `/api/` directory with serverless functions
- Created `/lib/` directory with shared utilities
- Set up root `package.json` with all dependencies
- Created `vercel.json` configuration file

**Files Created/Modified:**
- ✅ `/api/product-by-image.js` - Main API endpoint
- ✅ `/api/products.js` - Secondary API endpoint
- ✅ `/lib/csv-utils.js` - Shared CSV utilities
- ✅ `vercel.json` - Vercel deployment config
- ✅ `package.json` (root) - Dependencies & scripts

---

### **Step 2: Frontend Configuration ✅**
- Modified `PriceFinder.jsx` to use dynamic API endpoints
- Set up environment variable support (`VITE_API_URL`)
- Added proper error handling and logging
- Configured Vite proxy for local development

**Files Modified:**
- ✅ `/frontend/src/components/PriceFinder.jsx` - API integration
- ✅ `/frontend/vite.config.js` - Proxy configuration
- ✅ `/frontend/package.json` - Scripts configured

**Endpoint Configuration in Frontend:**
```javascript
// Lines 60-61 in PriceFinder.jsx
const apiUrl = import.meta.env.VITE_API_URL || "/api/product-by-image";
```

---

### **Step 3: API Endpoint Setup ✅**
- Created serverless functions following Vercel API structure
- Set up CORS headers for cross-origin requests
- Implemented CSV reading and caching
- Added error handling for various scenarios

**Endpoints Configured:**
- ✅ `POST /api/product-by-image` - Find product by image URL
- ✅ `GET /api/products` - Get all products
- ✅ Both endpoints handle OPTIONS requests for CORS

---

### **Step 4: Data Files Preparation ✅**
- Verified `sample_test.csv` contains product image URLs
- Verified `sample_test_out.csv` contains pricing data
- Confirmed data files are in root directory (required for Vercel to access)

**Data Sources:**
- ✅ `/sample_test.csv` - 1,000 products with image links
- ✅ `/sample_test_out.csv` - Price mapping data
- ✅ `/dataset/train.csv` - Alternative dataset (75,000 products)

---

### **Step 5: Git Repository Setup ⏳ (PENDING)**
- **Status:** Not yet initialized
- **Required:** Push code to GitHub before Vercel deployment

**Commands to Run:**
```powershell
cd "C:\Users\Vishal B\Documents\smartProductPricing"

# Configure git
git config user.name "Your Name"
git config user.email "your.email@github.com"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/smart-product-pricing.git

# Push code
git branch -M main
git push -u origin main
```

---

### **Step 6: Vercel Deployment ⏳ (PENDING)**
- **Status:** Ready but not deployed
- **Platform:** Vercel.com
- **Process:** Connect GitHub repo → Auto-deploy

---

## 🔧 DEPLOYMENT TROUBLESHOOTING GUIDE

### **Issue 1: API Returns 404 – Endpoint Not Found**

**Symptoms:**
- Error: "Cannot POST /api/product-by-image"
- Status: 404 Not Found

**Possible Causes:**
1. ❌ API functions not deployed
2. ❌ Incorrect API endpoint path
3. ❌ Vercel.json configuration missing or incorrect

**Solutions:**
1. ✅ Verify `vercel.json` exists in root directory
2. ✅ Verify `/api/product-by-image.js` exists in `/api/` directory
3. ✅ Check Vercel build logs for errors
4. ✅ Redeploy with `vercel --prod`

**Check Command (Local):**
```bash
vercel dev
# Visit: http://localhost:3000/api/product-by-image
```

---

### **Issue 2: API Returns 500 – Server Error**

**Symptoms:**
- Error: "Internal Server Error"
- Status: 500

**Possible Causes:**
1. ❌ CSV files not found in deployment
2. ❌ Node version mismatch
3. ❌ Missing dependencies in package.json

**Solutions:**
1. ✅ Verify CSV files are in root directory (not in subdirectory)
   - ✅ `sample_test.csv` must be in root
   - ✅ `sample_test_out.csv` must be in root
   - ✅ `dataset/train.csv` can be in dataset folder
2. ✅ Check `package.json` specifies `"engines": { "node": "20.x" }`
3. ✅ Verify all dependencies are installed: `npm install`
4. ✅ Check Vercel build logs for specific errors

**Debug Steps:**
```bash
# 1. Run locally
vercel dev

# 2. Check logs
vercel logs --follow

# 3. Redeploy
vercel --prod
```

---

### **Issue 3: CORS Error – "Access to XMLHttpRequest blocked"**

**Symptoms:**
```
Access to XMLHttpRequest at 'https://...api/product-by-image' 
from origin 'https://...' has been blocked by CORS policy
```

**Possible Causes:**
1. ❌ CORS headers not set in API function
2. ❌ OPTIONS method not handled
3. ❌ Incorrect origin allowed

**Solutions:**
1. ✅ Verify CORS headers in `/api/product-by-image.js`:
   ```javascript
   function setCorsHeaders(res) {
     res.setHeader("Access-Control-Allow-Origin", "*");
     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
   }
   ```
2. ✅ Verify OPTIONS method is handled:
   ```javascript
   if (req.method === "OPTIONS") {
     return res.status(200).end();
   }
   ```
3. ✅ Redeploy API function

---

### **Issue 4: Frontend Gets Wrong API URL**

**Symptoms:**
- Frontend makes request to `http://localhost:5000/api/...` instead of correct production URL
- "Backend server is not responding" error in production

**Possible Causes:**
1. ❌ Environment variables not set correctly
2. ❌ Frontend hardcoded localhost
3. ❌ Vite proxy interfering with production build

**Solutions:**
1. ✅ Verify `PriceFinder.jsx` uses dynamic URL:
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL || "/api/product-by-image";
   ```
2. ✅ Set environment variable in Vercel:
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add: `VITE_API_URL = /api/product-by-image`
3. ✅ Or ensure frontend is deployed to same domain (recommended)

---

### **Issue 5: CSV Files Not Found**

**Symptoms:**
- Error: "ENOENT: no such file or directory, open 'sample_test.csv'"
- API returns: "CSV file not found"

**Possible Causes:**
1. ❌ CSV files not committed to git
2. ❌ CSV files in wrong directory (.gitignore excluded them)
3. ❌ File path incorrect in API function

**Solutions:**
1. ✅ Verify CSV files exist in root directory:
   ```powershell
   ls -Path "C:\Users\Vishal B\Documents\smartProductPricing\sample_test.csv"
   ```
2. ✅ Ensure CSV files are not in `.gitignore`:
   ```bash
   cat .gitignore
   # Should NOT contain sample_test.csv or sample_test_out.csv
   ```
3. ✅ Commit and push CSV files:
   ```bash
   git add sample_test.csv sample_test_out.csv
   git commit -m "Add product data CSV files"
   git push
   ```
4. ✅ Verify file path in API:
   ```javascript
   const sampleTestPath = path.join(process.cwd(), "sample_test.csv");
   ```

---

## 📊 ENVIRONMENT VARIABLES

### **Required Environment Variables**

| Variable | Value | Purpose | Set In |
|----------|-------|---------|--------|
| `NODE_ENV` | `production` | Runtime environment | vercel.json |
| `VITE_API_URL` | `/api/product-by-image` | Frontend API endpoint | Vercel Dashboard (optional) |

### **Setting Environment Variables in Vercel**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings**
4. Go to **Environment Variables**
5. Add variable:
   - Name: `VITE_API_URL`
   - Value: `/api/product-by-image`
   - Environments: Production, Preview, Development

---

## 🚀 NEXT STEPS TO COMPLETE DEPLOYMENT

### **Step 1: Initialize Git Repository**
```powershell
cd "C:\Users\Vishal B\Documents\smartProductPricing"

# Initialize git
git init

# Configure user
git config user.name "Your Name"
git config user.email "your.email@github.com"

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Smart Product Pricing app ready for deployment"
```

---

### **Step 2: Create GitHub Repository**
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `smart-product-pricing`
3. Description: `AI-powered product price finder`
4. Choose **Public** (required for free Vercel)
5. Click **Create Repository**

---

### **Step 3: Push Code to GitHub**
```powershell
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/smart-product-pricing.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

### **Step 4: Deploy to Vercel**

#### **Option A: Via Vercel Dashboard (Recommended)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Select your `smart-product-pricing` repository
5. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: (keep default)
6. Click **Deploy**

#### **Option B: Via Vercel CLI**
```powershell
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd "C:\Users\Vishal B\Documents\smartProductPricing"
vercel --prod
```

---

### **Step 5: Verify Deployment**

After deployment completes:

1. **Check Production URL**
   - You'll see: `https://smart-product-pricing-[username].vercel.app`
   - Visit the URL in browser

2. **Test Frontend**
   - Homepage should load and display
   - No console errors

3. **Test API Endpoint**
   - Open browser DevTools (F12)
   - Go to Application tab → Storage → Cookies
   - Or use curl:
   ```bash
   curl -X POST https://smart-product-pricing-[username].vercel.app/api/product-by-image \
     -H "Content-Type: application/json" \
     -d '{"imageUrl":"https://m.media-amazon.com/images/I/41UuQWi9FKL.jpg"}'
   ```

4. **Test Image URL Search**
   - Enter product image URL in frontend
   - Click "Get Price"
   - Should return product details or "Not found" message

---

## 💾 DATA VERIFICATION CHECKLIST

Before deploying, verify all critical data files are in place:

```
✅ sample_test.csv
   - Location: Root directory
   - Size: Should contain product data with image_link column
   - Columns: Must include 'image_link' and 'description'
   - Test: Open in Excel to verify structure

✅ sample_test_out.csv
   - Location: Root directory
   - Size: Should contain pricing data
   - Columns: Must include price/value columns

✅ dataset/train.csv
   - Location: dataset/ subdirectory
   - Size: 75,000 products (optional, backup dataset)
   - Purpose: Alternative data source if sample_test.csv fails

✅ package.json
   - Location: Root directory
   - Contents: All dependencies listed, scripts defined

✅ vercel.json
   - Location: Root directory
   - Contents: Build command specified, environment set

✅ /api/product-by-image.js
   - Location: /api/ subdirectory
   - Size: Complete serverless function
   - Functions: CORS headers, CSV reading, response

✅ /api/products.js
   - Location: /api/ subdirectory
   - Size: Complete serverless function

✅ /lib/csv-utils.js
   - Location: /lib/ subdirectory
   - Functions: readCSVWithLimit() exported
```

---

## 📞 QUICK REFERENCE - API ENDPOINTS

### **Production URLs**
```
Frontend:  https://smart-product-pricing-[username].vercel.app
API Base:  https://smart-product-pricing-[username].vercel.app/api
```

### **API Endpoints**
```
POST   /api/product-by-image    → Find product by image URL
GET    /api/products             → Get all products
```

### **Local Development URLs**
```
Frontend:  http://localhost:3000
API Base:  http://localhost:5000
```

---

## 📝 NOTES FOR TROUBLESHOOTING

### **Common Issues & Quick Fixes**

| Issue | Quick Fix |
|-------|-----------|
| API returns 404 | Check `/api/product-by-image.js` exists and `vercel.json` is correct |
| CSV files not found | Verify files are in root, not in subdirectory |
| CORS errors | Ensure CORS headers are set in API function |
| Frontend shows error | Check browser console for actual error message |
| Blank page after deploy | Check Vercel build logs, run `npm run build` locally |
| Wrong API endpoint called | Verify `PriceFinder.jsx` line 60 uses `/api/product-by-image` |
| Deployment timeout | Check `/api/product-by-image.js` for infinite loops or long operations |

---

## ✅ DEPLOYMENT SUCCESS INDICATORS

When deployment is complete and working correctly, you should see:

1. ✅ **Homepage loads** - React components render with styling
2. ✅ **No console errors** - Browser DevTools shows no errors
3. ✅ **Search works** - Can enter image URL and get response
4. ✅ **API responds** - Curl/Postman shows correct JSON response
5. ✅ **Product found** - Shows price when valid product image URL provided
6. ✅ **Error handling** - Shows helpful message for invalid URLs
7. ✅ **Responsive** - Works on mobile and desktop
8. ✅ **CORS working** - No "blocked by CORS policy" errors

---

**Document Status:** Complete  
**Last Verified:** April 8, 2026  
**Ready for Deployment:** ✅ YES

For questions or issues, refer to the troubleshooting section above or check the original deployment guides:
- `DEPLOYMENT_GUIDE.md` - General deployment info
- `DEPLOYMENT_VERCEL.md` - Vercel-specific instructions
- `BACKEND_DEPLOYMENT.md` - Backend/API details
