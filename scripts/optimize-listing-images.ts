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
const TARGET_WIDTHS = [2400, 2200, 2000, 1920];
const WEBP_QUALITIES = [82, 78, 74, 70, 66, 62, 58];
const MAX_BYTES = 500 * 1024;
const CONCURRENCY = 3;
const REPORT_DIR = path.join(__dirname, '..', 'tmp', 'listing-image-optimization');
const MANIFEST_PATH = path.join(REPORT_DIR, 'manifest.json');
let manifestWriteQueue = Promise.resolve();

interface ListingRow {
  id: string;
  title: string;
  main_image: string;
}

interface ListingImageRow {
  id: string;
  listing_id: string;
  image_url: string;
  image_order: number;
  caption: string | null;
}

interface AssetPlan {
  listingId: string;
  listingTitle: string;
  oldUrl: string;
  rowIds: string[];
  storagePath: string;
}

interface ManifestAsset extends AssetPlan {
  newUrl: string;
  originalBytes: number;
  optimizedBytes: number;
  originalWidth: number;
  originalHeight: number;
  optimizedWidth: number;
  optimizedHeight: number;
  quality: number;
  uploadedAt: string;
}

interface Manifest {
  version: 1;
  generatedAt: string;
  databaseAppliedAt?: string;
  assets: Record<string, ManifestAsset>;
}

function assetKey(listingId: string, oldUrl: string): string {
  return `${listingId}:${oldUrl}`;
}

function formatBytes(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

function safeBaseName(url: string): string {
  let baseName = 'image';
  try {
    const parsed = new URL(url);
    baseName = path.basename(decodeURIComponent(parsed.pathname), path.extname(parsed.pathname));
  } catch {
    baseName = path.basename(url, path.extname(url));
  }

  return (
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'image'
  );
}

function storagePathFor(listingId: string, oldUrl: string): string {
  const hash = createHash('sha256').update(oldUrl).digest('hex').slice(0, 10);
  return `${listingId}/display/${safeBaseName(oldUrl)}-${hash}.webp`;
}

async function loadManifest(): Promise<Manifest> {
  await fs.mkdir(REPORT_DIR, { recursive: true });

  try {
    const contents = await fs.readFile(MANIFEST_PATH, 'utf8');
    return JSON.parse(contents) as Manifest;
  } catch {
    return {
      version: 1,
      generatedAt: new Date().toISOString(),
      assets: {},
    };
  }
}

async function saveManifest(manifest: Manifest): Promise<void> {
  const contents = `${JSON.stringify(manifest, null, 2)}\n`;
  manifestWriteQueue = manifestWriteQueue.then(() =>
    fs.writeFile(MANIFEST_PATH, contents),
  );
  await manifestWriteQueue;
}

async function downloadImage(url: string): Promise<Buffer> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(45_000) });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }

  throw new Error(`Failed to download ${url}: ${String(lastError)}`);
}

async function createDisplayImage(source: Buffer): Promise<{
  buffer: Buffer;
  originalWidth: number;
  originalHeight: number;
  optimizedWidth: number;
  optimizedHeight: number;
  quality: number;
}> {
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Image dimensions could not be read');
  }

  let best:
    | {
        buffer: Buffer;
        width: number;
        height: number;
        quality: number;
      }
    | undefined;

  for (const requestedWidth of TARGET_WIDTHS) {
    const width = Math.min(requestedWidth, metadata.width);

    for (const quality of WEBP_QUALITIES) {
      const { data, info } = await sharp(source)
        .rotate()
        .resize({
          width,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality,
          effort: 6,
          smartSubsample: true,
        })
        .toBuffer({ resolveWithObject: true });

      best = {
        buffer: data,
        width: info.width,
        height: info.height,
        quality,
      };

      if (data.byteLength <= MAX_BYTES) {
        return {
          buffer: data,
          originalWidth: metadata.width,
          originalHeight: metadata.height,
          optimizedWidth: info.width,
          optimizedHeight: info.height,
          quality,
        };
      }
    }
  }

  if (!best) {
    throw new Error('Could not create an optimized WebP');
  }

  return {
    buffer: best.buffer,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    optimizedWidth: best.width,
    optimizedHeight: best.height,
    quality: best.quality,
  };
}

async function uploadImage(storagePath: string, buffer: Buffer): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
  }

  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

async function buildPlan(): Promise<{
  listings: ListingRow[];
  imageRows: ListingImageRow[];
  assets: AssetPlan[];
}> {
  const [listingsResult, imagesResult] = await Promise.all([
    supabase
      .from('listings')
      .select('id, title, main_image')
      .not('main_image', 'is', null)
      .order('title'),
    supabase
      .from('listing_images')
      .select('id, listing_id, image_url, image_order, caption')
      .order('listing_id')
      .order('image_order'),
  ]);

  if (listingsResult.error) throw listingsResult.error;
  if (imagesResult.error) throw imagesResult.error;

  const listings = listingsResult.data as ListingRow[];
  const imageRows = imagesResult.data as ListingImageRow[];
  const plans = new Map<string, AssetPlan>();

  for (const listing of listings) {
    const listingRows = imageRows.filter((row) => row.listing_id === listing.id);
    const urls = new Set([
      listing.main_image,
      ...listingRows.map((row) => row.image_url),
    ]);

    for (const oldUrl of urls) {
      if (!oldUrl || oldUrl.includes(`/${listing.id}/display/`)) continue;

      const key = assetKey(listing.id, oldUrl);
      plans.set(key, {
        listingId: listing.id,
        listingTitle: listing.title,
        oldUrl,
        rowIds: listingRows
          .filter((row) => row.image_url === oldUrl)
          .map((row) => row.id),
        storagePath: storagePathFor(listing.id, oldUrl),
      });
    }
  }

  return {
    listings,
    imageRows,
    assets: [...plans.values()],
  };
}

async function processAssets(
  assets: AssetPlan[],
  manifest: Manifest,
): Promise<void> {
  let nextIndex = 0;
  let completed = assets.filter((asset) =>
    Boolean(manifest.assets[assetKey(asset.listingId, asset.oldUrl)]),
  ).length;

  async function worker(): Promise<void> {
    while (nextIndex < assets.length) {
      const index = nextIndex;
      nextIndex += 1;
      const asset = assets[index];
      const key = assetKey(asset.listingId, asset.oldUrl);

      if (manifest.assets[key]) {
        continue;
      }

      const source = await downloadImage(asset.oldUrl);
      const optimized = await createDisplayImage(source);
      const newUrl = await uploadImage(asset.storagePath, optimized.buffer);

      manifest.assets[key] = {
        ...asset,
        newUrl,
        originalBytes: source.byteLength,
        optimizedBytes: optimized.buffer.byteLength,
        originalWidth: optimized.originalWidth,
        originalHeight: optimized.originalHeight,
        optimizedWidth: optimized.optimizedWidth,
        optimizedHeight: optimized.optimizedHeight,
        quality: optimized.quality,
        uploadedAt: new Date().toISOString(),
      };
      completed += 1;
      await saveManifest(manifest);

      console.log(
        `[${completed}/${assets.length}] ${asset.listingTitle}: ` +
          `${formatBytes(source.byteLength)} -> ${formatBytes(optimized.buffer.byteLength)} ` +
          `(${optimized.optimizedWidth}x${optimized.optimizedHeight}, q${optimized.quality})`,
      );
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
}

async function applyDatabaseUpdates(
  listings: ListingRow[],
  manifest: Manifest,
): Promise<void> {
  const assets = Object.values(manifest.assets);

  for (const asset of assets) {
    for (const rowId of asset.rowIds) {
      const { error } = await supabase
        .from('listing_images')
        .update({ image_url: asset.newUrl })
        .eq('id', rowId);

      if (error) {
        throw new Error(`Could not update listing_images ${rowId}: ${error.message}`);
      }
    }
  }

  for (const listing of listings) {
    const replacement = manifest.assets[assetKey(listing.id, listing.main_image)];
    if (!replacement) continue;

    const { error } = await supabase
      .from('listings')
      .update({ main_image: replacement.newUrl })
      .eq('id', listing.id);

    if (error) {
      throw new Error(`Could not update main image for ${listing.title}: ${error.message}`);
    }
  }

  manifest.databaseAppliedAt = new Date().toISOString();
  await saveManifest(manifest);
}

async function verifyDatabase(): Promise<void> {
  const [listingsResult, imagesResult] = await Promise.all([
    supabase.from('listings').select('id, main_image'),
    supabase.from('listing_images').select('id, image_url'),
  ]);

  if (listingsResult.error) throw listingsResult.error;
  if (imagesResult.error) throw imagesResult.error;

  const missingMainImages = (
    listingsResult.data as Array<{ main_image: string }>
  ).filter((listing) => !listing.main_image.includes('/display/'));
  const missingImageRows = (
    imagesResult.data as Array<{ image_url: string }>
  ).filter((image) => !image.image_url.includes('/display/'));

  if (missingMainImages.length > 0 || missingImageRows.length > 0) {
    throw new Error(
      `Database verification failed: ${missingMainImages.length} main images and ` +
        `${missingImageRows.length} gallery images were not updated`,
    );
  }
}

async function main(): Promise<void> {
  const manifest = await loadManifest();
  const plan = await buildPlan();

  console.log(
    `Preparing ${plan.assets.length} unique display images across ` +
      `${plan.listings.length} listings.`,
  );
  console.log(`Rollback manifest: ${MANIFEST_PATH}`);

  await processAssets(plan.assets, manifest);

  const unprocessedAssets = plan.assets.filter(
    (asset) => !manifest.assets[assetKey(asset.listingId, asset.oldUrl)],
  );
  if (unprocessedAssets.length > 0) {
    throw new Error('Not all assets were processed; database URLs were not changed');
  }

  console.log('All display variants uploaded. Updating database references...');
  await applyDatabaseUpdates(plan.listings, manifest);
  await verifyDatabase();

  const assets = Object.values(manifest.assets);
  const originalBytes = assets.reduce((sum, asset) => sum + asset.originalBytes, 0);
  const optimizedBytes = assets.reduce((sum, asset) => sum + asset.optimizedBytes, 0);
  const overTarget = assets.filter((asset) => asset.optimizedBytes > MAX_BYTES);

  console.log('');
  console.log('Optimization complete.');
  console.log(`Images: ${assets.length}`);
  console.log(`Original total: ${(originalBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Optimized total: ${(optimizedBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(
    `Reduction: ${((1 - optimizedBytes / originalBytes) * 100).toFixed(1)}%`,
  );
  console.log(`Images over 500 KB: ${overTarget.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
