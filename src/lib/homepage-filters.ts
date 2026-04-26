/**
 * Theme and era options for homepage Where/Era pickers.
 * IDs match DB values (listings.theme, listings.era).
 */

export interface ThemeOption {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface EraOption {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt?: string;
}

/** Inline SVG fallback when Supabase is not configured (80x80, gray with initial letter). */
function placeholderImage(label: string): string {
  const letter = label.charAt(0);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="32" font-family="system-ui,sans-serif">${letter}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function themeImageUrl(pickerBase: string | null, id: string, letter: string): string {
  if (!pickerBase) return placeholderImage(letter);

  // Map theme IDs to actual filenames in Filter/Themes/
  const filenameMap: Record<string, string> = {
    'grandeur': 'grandeur.png',
    'sci-fi': 'sci_fi.png',  // hyphen in ID, underscore in filename
    'myth': 'myth.png',
    'conflict': 'conflict.png',
    'classified': 'classified.png',
  };

  const filename = filenameMap[id] || `${id}.png`;
  return `${pickerBase}/Themes/${filename}`;
}

function eraImageUrl(pickerBase: string | null, id: string, letter: string): string {
  if (!pickerBase) return placeholderImage(letter);

  // Map era IDs to actual filenames in Filter/Era/
  const filenameMap: Record<string, string> = {
    'origins': 'origins.png',
    'classical': 'classical.png',
    'recent-past': 'recent_past.png',  // hyphen in ID, underscore in filename
    'future': 'future.png',
  };

  const filename = filenameMap[id] || `${id}.png`;
  return `${pickerBase}/Era/${filename}`;
}

const THEME_OPTIONS_DATA: Omit<ThemeOption, 'imageUrl'>[] = [
  { id: 'grandeur', title: 'Grandeur', subtitle: 'Where history flexed', imageAlt: 'Grandeur' },
  { id: 'sci-fi', title: 'Sci-Fi', subtitle: 'Tomorrow, already built', imageAlt: 'Sci-Fi' },
  { id: 'myth', title: 'Myth', subtitle: 'Some stories were never proven', imageAlt: 'Myth' },
  { id: 'conflict', title: 'Conflict', subtitle: 'Where everything changed', imageAlt: 'Conflict' },
  { id: 'classified', title: 'Classified', subtitle: 'Access requires clearance', imageAlt: 'Classified' },
];

const ERA_OPTIONS_DATA: Omit<EraOption, 'imageUrl'>[] = [
  { id: 'origins', title: 'Origins', subtitle: 'Pre-civilization', imageAlt: 'Origins' },
  { id: 'classical', title: 'Classical', subtitle: 'Empires, kingdoms, early societies', imageAlt: 'Classical' },
  { id: 'recent-past', title: 'Recent Past', subtitle: 'Familiar world, different rules', imageAlt: 'Recent Past' },
  { id: 'future', title: 'Future', subtitle: 'Post-present and speculative', imageAlt: 'Future' },
];

/** Build theme options with imageUrl from Supabase Storage when baseUrl is set (call from component so env is available). */
export function getThemeOptions(pickerStorageBaseUrl: string | null): ThemeOption[] {
  return THEME_OPTIONS_DATA.map((t) => ({
    ...t,
    imageUrl: themeImageUrl(pickerStorageBaseUrl, t.id, t.title.charAt(0)),
  }));
}

/** Build era options with imageUrl from Supabase Storage when baseUrl is set (call from component so env is available). */
export function getEraOptions(pickerStorageBaseUrl: string | null): EraOption[] {
  return ERA_OPTIONS_DATA.map((e) => ({
    ...e,
    imageUrl: eraImageUrl(pickerStorageBaseUrl, e.id, e.title.charAt(0)),
  }));
}

/** Theme options for Where picker (uses inline placeholder; use getThemeOptions(supabaseBase) in app for Supabase URLs). */
export const THEME_OPTIONS: ThemeOption[] = THEME_OPTIONS_DATA.map((t) => ({
  ...t,
  imageUrl: placeholderImage(t.title),
}));

/** Era options for Era picker (uses inline placeholder; use getEraOptions(supabaseBase) in app for Supabase URLs). */
export const ERA_OPTIONS: EraOption[] = ERA_OPTIONS_DATA.map((e) => ({
  ...e,
  imageUrl: placeholderImage(e.title),
}));

export function getThemeLabel(themeId: string | null | undefined): string | null {
  if (!themeId) return null;
  return THEME_OPTIONS.find((t) => t.id === themeId)?.title ?? null;
}

export function getEraLabel(eraId: string | null | undefined): string | null {
  if (!eraId) return null;
  return ERA_OPTIONS.find((e) => e.id === eraId)?.title ?? null;
}
