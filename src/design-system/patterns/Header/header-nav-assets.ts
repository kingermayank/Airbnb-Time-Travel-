/**
 * Single source for header nav icon URLs (Figma 307-4788).
 * Time Travel tab uses static portal door image.
 */
import mindscapesPng from './mindscapes.png';
import portalDoorPng from './portal_door.png';

const FIGMA_ASSETS_BASE =
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets';

/** Legacy static icon URL (external); prefer PORTAL_ICON_URL for Time Travel tab. */
export const TIME_TRAVEL_ICON_URL = `${FIGMA_ASSETS_BASE}/9be8222d-7ffa-4c1a-a97f-6b3ed6400a37.png`;

export const MINDSCAPES_ICON_URL = mindscapesPng;

/** Static image for Time Travel nav tab (portal door). */
export const PORTAL_ICON_URL = portalDoorPng;
