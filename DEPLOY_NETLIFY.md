# How to Deploy Sai Shradhdha Clinic Website to Netlify using GitHub

This guide walks you through deploying your clinic website on **Netlify** connected directly to your **GitHub** repository. Every time you push code updates to GitHub, Netlify will automatically build and publish your changes to a global CDN with free SSL.

---

## ⚡ Quick Summary of Configuration Already Done

Your project is already pre-configured for Netlify:
1. **`netlify.toml`**: Configured with build command (`npm run build`), publish directory (`dist`), Node 20 runtime, and security headers.
2. **`public/_redirects`**: Configured with `/*  /index.html  200` to prevent 404 errors on browser page reloads and deep links.
3. **`vite.config.ts`**: Configured with relative base asset paths (`base: './'`).
4. **Supabase Cloud Database**: Configured to sync patient appointments directly to Supabase PostgreSQL.

---

## 📋 Step-by-Step Instructions

### Step 1: Push Code to Your GitHub Repository

If you haven't pushed this code to GitHub yet, run these commands in your project terminal:

```bash
# 1. Initialize git
git init

# 2. Add all project files
git add .

# 3. Commit files
git commit -m "Configure clinic website for Netlify and GitHub deployment"

# 4. Set branch to main
git branch -M main

# 5. Connect to your GitHub repository
# (Replace YOUR_USERNAME and YOUR_REPO_NAME with your GitHub details)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push code to GitHub
git push -u origin main
```

---

### Step 2: Connect GitHub to Netlify

1. Go to [app.netlify.com](https://app.netlify.com/) and sign up or log in.
2. We recommend clicking **Log in with GitHub** for automatic account authorization.
3. In your Netlify dashboard, click the **"Add new site"** button in the top right.
4. Select **"Import an existing project"**.
5. Choose **"Deploy with GitHub"**.
6. When prompted, authorize Netlify to access your GitHub repositories (you can choose "All repositories" or select only your clinic repository).
7. Search for and click your clinic repository (e.g. `mindcare-clinic` or `sai-shradhdha-clinic`).

---

### Step 3: Verify Build & Deploy Settings

Because your project has `netlify.toml`, Netlify will automatically pre-fill the correct settings:

- **Branch to deploy**: `main` (or `master`)
- **Base directory**: (leave blank / root)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

#### (Optional) Environment Variables
Under **Environment variables** (or in **Site configuration** → **Environment variables**), verify or add:
- `VITE_SUPABASE_URL` = `https://pbivgyyylvgupudempjp.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `sb_publishable_GHjIsado2stkeAF3GXkgHA_D5U4tyyv`

*(Note: These are already backed up by built-in safe defaults in the application code, so the site will work even if omitted).*

---

### Step 4: Click Deploy!

1. Click **"Deploy Sai Shradhdha Clinic"** (or **"Deploy site"**).
2. Netlify will begin building your project (usually takes ~20 to 30 seconds).
3. Once completed, your site will be live at a URL like:
   `https://random-name-12345.netlify.app`

---

### Step 5: (Optional) Set a Custom Domain or Friendly Subdomain

1. In your Netlify site overview, click **"Site configuration"** → **"Change site name"**.
   - You can change it to something clean like `sai-shradhdha-clinic.netlify.app`.
2. To use your own custom clinic domain (e.g., `drrenishbhatt.com` or `mindcareclinic.in`):
   - Go to **"Domain management"** → **"Add a domain"**.
   - Follow Netlify's DNS instructions (add a CNAME or Netlify DNS record).
   - Netlify will automatically provision a free Let's Encrypt SSL certificate for your custom domain.

---

## 🔄 Automatic Continuous Deployment (CI/CD)

Whenever you make updates to the code, just push to GitHub:
```bash
git add .
git commit -m "Update clinic services"
git push origin main
```
Netlify will automatically detect the push, run `npm run build`, and deploy the latest version without any manual effort!
