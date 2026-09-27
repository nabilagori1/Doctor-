# Sai Shradhdha Mind Care Clinic — Dr. Renish Bhatt

Official website for **Dr. Renish Bhatt (M.D. Psychiatry)** at **Sai Shradhdha Mind Care Clinic**, Jamnagar, Gujarat.

A compassionate, high-performance web application designed for psychiatric care consultations, confidential appointment booking, real-time Supabase cloud sync, and staff admin management.

---

## 🚀 How to Deploy to Netlify using GitHub (Recommended)

This repository includes pre-built **`netlify.toml`** and **`public/_redirects`** files configured specifically for Vite React SPAs, ensuring zero-configuration deployments, fast global CDN hosting, and automatic Single Page Application routing (preventing 404s on page refresh).

### Step 1: Push your code to GitHub
Run the following commands in your project terminal:

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit your changes
git commit -m "Deploy Sai Shradhdha Clinic website"

# 4. Set default branch to main
git branch -M main

# 5. Connect to your GitHub repository
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual details:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push to GitHub
git push -u origin main
```

### Step 2: Import into Netlify
1. Go to [app.netlify.com](https://app.netlify.com) and log in (choose **Log in with GitHub**).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Choose **"GitHub"** and select your clinic repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Branch:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **"Deploy site"**. Your clinic website will be live in ~25 seconds with automatic SSL!

### Step 3: (Optional) Custom Clinic Domain
- In Netlify, go to **Site configuration** → **Domain management** → **Add domain**.
- Connect your domain (e.g., `drrenishbhatt.com`) for free automated SSL.

---

## 🌐 Alternative: Deploy to GitHub Pages

This repository is already configured with:
1. `base: './'` in `vite.config.ts` (ensures assets load properly on GitHub Pages URLs without 404s).
2. `.github/workflows/deploy.yml` (automatic GitHub Actions CI/CD to build and publish on every push).

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Enter your repository name (e.g., `mindcare-clinic` or `sai-shradhdha-clinic`).
3. Set the repository to **Public**.
4. Leave "Add a README file" and ".gitignore" **unchecked** (they already exist in this project).
5. Click **Create repository**.

### Step 2: Push your code to GitHub
Run the following commands in your terminal from the project root folder:

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit your changes
git commit -m "Deploy Sai Shradhdha Clinic website"

# 4. Set default branch to main
git branch -M main

# 5. Connect to your new GitHub repository
# Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub username & repo name:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages with GitHub Actions
1. Open your repository on GitHub.
2. Click **Settings** (top navigation bar).
3. In the left-hand menu, click **Pages**.
4. Under **Build and deployment** → **Source**, select **GitHub Actions**.
5. That's it! GitHub Actions will automatically run the build and publish your website.
6. Your website will be live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

---

## ⚡ Alternative 1-Click Deployment (Vercel / Netlify via GitHub)

You can also deploy with **Vercel** or **Netlify** using your GitHub repository for instantaneous builds, edge CDN, and 1-click free custom domains:

### Option A: Vercel (Fastest)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Sign in with GitHub and select your repository.
3. Vercel automatically detects **Vite**.
4. Click **Deploy**. Your site is live with a free SSL domain in 20 seconds.

### Option B: Netlify
1. Go to [app.netlify.com/start](https://app.netlify.com/start).
2. Choose **GitHub** and select your repository.
3. Build command: `npm run build`, Publish directory: `dist`.
4. Click **Deploy site**.

---

## 🗄️ Supabase Cloud Database

Patient appointment bookings sync directly with Supabase PostgreSQL cloud database.

### Environment Variables
The repository includes built-in fallbacks, but you can also configure your own keys:
```env
VITE_SUPABASE_URL="https://pbivgyyylvgupudempjp.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_GHjIsado2stkeAF3GXkgHA_D5U4tyyv"
```

To set these in GitHub Actions:
- In GitHub, go to **Settings** → **Secrets and variables** → **Actions**.
- Click **New repository secret** and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Database Table Schema
Run this query in your Supabase SQL Editor if setting up a new project:

```sql
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email_address TEXT,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  patient_type TEXT NOT NULL,
  preferred_language TEXT NOT NULL,
  reason_for_visit TEXT NOT NULL,
  additional_message TEXT,
  status TEXT DEFAULT 'Pending Review',
  staff_notes TEXT,
  submitted_at TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for appointment requests
CREATE POLICY "Allow anonymous appointment submissions" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (true);

-- Allow reading appointments
CREATE POLICY "Allow reading appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (true);

-- Allow updating appointments (for staff status/notes)
CREATE POLICY "Allow updating appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (true);

-- Allow deleting appointments (for cleanup/deduplication)
CREATE POLICY "Allow deleting appointments" 
  ON public.appointments 
  FOR DELETE 
  USING (true);
```

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🩺 Clinic Information & Staff Access

- **Clinic:** Sai Shradhdha Mind Care Clinic
- **Doctor:** Dr. Renish Bhatt, M.D. (Psychiatry)
- **Location:** Jamnagar, Gujarat, India
- **Staff Portal:** Accessible via `/#admin` or the "Staff Portal" link in the footer.
- **Admin Access:** Login ID: `admin`, Password: `noman`
