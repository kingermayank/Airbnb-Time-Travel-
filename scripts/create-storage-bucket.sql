-- Create storage bucket for listing images
-- Run this in Supabase SQL Editor before uploading images

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all images
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload (or use service role key in script)
CREATE POLICY IF NOT EXISTS "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images' 
  AND auth.role() = 'authenticated'
);

-- Allow service role to upload (for the upload script)
CREATE POLICY IF NOT EXISTS "Service Role Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images'
);

-- Allow service role to update/delete
CREATE POLICY IF NOT EXISTS "Service Role Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'listing-images');

CREATE POLICY IF NOT EXISTS "Service Role Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'listing-images');

-- Verify bucket was created
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id = 'listing-images';

