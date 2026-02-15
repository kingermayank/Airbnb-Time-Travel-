# Supabase Storage Setup for Picker Images

## Problem
Theme and Era picker images don't load because the `listing-images` bucket doesn't exist in Supabase Storage.

## Solution

### Step 1: Create the Storage Bucket (Manual)

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `bsloiphxznbbwfntuxmu`
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure:
   - **Name**: `listing-images`
   - **Public bucket**: ✅ **CHECKED** (this is critical!)
   - **Allowed MIME types**: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`
   - **File size limit**: 50 MB
6. Click **"Create bucket"**

### Step 2: Upload Picker Images

After creating the bucket, run:

```bash
npm run upload-picker-images
```

This will upload 9 placeholder PNG images:
- **Themes** (5): grandeur, sci-fi, myth, conflict, classified
- **Eras** (4): origins, classical, recent-past, future

### Step 3: Verify

Test that images are accessible:

```bash
npx tsx scripts/diagnose-picker-images.ts
```

Or manually visit:
```
https://bsloiphxznbbwfntuxmu.supabase.co/storage/v1/object/public/listing-images/picker/themes/grandeur.png
```

## Why the Bucket Must Be Public

The picker images need to be accessible without authentication. If the bucket is private:
- Images will return 400/403 errors
- The `onError` handler will show placeholder letters instead
- Users will only see gray tiles with initials

## Storage Structure

```
listing-images/
└── picker/
    ├── themes/
    │   ├── grandeur.png
    │   ├── sci-fi.png
    │   ├── myth.png
    │   ├── conflict.png
    │   └── classified.png
    └── eras/
        ├── origins.png
        ├── classical.png
        ├── recent-past.png
        └── future.png
```

## Troubleshooting

### Images still don't load after setup:

1. **Check bucket is public:**
   - Storage → listing-images → Settings
   - Ensure "Public bucket" is enabled

2. **Check CORS (if needed):**
   - Usually not required for public buckets
   - If issues persist, add CORS policy in Supabase Dashboard

3. **Verify .env.local has correct URL:**
   ```
   VITE_SUPABASE_URL=https://bsloiphxznbbwfntuxmu.supabase.co
   ```

4. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

5. **Check browser console:**
   - Look for 403/404 errors
   - Verify the constructed URL matches the storage path
