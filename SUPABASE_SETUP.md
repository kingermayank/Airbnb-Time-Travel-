# Supabase Setup Instructions

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

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add the following variables:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from Step 2.

## Step 4: Run the Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the `supabase-migration.sql` file from this project
3. Copy the entire SQL script
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration
6. This will create all the necessary tables and insert initial data

## Step 5: Verify the Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `hosts`
   - `listings`
   - `listing_images`
   - `amenities`
   - `listing_amenities`
   - `reviews`
3. Check that the `listings` table has 12 entries (or more if you've added data)

## Step 6: Configure Row Level Security (RLS)

The migration script will set up RLS policies automatically. If you need to verify:

1. Go to **Authentication** → **Policies** in your Supabase dashboard
2. Ensure that all tables have policies allowing SELECT for the `anon` role

## Troubleshooting

- **Can't find API keys**: Make sure you're in the correct project and looking at Settings → API
- **Migration errors**: Check that you're running the entire SQL script, not just parts of it
- **Environment variables not working**: Make sure your `.env.local` file is in the project root and restart your dev server

## Next Steps

After completing these steps, your app should be able to connect to Supabase and fetch listings. You can edit listings directly in the Supabase dashboard under **Table Editor** → **listings**.

