# Supabase Setup Instructions

Supabase is required for loading listings from the backend and for the **booking queue number** on the confirmation page ("You're number X on the waiting list"). Without it, bookings are not stored and the queue number will not appear.

**Quick checklist (you do these externally / in the dashboard):**
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get **Project URL** and **anon key** from **Settings → API**
3. Create `.env.local` in this project root with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Run **two** SQL migrations in the Supabase **SQL Editor** (in order): `supabase-migration.sql`, then `scripts/add-bookings-table.sql`
5. Restart your dev server after adding `.env.local`

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Choose a name for your project (e.g., "Airbnb Time Travel")
   - **Database Password**: Create a strong password (save this securely)
   - **Region**: Choose the region closest to you
5. Click "Create new project"
6. Wait for the project to be set up (this may take a few minutes)

## Step 2: Get Your Project Credentials

1. Once your project is ready, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: Copy this value (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy this value (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. In your project root, create a file named **`.env.local`** (same folder as `package.json`). You can copy **`.env.example`** and then replace the placeholder values.
2. Set these two variables (use the values from Step 2):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Restart your dev server** after creating or editing `.env.local` so Vite picks up the new env vars.

## Step 4: Run the Database Migrations

Run **both** of these in order in the Supabase **SQL Editor** (Dashboard → **SQL Editor** → New query).

**4a. Main migration (tables + seed data)**  
1. Open the file **`supabase-migration.sql`** in this project (project root).
2. Copy the entire script, paste into the SQL Editor, and click **Run**.  
   This creates `hosts`, `listings`, `listing_images`, `amenities`, `listing_amenities`, `reviews`, and the `update_updated_at_column()` function.

**4b. Bookings table (for confirmation queue number)**  
1. Open **`scripts/add-bookings-table.sql`** in this project.
2. Copy the entire script, paste into a new SQL Editor tab, and click **Run**.  
   This creates the `bookings` table so that "Confirm and Warp" saves each booking and the app can show "You're number X on the waiting list."

## Step 5: Verify the Setup

1. Go to **Table Editor** in your Supabase dashboard.
2. You should see these tables:
   - `hosts`
   - `listings`
   - `listing_images`
   - `amenities`
   - `listing_amenities`
   - `reviews`
   - **`bookings`** (required for the queue number on the confirmation page)
3. Check that `listings` has data (e.g. 12+ rows). `bookings` will be empty until users complete a booking.

## Step 6: Configure Row Level Security (RLS)

The migration script will set up RLS policies automatically. If you need to verify:

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. Ensure that all tables have policies allowing SELECT for the `anon` role

## Troubleshooting

- **Can't find API keys**: Make sure you're in the correct project and looking at **Settings → API** (Project URL and anon public key).
- **Migration errors**: Run the full script each time. The **bookings** migration requires the main migration to have been run first (it uses `update_updated_at_column()` and `listings(id)`).
- **Environment variables not working**: Put `.env.local` in the **project root** (same folder as `package.json`). Restart the dev server after creating or changing `.env.local`.
- **Still see "You're on the waiting list" with no number**: Confirm `.env.local` has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (no typos), the `bookings` table exists in Supabase, and you restarted the dev server. In the browser console (dev) you should not see "Supabase not configured" warnings.

## Next Steps

After completing these steps, your app should be able to connect to Supabase and fetch listings. You can edit listings directly in the Supabase dashboard under **Table Editor** → **listings**.

