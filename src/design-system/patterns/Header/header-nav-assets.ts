/**
 * Single source for header nav icon URLs (Figma 307-4788).
 * Time Travel tab uses portal video (hover to play); optional poster from first frame.
 */
import mindscapesPng from './mindscapes.png';
import portalGreyMp4 from './portal_grey.mp4';

const FIGMA_ASSETS_BASE =
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets';

/** Legacy static icon; use PORTAL_VIDEO_URL + optional PORTAL_POSTER_URL for Time Travel tab. */
export const TIME_TRAVEL_ICON_URL = `${FIGMA_ASSETS_BASE}/9be8222d-7ffa-4c1a-a97f-6b3ed6400a37.png`;

export const MINDSCAPES_ICON_URL = mindscapesPng;

/** Video for Time Travel nav tab (hover to play, 5s loop). Run `npm run extract-portal-poster` for poster. */
export const PORTAL_VIDEO_URL = portalGreyMp4;

/** First-frame poster (optional). Create with: npm run extract-portal-poster (requires ffmpeg), then add: import portalPoster from './portal-poster.png'; export const PORTAL_POSTER_URL = portalPoster; */
export const PORTAL_POSTER_URL: string | undefined = undefined;
