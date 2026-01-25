# Image Upload Guide

## Quick Start

1. **Create Storage Bucket** (One-time setup)
   - Open Supabase Dashboard → SQL Editor
   - Copy and run the contents of `scripts/create-storage-bucket.sql`
   - This creates the `listing-images` bucket with proper permissions

2. **Upload Images**
   - Make sure your `.env.local` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Run: `npm run upload-images`
   - The script will automatically:
     - Find all folders in `images/`
     - Match them to listing IDs
     - Upload images to Supabase Storage
     - Insert records into the `listing_images` table

## Folder Structure

Your `images/` folder should look like this:

```
images/
├── Alexander the Great's tent/
│   ├── bedroom.jpg
│   ├── cover.jpg
│   ├── host.png
│   └── ...
├── Pandora avatar/
│   ├── Bedroom.png
│   ├── Cover.png
│   └── ...
└── ...
```

## How Folder Matching Works

The script matches folder names to listing IDs using keywords:

- **Shah Jahan**: `shah jahan`, `shah-jahan`, `agra`
- **SpaceX Mars**: `spacex`, `mars`, `olympus`
- **Atlantis**: `atlantis`, `atlantean`, `crystal`
- **Titanic**: `titanic`, `first-class`
- **WWII Safehouse**: `wwii`, `resistance`, `safehouse`, `berlin`
- **Pandora**: `pandora`, `avatar`, `floating`
- **Egyptian Villa**: `egyptian`, `nile`, `imhotep`, `memphis`
- **Alexander Tent**: `alexander`, `tent`, `campaign`
- **90s Manhattan**: `90s`, `manhattan`, `loft`, `soho`

## Image Ordering

Images are automatically ordered by filename:

1. `cover.*` or `main.*` → Order 1
2. `living room.*` → Order 2
3. `bedroom.*` → Order 3
4. `kitchen.*` → Order 4
5. `washroom.*`, `bathroom.*`, `restroom.*` → Order 5
6. `host.*` → Order 6
7. `outdoor.*` → Order 7
8. `rooftop.*` → Order 8
9. Other images → Order 100+

## Troubleshooting

### "Storage bucket not found"
- Run the SQL script in `scripts/create-storage-bucket.sql` first

### "No listing ID found for folder"
- Check that your folder name contains one of the keywords listed above
- The matching is case-insensitive and partial (e.g., "Shah Jahan's Marble Suite" matches "shah jahan")

### "Missing Supabase credentials"
- Make sure `.env.local` exists with:
  ```
  VITE_SUPABASE_URL=your_url
  VITE_SUPABASE_ANON_KEY=your_key
  ```

### Images not showing on frontend
- Check Supabase Dashboard → Storage → listing-images to verify uploads
- Check Supabase Dashboard → Table Editor → listing_images to verify database records
- Refresh your browser cache

## Re-uploading Images

The script is idempotent - you can run it multiple times:
- Existing images in storage will be overwritten (upsert)
- Existing database records will be updated with new order/caption
- New images will be added

## What Gets Created

1. **Storage**: Images uploaded to `listing-images/{listing-id}/{filename}`
2. **Database**: Records in `listing_images` table with:
   - `listing_id`: Links to the listing
   - `image_url`: Public URL from Supabase Storage
   - `image_order`: Display order (1, 2, 3...)
   - `caption`: Generated from filename

The frontend automatically fetches and displays these images on the listing detail page!

