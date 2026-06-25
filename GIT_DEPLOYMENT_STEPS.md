# 🚀 Git & Deployment Steps

## GitHub Repository
**URL:** https://github.com/Ayman2026/PBL.git

---

## Step 1: Initialize Git and Push to GitHub

Run these commands in your terminal (in the `code` directory):

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: PBL Program Intelligence & Grant Reporting Assistant"

# Set main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/Ayman2026/PBL.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Website (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New Project"**
4. Click **"Import Git Repository"**
5. Select your repository: **Ayman2026/PBL**
6. Vercel will auto-detect Next.js settings:
   - Framework Preset: Next.js ✅
   - Root Directory: ./ ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `.next` ✅
   - Install Command: `npm install` ✅

7. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add these:
     ```
     DATA_DIR_PBL = public/data/02_Primary_PBL_Data/csv_exports
     DATA_DIR_GRANT = public/data/03_Grant_Reporting_Evidence
     CACHE_TTL_MINUTES = 5
     ENABLE_AI_NARRATIVE = false
     ```

8. Click **"Deploy"**
9. Wait 2-3 minutes ⏳
10. Your app will be live at: `https://pbl-[random].vercel.app` 🎉

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - What's your project's name? pbl-dashboard
# - In which directory is your code? ./
# - Want to override settings? No

# Deploy to production
vercel --prod
```

---

## Step 3: Verify Deployment

After deployment, test these URLs:

- ✅ Homepage (Dashboard): `https://your-app.vercel.app/`
- ✅ Grant Report: `https://your-app.vercel.app/grant`

### What to Check:
- [ ] Pages load successfully
- [ ] Data displays correctly
- [ ] Filters work (month, district, grade, subject)
- [ ] KPI cards show metrics
- [ ] Grant report generates
- [ ] Copy to clipboard works
- [ ] Images display (if available)
- [ ] No console errors

---

## Step 4: Custom Domain (Optional)

### On Vercel:
1. Go to your project settings
2. Click "Domains"
3. Add your domain: `pbl-dashboard.yourdomain.com`
4. Follow DNS configuration instructions
5. SSL certificate is automatic ✅

---

## Troubleshooting

### If push fails:
```bash
# If you get authentication errors, use GitHub CLI or token
gh auth login

# Or use HTTPS with token
git remote set-url origin https://YOUR_TOKEN@github.com/Ayman2026/PBL.git
```

### If Vercel build fails:
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Ensure data files are in `public/data/` directory
4. Check that all dependencies are in `package.json`

### If data doesn't load:
1. Verify environment variables match file paths
2. Check that CSV files are committed to git
3. Ensure `public/data/` folder is not in `.gitignore`

---

## Post-Deployment

### Automatic Deployments
Every time you push to `main` branch, Vercel will automatically redeploy! 🚀

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys!
```

### Monitoring
- **Vercel Dashboard:** View logs, analytics, deployments
- **GitHub Actions:** Set up CI/CD for tests
- **Error Tracking:** Consider adding Sentry

---

## What Gets Deployed

✅ All source code (`src/`)
✅ Data files (`public/data/`)
✅ Build output (`.next/`)
✅ Configuration files
✅ Environment variables

❌ `node_modules/` (rebuilt on Vercel)
❌ `.env` files (use Vercel env vars instead)
❌ `.git/` folder

---

## Quick Commands Reference

```bash
# Check git status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# View remote
git remote -v

# Pull latest changes
git pull origin main

# View Vercel deployments
vercel ls

# View deployment logs
vercel logs
```

---

## 🎉 Success!

Once deployed, share your live URL:
- With stakeholders for demo
- In your README.md
- In assignment submission

**Your app is now live on the internet!** 🌐
