# Backend Deployment Guide for Vercel

## 📁 New Project Structure

Your backend has been restructured for **Vercel Serverless Functions**:

```
smartProductPricing/
├── api/                          ← NEW: Serverless API functions
│   ├── product-by-image.js     (POST/GET image-based product lookup)
│   └── products.js             (GET all products or by ID)
├── lib/                          ← NEW: Shared utilities
│   └── csv-utils.js            (CSV parsing helper)
├── frontend/                     (React frontend - already deployed)
├── backend/                      (Legacy - can be deleted after deployment)
├── dataset/                      (train.csv, test.csv)
├── sample_test.csv             (Product data with image links)
├── sample_test_out.csv         (Price data)
├── package.json               (UPDATED: includes API dependencies)
└── vercel.json               (UPDATED: API function configuration)
```

---

## 🚀 Step-by-Step Deployment

### **Step 1: Install Root Dependencies**

```bash
# Navigate to project root
cd c:\Users\Vishal B\Documents\smartProductPricing

# Install all dependencies (frontend + api)
npm install
```

### **Step 2: Test Locally (Optional)**

Test the serverless functions locally before deploying:

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Run Vercel Functions locally
vercel dev

# Your API will be available at:
# http://localhost:3000/api/product-by-image
# http://localhost:3000/api/products
```

### **Step 3: Deploy to Vercel**

Option A - **Using Vercel CLI**:
```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy from project root
vercel --prod

# Follow the prompts:
# - Link to existing project? Yes (select your smartProductPricing project)
# - Override settings? No

# Your API will be available at:
# https://smart-product-pricing.vercel.app/api/product-by-image
# https://smart-product-pricing.vercel.app/api/products
```

Option B - **Using Vercel Dashboard**:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `smartProductPricing` project
3. Go to **Settings → Redeploy**
4. Click **Redeploy** - Vercel will auto-detect the new API routes

---

## 🔗 API Endpoints (After Deployment)

### **1. Find Product by Image URL**

**POST** `https://your-project.vercel.app/api/product-by-image`

Request body:
```json
{
  "imageUrl": "https://m.media-amazon.com/images/I/41UuQWi9FKL.jpg"
}
```

Response:
```json
{
  "success": true,
  "found": true,
  "description": "Product description...",
  "price": 29.99,
  "source": "url-match",
  "message": "Product found successfully"
}
```

---

### **2. Get All Products**

**GET** `https://your-project.vercel.app/api/products`

Response:
```json
{
  "success": true,
  "count": 1000,
  "data": [
    { "sample_id": "217392", "catalog_content": "...", "image_link": "..." },
    ...
  ]
}
```

---

### **3. Get Specific Product by ID**

**GET** `https://your-project.vercel.app/api/products?id=ASIN123`

Response:
```json
{
  "success": true,
  "data": { "asin": "ASIN123", "title": "...", ... }
}
```

---

## ✅ Verify Deployment

After deployment, test your endpoints:

```bash
# Test product-by-image endpoint
curl -X POST https://your-project.vercel.app/api/product-by-image \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://m.media-amazon.com/images/I/41UuQWi9FKL.jpg"}'

# Test products endpoint
curl https://your-project.vercel.app/api/products
```

Or use **Postman**:
1. Import the API endpoints
2. Test each one
3. Verify responses match expected format

---

## 🔧 Frontend Configuration

Your frontend will automatically use the deployed API:

1. **During development** (local backend):
   - Create `frontend/.env.local`:
     ```
     VITE_API_URL=http://localhost:5000
     ```

2. **After deployment** (production):
   - Remove `.env.local` or set:
     ```
     VITE_API_URL=https://your-project.vercel.app/api
     ```
   - Or leave empty to use relative paths (auto-detects `/api/*`)

---

## 📊 Response Format Changes

The API response format has been updated slightly:

**Old Format (Express server):**
```json
{
  "price": 29.99,
  "description": "..."
}
```

**New Format (Serverless):**
```json
{
  "success": true,
  "price": 29.99,
  "description": "...",
  "message": "Product found successfully"
}
```

Your frontend has been updated to handle both formats automatically.

---

## 🐛 Troubleshooting

### **Issue: CSV files not found**

**Error:** `"Failed to load product database. CSV files not found or empty."`

**Solution:**
- Make sure `sample_test.csv` and `sample_test_out.csv` are committed to Git
- They are in the project root, not inside a folder
- Redeploy: `vercel --prod`

### **Issue: API returns 404**

**Solution:**
- Verify endpoints use correct format:
  - ✅ `/api/product-by-image` (not `/product-by-image`)
  - ✅ `/api/products` (not `/products`)
- Check CORS headers are being sent
- Verify request payload format matches (JSON for POST)

### **Issue: CORS errors in browser**

**Solution:**
- CORS is already enabled in API routes
- Check that your frontend is calling the correct API URL
- Make sure requests include proper headers:
  ```javascript
  { headers: { "Content-Type": "application/json" } }
  ```

### **Issue: Cold start delays**

**Expected:** First request takes 2-3 seconds (Vercel loads function)

**Solution:**
- Subsequent requests are instant
- Add loading states in UI for better UX

---

## ⚡ Performance Tips

1. **Cache CSV data** (optional):
   - Serverless functions reload CSV on each call
   - For better performance, consider using a database instead

2. **Pagination** (optional):
   - Add query parameters: `/api/products?page=1&limit=50`

3. **Enable compression**:
   - Already handled by Vercel

---

## 📝 Next Steps

1. ✅ Restructured backend for Vercel
2. ✅ Created serverless API functions
3. ✅ Updated frontend to use new API URLs
4. 👉 **Deploy to Vercel** (see Step 3 above)
5. 👉 **Update frontend environment** (if needed)
6. 👉 **Test endpoints** (use curl or Postman)
7. 👉 **Delete backend folder** (after confirming deployment works)

---

## 📞 Support

If you encounter issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [API Functions Guide](https://vercel.com/docs/serverless-functions/api-calls)
- Check deployment logs: `vercel logs`
