import Replicate from 'replicate';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '..', '.env.local') });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function test() {
  console.log('Testing Flux Schnell for comparison...');

  // Test with Flux Schnell first (we know this works)
  const fluxOutput = await replicate.run(
    'black-forest-labs/flux-schnell',
    {
      input: {
        prompt: 'A beautiful underwater coral reef scene with colorful fish, photorealistic, 16:9 aspect ratio',
        num_outputs: 1,
        aspect_ratio: '16:9',
        output_format: 'webp',
        output_quality: 90,
      },
    }
  );

  console.log('Flux Output type:', typeof fluxOutput);
  console.log('Flux Is array:', Array.isArray(fluxOutput));
  console.log('Flux Output:', fluxOutput);

  if (Array.isArray(fluxOutput) && fluxOutput.length > 0) {
    console.log('✅ Flux Schnell works! URL:', fluxOutput[0]);
  }
}

test().catch(console.error);
