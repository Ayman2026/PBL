# 🔧 Vercel Deployment Fix Instructions

## Problem
The app is looking for data files in `/var/02_Primary_PBL_Data/` instead of `public/data/02_Primary_PBL_Data/`

## Root Cause
Environment variables in Vercel were set incorrectly, causing path resolution issues.

---

## ✅ Solution: Update Environment Variables in Vercel

### Step 1: Go to Your Vercel Project Settings

1. Open https://vercel.com/dashboard
2. Click on your **PBL** project
3. Click **"Settings"** tab (top navigation)
4. Click **"Environment Variables"** in the left sidebar

---

### Step 2: Delete Old Environment Variables

Find and **DELETE** these variables if they exist:
- `DATA_DIR_PBL`
- `DATA_DIR_GRANT`
- `CACHE_TTL_MINUTES`
- `ENABLE_AI_NARRATIVE`

(Click the "⋮" menu next to each variable and select "Delete")

---

### Step 3: Add Correct Environment Variables

Add these **4 NEW variables** (click "Add New" button):

#### Variable 1:
- **Name:** `DATA_DIR_PBL`
- **Value:** `public/data/02_Primary_PBL_Data/csv_exports`
- **Environment:** Production, Preview, Development (all checked)

#### Variable 2:
- **Name:** `DATA_DIR_GRANT`
- **Value:** `public/data/03_Grant_Reporting_Evidence`
- **Environment:** Production, Preview, Development (all checked)

#### Variable 3:
- **Name:** `CACHE_TTL_MINUTES`
- **Value:** `5`
- **Environment:** Production, Preview, Development (all checked)

#### Variable 4:
- **Name:** `ENABLE_AI_NARRATIVE`
- **Value:** `false`
- **Environment:** Production, Preview, Development (all checked)

**IMPORTANT:** Make sure there are NO leading or trailing slashes in the paths!
- ✅ CORRECT: `public/data/02_Primary_PBL_Data/csv_exports`
- ❌ WRONG: `/public/data/02_Primary_PBL_Data/csv_exports`
- ❌ WRONG: `public/data/02_Primary_PBL_Data/csv_exports/`

---

### Step 4: Push Code Fix to GitHub

I've already fixed the code. Now you need to push the fix:

```bash
# In your 'code' folder terminal:
git add .
git commit -m "Fix: Correct path resolution for Vercel deployment"
git push origin main
```

---

### Step 5: Redeploy (Automatic)

Vercel will automatically detect your push and redeploy!

**Or manually redeploy:**
1. Go to **"Deployments"** tab in Vercel
2. Find the latest deployment
3. Click "⋮" menu → **"Redeploy"**

---

### Step 6: Verify It Works

After deployment completes (2-3 minutes):

1. Visit your Vercel URL: `https://your-app.vercel.app/`
2. Check that:
   - ✅ Dashboard loads without errors
   - ✅ Data displays in KPI cards
   - ✅ Filters work
   - ✅ `/grant` page loads

---

## Alternative: Remove Environment Variables Entirely

If you want to use default values (recommended for simplicity):

1. **Delete ALL 4 environment variables** in Vercel
2. The app will use fallback values from `.env.production`
3. Redeploy

This works because the code now has proper fallbacks:
```typescript
const DATA_DIR_PBL = process.env.DATA_DIR_PBL || "public/data/02_Primary_PBL_Data/csv_exports";
```

---

## What I Fixed in the Code

Changed `src/lib/paths.ts` to:
- ✅ Remove debug console.log statements
- ✅ Better path resolution logic
- ✅ Handle both absolute and relative paths
- ✅ Proper fallback to `public/data/`

---

## Troubleshooting

### Still seeing errors?

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click latest deployment
   - Click "Functions" tab
   - Look for errors

2. **Verify Files Exist:**
   - Go to GitHub: https://github.com/Ayman2026/PBL
   - Navigate to `public/data/02_Primary_PBL_Data/csv_exports/`
   - Confirm all 3 CSV files are there

3. **Check Build Logs:**
   - In Vercel, check the "Building" logs
   - Look for any errors during build

4. **Clear Cache and Redeploy:**
   - Vercel Dashboard → Deployments
   - Click "⋮" → Redeploy → Check "Clear Cache"

---

## Quick Fix Checklist

- [ ] Update environment variables in Vercel (remove leading slashes)
- [ ] Push code fix to GitHub: `git push origin main`
- [ ] Wait for automatic redeploy (or trigger manual redeploy)
- [ ] Test homepage loads
- [ ] Test grant page loads
- [ ] Verify data displays correctly

---

## Expected Result

After following these steps, your app should load successfully with:
- ✅ All CSV data loading correctly
- ✅ KPIs showing metrics
- ✅ Filters working
- ✅ Grant reports generating
- ✅ No errors in browser console

---

## Need More Help?

If still having issues, check:
1. Vercel build logs for specific errors
2. Browser console (F12) for client-side errors
3. Vercel function logs for runtime errors

**The fix is simple: correct environment variables + push the code update!** 🚀
