# Vercel Deployment Guide - Smart Product Pricing

Your application is now configured for deployment on Vercel! Follow these steps to deploy:

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (create account if needed)
2. Click **New Repository** button
3. Enter repository name: `smart-product-pricing`
4. Description: "AI-powered product price finder"
5. Choose **Public** (required for free Vercel deployment)
6. Click **Create Repository**

## Step 2: Push Your Code to GitHub

Open PowerShell in your project directory and run:

```powershell
cd "C:\Users\Vishal B\Documents\smartProductPricing"

# Configure git with your GitHub details
git config user.name "Your Name"
git config user.email "your.email@github.com"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/smart-product-pricing.git

# Rename branch to main and push
git branch -M main
git push -u origin main
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `Your Name` with your name
- `your.email@github.com` with your email

## Step 3: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub
5. Complete your account setup

## Step 4: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your `smart-product-pricing` repository
4. Select your repository
5. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: Keep default
6. Click **Deploy**

### Option B: Via Vercel CLI

```powershell
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy from your project directory
cd "C:\Users\Vishal B\Documents\smartProductPricing"
vercel
```

Follow the prompts:
- Link to existing project? Select your project
- Set production? Yes

## Step 5: Verify Deployment

After deployment completes, you'll see:
- **Production URL**: `https://smart-product-pricing-YOUR-USERNAME.vercel.app`

Visit this URL to see your deployed app!

## Important Notes

### CSV Data Files
Your `sample_test.csv` and `sample_test_out.csv` files are already included in the deployment. The serverless functions will access them automatically.

### API Endpoint
The API endpoint is automatically available at:
- `https://your-domain.vercel.app/api/product-by-image`

The frontend will automatically use this endpoint when deployed.

### Local Development
To test locally before deploying:

```powershell
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

**Note**: The local dev server will use the relative API path `/api/product-by-image` which won't work locally. To test locally with the backend:

1. Update `frontend/.env.local`:
   ```
   VITE_API_URL=http://localhost:5000/product-by-image
   ```

2. Start the backend:
   ```powershell
   cd backend
   npm start
   ```

3. In another terminal, start frontend:
   ```powershell
   cd frontend
   npm run dev
   ```

## Troubleshooting

### Deployment Fails
- Check that `vercel.json` exists in project root
- Ensure CSV files are in the root directory
- Check build logs in Vercel dashboard

### API Returns 404
- Make sure CSV files exist in project root
- Check API function at `/api/product-by-image.js`

### Build Takes Long
- First build can take 2-3 minutes
- Subsequent deployments are faster

### CORS Issues
- CORS is already configured in the API
- Should work from any domain

## After Deployment

Your live app will be at:
```
https://smart-product-pricing-YOUR-DOMAIN.vercel.app
```

Share this link to use the app!

---

For more help, visit [vercel.com/docs](https://vercel.com/docs)
