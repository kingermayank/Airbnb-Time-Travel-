# Fix: Theme and Era Picker Images Not Loading

## Root Cause
The `listing-images` Supabase Storage bucket **does not exist**. The picker components are trying to load images from:
```
https://bsloiphxznbbwfntuxmu.supabase.co/storage/v1/object/public/listing-images/picker/themes/*.png
https://bsloiphxznbbwfntuxmu.supabase.co/storage/v1/object/public/listing-images/picker/eras/*.png
```

But since the bucket doesn't exist, all images fail to load, triggering the `onError` handler which shows gray placeholder tiles with letters.

## Quick Fix (3 Steps)

### 1. Create the Storage Bucket

**Via Supabase Dashboard** (Recommended):

1. Go to https://supabase.com/dashboard/project/bsloiphxznbbwfntuxmu/storage/buckets
2. Click **"New bucket"**
3. Settings:
   - Name: `listing-images`
   - **Public bucket**: ✅ MUST BE CHECKED
   - Allowed MIME types: `image/png, image/jpeg, image/jpg, image/webp`
   - File size limit: `50 MB`
4. Click **"Create bucket"**

**Why public?** The picker images must be accessible without authentication for the homepage to load them.

### 2. Upload the Picker Images

Run this command from your project root:

```bash
npm run upload-picker-images
```

This uploads 9 placeholder PNG files (80x80, gray background with letter):
- **Themes**: grandeur (G), sci-fi (S), myth (M), conflict (C), classified (X)
- **Eras**: origins (O), classical (C), recent-past (R), future (F)

### 3. Verify the Fix

**A. Run diagnostic script:**
```bash
npx tsx scripts/diagnose-picker-images.ts
```

**B. Test a URL directly:**
```
https://bsloiphxznbbwfntuxmu.supabase.co/storage/v1/object/public/listing-images/picker/themes/grandeur.png
```

**C. Check the homepage:**
1. Start dev server: `npm run dev`
2. Open homepage
3. Click the "Where" or "When" field
4. Picker images should load (not gray placeholders)

## How It Works

### Code Flow

1. **Component.tsx** (Homepage):
   ```ts
   const pickerStorageBaseUrl = useMemo(() => {
     const url = import.meta.env.VITE_SUPABASE_URL;
     return `${url}/storage/v1/object/public/listing-images/picker`;
   }, []);
   ```

2. **homepage-filters.ts**:
   ```ts
   function themeImageUrl(pickerBase: string | null, id: string): string {
     return pickerBase ? `${pickerBase}/themes/${id}.png` : placeholderImage(letter);
   }
   ```

3. **ThemePicker/EraPicker**:
   ```tsx
   <img
     src={item.imageUrl}  // Supabase URL
     onError={(e) => {
       // Falls back to inline SVG if image fails to load
       const svg = `<svg>...</svg>`;
       e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
     }}
   />
   ```

## Storage Structure

After setup, your Supabase Storage should look like:

```
listing-images/  ← PUBLIC BUCKET
└── picker/
    ├── themes/
    │   ├── grandeur.png      (80x80, "G")
    │   ├── sci-fi.png        (80x80, "S")
    │   ├── myth.png          (80x80, "M")
    │   ├── conflict.png      (80x80, "C")
    │   └── classified.png    (80x80, "X")
    └── eras/
        ├── origins.png       (80x80, "O")
        ├── classical.png     (80x80, "C")
        ├── recent-past.png   (80x80, "R")
        └── future.png        (80x80, "F")
```

## Troubleshooting

### Images still show placeholders after upload:

**1. Bucket not public:**
- Go to Storage → listing-images → Settings
- Ensure "Public bucket" toggle is ON
- If OFF, enable it and re-upload images

**2. Wrong Supabase URL in .env.local:**
```bash
# Check your .env.local has:
VITE_SUPABASE_URL=https://bsloiphxznbbwfntuxmu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_i_X_v5v_loyrYkMphwIoPQ_5TNdcvNB
```

**3. Browser cache:**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
- Or open DevTools → Network tab → Disable cache

**4. CORS issues (rare):**
- Check browser console for CORS errors
- If present, add CORS policy in Supabase Dashboard → Storage → Policies

### Can't create bucket (permission error):

The `VITE_SUPABASE_ANON_KEY` doesn't have permission to create buckets. You must:
1. Create the bucket manually via Dashboard (step 1 above), OR
2. Use a service role key (not recommended for client apps)

### Want to replace placeholders with real images:

1. Create/design your theme and era images (recommend 80x80 or larger)
2. Upload them to the same paths in Supabase Storage
3. Use the Supabase Dashboard: Storage → listing-images → picker → Upload
4. Or update `scripts/upload-picker-images.ts` to upload your custom images

## Files Involved

- `src/components/generated/Component.tsx` - Homepage, constructs base URL
- `src/lib/homepage-filters.ts` - Builds full image URLs
- `src/design-system/patterns/ThemePicker/ThemePicker.tsx` - Theme picker component
- `src/design-system/patterns/EraPicker/EraPicker.tsx` - Era picker component
- `scripts/upload-picker-images.ts` - Upload script
- `scripts/diagnose-picker-images.ts` - Diagnostic tool
- `scripts/setup-storage-bucket.ts` - Bucket creation attempt (requires service key)

## Prevention

To avoid this in the future:
1. Document storage setup in deployment docs
2. Add bucket creation to onboarding/setup scripts
3. Include storage health check in CI/CD
4. Add fallback URLs in case Supabase is misconfigured
