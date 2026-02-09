/**
 * Extracts the first frame of portal.mp4 as portal-poster.png for the Header Time Travel tab.
 * Requires ffmpeg on PATH. Run: npm run extract-portal-poster
 */
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const headerDir = path.resolve(__dirname, '../src/design-system/patterns/Header');
const videoPath = path.join(headerDir, 'portal.mp4');
const posterPath = path.join(headerDir, 'portal-poster.png');

try {
  execSync(
    `ffmpeg -y -i "${videoPath}" -vframes 1 -q:v 2 "${posterPath}"`,
    { stdio: 'inherit' }
  );
  console.log('Created portal-poster.png at', posterPath);
} catch (e) {
  console.error('Failed to extract frame. Is ffmpeg installed? Try: brew install ffmpeg');
  process.exit(1);
}
