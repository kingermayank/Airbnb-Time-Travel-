# WarpBnB.com – Vercel deployment checklist

Use this when **localhost shows changes but WarpBnB.com does not**.

## 1. Confirm GitHub is up to date

- Your repo: `https://github.com/kingermayank/Airbnb-Time-Travel-`
- Latest commit on `main`: run `git log origin/main -1` locally.
- In GitHub: **Code → Commits** and confirm your latest commit is there.

## 2. Check Vercel dashboard

1. **Deployments**  
   - [vercel.com](https://vercel.com) → your project → **Deployments**  
   - Find the deployment for your latest commit (same hash as GitHub).  
   - Status should be **Ready** (green). If it’s **Building** or **Error**, that’s why the site isn’t updated.

2. **Production branch**  
   - **Settings → Git → Production Branch**  
   - Should be `main` (or whatever branch you push to for production).  
   - Only that branch’s successful deployments go to your production domain.

3. **Which deployment is live**  
   - **Deployments** → open the deployment that has the **Production** badge.  
   - Check the commit SHA and time.  
   - If it’s an old commit, a new deployment either didn’t run or didn’t get assigned to production.

4. **Build & development**  
   - **Settings → General → Build & Development**  
   - **Framework Preset**: Vite (or leave on Auto).  
   - **Build Command**: `npm run build` or `tsc -b && vite build` (match your `package.json`).  
   - **Output Directory**: `dist` (Vite’s default).  
   - **Install Command**: `npm install` (or leave default).

## 3. Trigger a new deployment (don’t “Redeploy” old one)

- **Redeploy** reuses the *same* commit. To get new code:
  - Push a new commit to `main`, or  
  - **Deployments** → **…** on latest deployment → **Redeploy** and choose **Use existing Build Cache** **off** and confirm the commit is the one you want.

- Or from repo root:
  ```bash
  git add -A && git commit -m "chore: trigger Vercel redeploy" && git push origin main
  ```

## 4. Cache and CDN

- **Browser**: Hard refresh (e.g. Cmd+Shift+R / Ctrl+Shift+R) or open WarpBnB.com in an **incognito/private** window.
- **Vercel**: New deployments get new URLs; production domain updates when that deployment is promoted. No extra “cache clear” needed for code updates.

## 5. Staging vs production (if you use it)

- If **Settings → Environments → Production** has **Branch** set and “Automatically assign Production URL” (or similar) is **off**, new builds may not go to WarpBnB.com until you **Promote to Production** from the **Deployments** page.

## 6. GitHub ↔ Vercel

- **Settings → Git** in Vercel: connected repo should be `kingermayank/Airbnb-Time-Travel-`.
- On GitHub: **Settings → Webhooks** → Vercel webhook should exist and show recent successful deliveries (no repeated failures).

## Quick summary

| What you see | What to do |
|--------------|------------|
| No new deployment after push | Check GitHub webhook and Vercel Git connection; push again or trigger deploy from Vercel. |
| New deployment is “Error” | Open that deployment in Vercel and fix the build (logs + **Build & Development** settings). |
| New deployment “Ready” but site unchanged | Confirm production branch and that this deployment is **Production**; try incognito/hard refresh. |
| Old deployment is Production | Promote the latest successful deployment to Production, or fix production branch and redeploy. |

---

**Project details (for Vercel):**

- **Framework**: Vite (React)
- **Build**: `npm run build` → `tsc -b && vite build`
- **Output**: `dist`
- **SPA routing**: `vercel.json` rewrites `/(.*)` → `/index.html` so client-side routes work on WarpBnB.com.
