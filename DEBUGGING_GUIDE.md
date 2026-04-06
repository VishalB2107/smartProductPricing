# 🐛 Debugging Guide - Price Finder Feature

## Overview
Your deployed website now has **enhanced error logging** to help diagnose issues with the "Find Price by Image" feature.

---

## How to See Error Logs

### **Frontend Logs (In Browser)**

1. Open your deployed website: **https://smart-product-pricing.vercel.app**
2. Right-click → **Inspect** (or press **F12**)
3. Go to the **Console** tab
4. Try to find a product price
5. You'll see detailed logs like:
   ```
   🔍 Making API request to: /api/product-by-image
   📎 Image URL: https://m.media-amazon.com/images/I/91GB1wC6ObL.jpg
   ✅ API Response: {success: true, ...}
   ✅ Product found successfully!
   ```

### **Backend Logs (Vercel Dashboard)**

1. Go to **https://vercel.com/dashboard**
2. Click on your project: **smart-product-pricing**
3. Click on the **Deployments** tab
4. Click on the latest deployment
5. Scroll to **Function Logs** section
6. You'll see all server-side errors and debugging info:
   ```
   🔍 Searching for image URL: https://m.media-amazon.com/images/I/91GB1wC6ObL.jpg
   📁 Looking for CSV files at: /vercel/path0
   ✅ Test CSV exists: true
   ✅ Price CSV exists: true
   📊 Loaded test rows: 50
   💰 Loaded price rows: 50
   ✅ Matched product ID: 217392
   💰 Price: 62.080007781501635
   ```

---

## What I Fixed

### ✅ 1. **Enhanced Error Logging**
- Added detailed console logs in both frontend and backend
- Shows exactly what's happening at each step
- Helps identify where the problem occurs

### ✅ 2. **CSV File Handling**
- Added checks to verify CSV files exist
- Logs the file paths being used
- Returns specific error if files aren't found

### ✅ 3. **Sample ID Matching**
- Fixed potential issue with sample_id comparison
- Now converts both values to strings before comparing
- Prevents mismatches due to type differences

### ✅ 4. **Configuration Files**
- Updated `vercel.json` to properly route API requests
- Created `.vercelignore` to ensure CSV files are deployed
- All files are now included in the deployment

---

## Testing Checklist

### Test 1: Basic Functionality ✅
1. Go to: https://smart-product-pricing.vercel.app
2. Enter an image URL from `sample_test.csv`
3. Click "GET PRICE"
4. **Expected**: Show product price

### Test 2: Valid Image URL
Sample URLs you can test with (from your CSV):
```
https://m.media-amazon.com/images/I/91GB1wC6ObL.jpg
https://m.media-amazon.com/images/I/81VnzF1vkvL.jpg
https://m.media-amazon.com/images/I/51aCDMHMnIL.jpg
https://m.media-amazon.com/images/I/71dzRyLGPiL.jpg
```

### Test 3: Error Messages
1. Enter an invalid image URL
2. Click "GET PRICE"
3. **Expected**: See error message "No product found with this image URL"
4. **Check console**: See detailed logs about the search

### Test 4: File Upload
1. Download an image from your product list
2. Drag it onto the upload area
3. Click "GET PRICE"
4. **Expected**: File processing works (note: file upload feature may need Backend integration)

---

## Common Issues & Solutions

### Issue: "Server error occurred"

**Causes to check:**
1. ✅ CSV files not deployed - Check Vercel Function Logs for: "Test CSV exists: false"
2. ✅ Wrong file paths - Check logs for: "Looking for CSV files at: /vercel/path0"
3. ✅ Empty CSV data - Check logs for: "Loaded test rows: 0"

**How to fix:**
- Check Vercel dashboard logs (see above)
- Look for 🔴 red error messages
- Search for: `❌ Error:` in the logs

### Issue: Product not found even with valid URL

**Causes to check:**
1. ✅ Image URL might have different formatting
2. ✅ Partial match not working correctly
3. ✅ Sample ID mismatch

**How to debug:**
1. Open browser console (F12 → Console)
2. Copy the exact URL you're searching for
3. Check vercel logs to see what URL was received
4. Compare with URLs in sample_test.csv

### Issue: API not responding

**Causes to check:**
1. ✅ Check if Vercel is properly serving the `/api/` endpoint
2. ✅ Verify CSV files are deployed

**How to debug:**
1. Open browser console (F12 → Console)
2. Look for: "🔄 Making API request to:"
3. Then should show: "✅ API Response:"
4. If no response, check Vercel deployment status

---

## How to View Complete Logs

### **Option 1: Terminal (Local)**
```bash
# Watch logs in real-time
vercel logs --follow

# View past logs
vercel logs
```

### **Option 2: Vercel Dashboard**
1. https://vercel.com/bvishal2107-2345s-projects/smart-product-pricing
2. Click on recent deployment
3. Scroll to "Function Logs"
4. Search for 🔍 to find relevant entries

---

## Error Log Format

All logs follow this format:

| Symbol | Meaning | Example |
|--------|---------|---------|
| 🔍 | Searching/Input | `🔍 Making API request to:` |
| 📎 | URL/File | `📎 Image URL:` |
| 📁 | File system | `📁 Looking for CSV files` |
| ✅ | Success/Exists | `✅ Test CSV exists: true` |
| ❌ | Error/Missing | `❌ Error: No product found` |
| 📊 | Data count | `📊 Loaded test rows: 50` |
| 💰 | Price | `💰 Price: 62.08` |
| 🔎 | Found | `🔎 Exact match found: true` |

---

## Next Steps

1. **Test the feature**: Use one of the test URLs above
2. **Check console logs**: See what happens at each step
3. **Report any issues**: Check if they match the "Common Issues" section
4. **View full logs**: If still stuck, check Vercel Function Logs

---

## Quick Test Script

**To test the API directly**, open your browser console and run:

```javascript
// Test the API with a sample image URL
fetch('/api/product-by-image', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    imageUrl: 'https://m.media-amazon.com/images/I/91GB1wC6ObL.jpg'
  })
})
.then(res => res.json())
.then(data => console.log('Result:', data))
.catch(err => console.error('Error:', err));
```

You should see the API response in your console!

---

**If you still encounter issues, check the Vercel Logs with these search terms:**
- `❌ Error` - Shows all errors
- `✅ Loaded` - Shows how many rows loaded
- `🔍 Searching` - Shows search attempts
- `📁 exists:` - Shows if CSV files found

Good luck! 🚀
