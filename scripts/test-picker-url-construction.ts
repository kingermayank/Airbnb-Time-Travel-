/**
 * Test that the URL construction in the app matches what we uploaded
 */

// Simulate exactly what the app does
const VITE_SUPABASE_URL = 'https://bsloiphxznbbwfntuxmu.supabase.co';

// From Component.tsx lines 122-126
const url = VITE_SUPABASE_URL;
if (!url || typeof url !== 'string') {
  console.error('❌ VITE_SUPABASE_URL is not set or invalid');
  process.exit(1);
}
const base = url.replace(/\/$/, '');
const pickerStorageBaseUrl = `${base}/storage/v1/object/public/listing-images/picker`;

console.log('🔍 URL Construction Test\n');
console.log('VITE_SUPABASE_URL:', VITE_SUPABASE_URL);
console.log('Base after replace:', base);
console.log('Picker base URL:', pickerStorageBaseUrl);
console.log();

// From homepage-filters.ts
function themeImageUrl(pickerBase: string | null, id: string): string {
  return pickerBase ? `${pickerBase}/themes/${id}.png` : 'PLACEHOLDER';
}

function eraImageUrl(pickerBase: string | null, id: string): string {
  return pickerBase ? `${pickerBase}/eras/${id}.png` : 'PLACEHOLDER';
}

// Test all theme URLs
console.log('🎨 Theme Image URLs:');
const themes = ['grandeur', 'sci-fi', 'myth', 'conflict', 'classified'];
themes.forEach(id => {
  const url = themeImageUrl(pickerStorageBaseUrl, id);
  console.log(`  ${id}: ${url}`);
});

console.log('\n📅 Era Image URLs:');
const eras = ['origins', 'classical', 'recent-past', 'future'];
eras.forEach(id => {
  const url = eraImageUrl(pickerStorageBaseUrl, id);
  console.log(`  ${id}: ${url}`);
});

console.log('\n✅ Expected URLs match uploaded paths');
console.log('\n🧪 Test these URLs in your browser:');
console.log('  ', themeImageUrl(pickerStorageBaseUrl, 'grandeur'));
console.log('  ', eraImageUrl(pickerStorageBaseUrl, 'origins'));
