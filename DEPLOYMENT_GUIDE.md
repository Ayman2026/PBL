# Deployment Guide

This guide covers multiple deployment options for the PBL Program Intelligence & Grant Reporting Assistant.

## Prerequisites

- Node.js 20+ installed
- Git installed
- Account on your chosen hosting platform

## Data Files Consideration

**Important:** The application reads CSV files from parent directories (`../02_Primary_PBL_Data` and `../03_Grant_Reporting_Evidence`). Before deploying, you need to decide how to handle these:

### Option A: Include Data in Deployment
Move data folders into the `code` directory:
```bash
cp -r ../02_Primary_PBL_Data ./data/02_Primary_PBL_Data
cp -r ../03_Grant_Reporting_Evidence ./data/03_Grant_Reporting_Evidence
```

Then update `.env` file:
```
DATA_DIR_PBL=./data/02_Primary_PBL_Data/csv_exports
DATA_DIR_GRANT=./data/03_Grant_Reporting_Evidence
```

### Option B: Use Cloud Storage
Upload data to S3, Google Cloud Storage, or Azure Blob Storage and update environment variables accordingly. You'll need to modify `src/lib/data-loader.ts` to fetch from cloud storage.

---

## Option 1: Vercel (Recommended)

**Easiest option with zero configuration needed.**

### Steps:

1. **Prepare your repository:**
```bash
cd code
git init
git add .
git commit -m "Initial commit - PBL Dashboard"
```

2. **Push to GitHub:**
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

3. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables:
     - `DATA_DIR_PBL`
     - `DATA_DIR_GRANT`
     - `CACHE_TTL_MINUTES=5`
   - Click "Deploy"

4. **Your app will be live at:** `https://your-project.vercel.app`

### Pros:
- Free tier available
- Automatic HTTPS
- CI/CD built-in (auto-deploys on git push)
- Edge network (fast globally)
- Zero configuration

### Cons:
- Need to handle data files separately
- Function execution time limits on free tier

---

## Option 2: Netlify

**Similar to Vercel, great for static sites and serverless.**

### Steps:

1. **Push to GitHub** (same as Vercel steps 1-2)

2. **Deploy to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
     - Base directory: `code` (if deploying from root)
   - Add environment variables in Site Settings
   - Click "Deploy"

3. **Your app will be live at:** `https://your-project.netlify.app`

---

## Option 3: Docker Deployment

**For maximum control and portability.**

### Build the Docker image:

```bash
cd code

# Build the image
docker build -t pbl-dashboard .

# Run locally to test
docker run -p 3000:3000 pbl-dashboard
```

### Deploy to cloud platforms:

#### AWS ECS/Fargate:
```bash
# Authenticate with AWS
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag pbl-dashboard:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/pbl-dashboard:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/pbl-dashboard:latest

# Then create ECS service in AWS Console
```

#### Google Cloud Run:
```bash
# Enable Cloud Run API and authenticate
gcloud auth login

# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/pbl-dashboard

# Deploy
gcloud run deploy pbl-dashboard \
  --image gcr.io/YOUR_PROJECT_ID/pbl-dashboard \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances:
```bash
# Login to Azure
az login

# Create container registry
az acr create --resource-group myResourceGroup --name myRegistry --sku Basic

# Push image
az acr build --registry myRegistry --image pbl-dashboard:latest .

# Deploy
az container create \
  --resource-group myResourceGroup \
  --name pbl-dashboard \
  --image myRegistry.azurecr.io/pbl-dashboard:latest \
  --dns-name-label pbl-dashboard-unique \
  --ports 3000
```

---

## Option 4: Traditional VPS (DigitalOcean, Linode, etc.)

**For full server control.**

### Steps:

1. **Set up your server:**
```bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2
```

2. **Deploy your application:**
```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/code

# Install dependencies
npm install

# Create .env file with your configuration
nano .env

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "pbl-dashboard" -- start
pm2 save
pm2 startup
```

3. **Set up Nginx as reverse proxy:**
```bash
# Install Nginx
apt-get install nginx

# Create Nginx config
nano /etc/nginx/sites-available/pbl-dashboard
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/pbl-dashboard /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

4. **Add SSL with Let's Encrypt:**
```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## Environment Variables

Create a `.env` file in the `code` directory with these variables:

```env
# Data Directories
DATA_DIR_PBL=./data/02_Primary_PBL_Data/csv_exports
DATA_DIR_GRANT=./data/03_Grant_Reporting_Evidence

# Cache Settings
CACHE_TTL_MINUTES=5

# Feature Flags
ENABLE_AI_NARRATIVE=false

# Production Settings (optional)
NODE_ENV=production
```

---

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] All pages render (Dashboard and Grant Report)
- [ ] Data filters work correctly
- [ ] KPI metrics display accurate data
- [ ] Copy-to-clipboard functionality works
- [ ] Images load (if included in deployment)
- [ ] Performance is acceptable (< 3s page load)
- [ ] No console errors in browser
- [ ] Mobile responsive design works

---

## Monitoring & Maintenance

### Vercel/Netlify:
- Built-in analytics and error tracking
- View logs in the platform dashboard
- Automatic security updates

### Docker/VPS:
- Set up logging: `pm2 logs pbl-dashboard`
- Monitor with: `pm2 monit`
- Set up automated backups of data files
- Configure log rotation
- Set up uptime monitoring (UptimeRobot, Pingdom)

---

## Troubleshooting

### "Cannot find module" errors
- Ensure all dependencies are installed: `npm install`
- Check that `node_modules` is not in `.gitignore` for Docker builds

### Data files not loading
- Verify `DATA_DIR_PBL` and `DATA_DIR_GRANT` environment variables
- Check file paths are correct relative to the application
- Ensure data files are included in the deployment

### Build fails
- Check Node.js version (must be 20+)
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`

### Performance issues
- Increase `CACHE_TTL_MINUTES` in production
- Consider moving data to a database (PostgreSQL)
- Enable Redis for distributed caching

---

## Recommended: Vercel for Quick Demo

For this assignment/demo, I recommend **Vercel** because:
1. Zero configuration needed
2. Free tier is generous
3. Deploy in under 5 minutes
4. Perfect for Next.js applications
5. Provides a live URL to share

Just remember to handle the data files before deploying!

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Docker Docs: https://docs.docker.com/
