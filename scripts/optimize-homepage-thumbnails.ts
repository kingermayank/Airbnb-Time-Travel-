import { createHash } from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env.local');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET = 'listing-images';
const WIDTH = 960;
const QUALITY = 80;
const REPORT_PATH = path.join(
  __dirname,
  '..',
  'tmp',
  'homepage-thumbnail-optimization.json',
);

interface ListingRow {
  id: string;
  title: string;
  main_image: string;
  thumbnail_image: string | null;
}

function safeBaseName(url: string): string {
  const parsed = new URL(url);
  return (
    path
      .basename(decodeURIComponent(parsed.pathname), path.extname(parsed.pathname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || 'cover'
  );
}

async function main(): Promise<void> {
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, main_image, thumbnail_image')
    .not('main_image', 'is', null)
    .order('title');

  if (error) throw error;

  const listings = data as ListingRow[];
  const results: Array<{
    id: string;
    title: string;
    oldUrl: string | null;
    newUrl: string;
    bytes: number;
    width: number;
    height: number;
  }> = [];

  for (const listing of listings) {
    const response = await fetch(listing.main_image, {
      signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) {
      throw new Error(`Failed to download ${listing.title}: HTTP ${response.status}`);
    }

    const source = Buffer.from(await response.arrayBuffer());
    const { data: optimized, info } = await sharp(source)
      .rotate()
      .resize({
        width: WIDTH,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: QUALITY,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer({ resolveWithObject: true });

    const hash = createHash('sha256')
      .update(listing.main_image)
      .update(optimized)
      .digest('hex')
      .slice(0, 12);
    const storagePath =
      `${listing.id}/home/${safeBaseName(listing.main_image)}-${hash}.webp`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, optimized, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload ${listing.title}: ${uploadError.message}`);
    }

    const newUrl = supabase.storage.from(BUCKET).getPublicUrl(storagePath).data
      .publicUrl;
    const { error: updateError } = await supabase
      .from('listings')
      .update({ thumbnail_image: newUrl })
      .eq('id', listing.id);

    if (updateError) {
      throw new Error(`Failed to update ${listing.title}: ${updateError.message}`);
    }

    results.push({
      id: listing.id,
      title: listing.title,
      oldUrl: listing.thumbnail_image,
      newUrl,
      bytes: optimized.byteLength,
      width: info.width,
      height: info.height,
    });

    console.log(
      `${listing.title}: ${info.width}x${info.height}, ` +
        `${Math.round(optimized.byteLength / 1024)} KB`,
    );
  }

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(REPORT_PATH, `${JSON.stringify(results, null, 2)}\n`);

  const totalBytes = results.reduce((sum, result) => sum + result.bytes, 0);
  console.log(
    `Optimized ${results.length} homepage thumbnails: ` +
      `${(totalBytes / 1024 / 1024).toFixed(2)} MB total`,
  );
  console.log(`Report: ${REPORT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
