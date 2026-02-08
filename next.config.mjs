import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Used by Storybook (nextjs-vite) and Next if needed. */
export default {
  outputFileTracingRoot: __dirname,
};
