/**
 * Upload REAL theme and era images to Supabase Storage
 * This replaces the placeholder letter images with actual images
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'listing-images';

// Map local filenames to Supabase storage paths
const THEME_MAPPINGS = [
  { local: 'grand.png', remote: 'picker/themes/grandeur.png' },
  { local: 'sci_fi.png', remote: 'picker/themes/sci-fi.png' },
  { local: 'mythic.png', remote: 'picker/themes/myth.png' },
  { local: 'conflict.png', remote: 'picker/themes/conflict.png' },
  { local: 'classified.png', remote: 'picker/themes/classified.png' },
];

const ERA_MAPPINGS = [
  { local: 'origins.png', remote: 'picker/eras/origins.png' },
  { local: 'classical.png', remote: 'picker/eras/classical.png' },
  { local: 'recent_past.png', remote: 'picker/eras/recent-past.png' },
  { local: 'future.png', remote: 'picker/eras/future.png' },
];

async function uploadImage(localPath: string, remotePath: string): Promise<void> {
  if (!fs.existsSync(localPath)) {
    console.error(`❌ Local file not found: ${localPath}`);
    return;
  }

  const fileBuffer = fs.readFileSync(localPath);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(remotePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true, // Replace existing placeholders
    });

  if (error) {
    console.error(`❌ ${remotePath}:`, error.message);
    return;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(remotePath);
  console.log(`✅ ${remotePath}`);
  console.log(`   ${data.publicUrl}`);
}

async function main() {
  console.log('🎨 Uploading REAL picker images to Supabase Storage...\n');

  const projectRoot = path.join(__dirname, '..');
  const themeDir = path.join(projectRoot, 'images', 'themes');
  const eraDir = path.join(projectRoot, 'images', 'era');

  console.log('📂 Theme images from:', themeDir);
  for (const mapping of THEME_MAPPINGS) {
    const localPath = path.join(themeDir, mapping.local);
    await uploadImage(localPath, mapping.remote);
  }

  console.log('\n📂 Era images from:', eraDir);
  for (const mapping of ERA_MAPPINGS) {
    const localPath = path.join(eraDir, mapping.local);
    await uploadImage(localPath, mapping.remote);
  }

  console.log('\n✅ Done! Refresh your browser to see the real images.');
  console.log('   (Hard refresh: Cmd+Shift+R or Ctrl+Shift+R)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
