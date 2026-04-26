import type { ListingDetails } from '../types/database';

/**
 * Era information extracted from listing date
 */
export interface EraInfo {
  category: 'ancient' | 'medieval' | 'renaissance' | 'modern' | 'future' | 'prehistoric' | 'unknown';
  year: number | null;
  isBCE: boolean;
}

/**
 * Time measurement configuration
 */
export interface TimeMeasurement {
  type: 'full_moons' | 'harvest_seasons' | 'nile_floods' | 'solar_eclipses' |
        'sandstorms' | 'cherry_blossoms' | 'default';
  label: string;
  conversionRate: number; // per year
  suffix: string; // e.g., "hosting", "welcoming guests", "survived", "experienced"
}

// ============================================================================
// HARDCODED HOSTING DURATIONS — Standardized to years with select outliers
// ============================================================================

const HOSTING_DURATIONS: Record<string, { count: string; label: string }> = {
  // Original 9 listings
  "Shah Jahan's Marble Suite, Agra":       { count: '376',    label: 'Years hosting' },
  'Mars Colony Pod, Olympus Mons':          { count: '5',      label: 'Years hosting' },
  'Crystal Villa, Atlantis':                { count: '11,600', label: 'Years hosting' },
  'First-Class Suite, RMS Titanic':         { count: '114',    label: 'Years hosting' },
  'Resistance Safehouse Loft, Berlin':      { count: '83',     label: 'Years hosting' },
  'Floating Mountain Bungalow, Pandora':    { count: '8',      label: 'Years hosting' },
  'Nile Villa, Ancient Egypt':              { count: '4,676',  label: 'Years hosting' },
  "Alexander's Campaign Tent, Persia":      { count: '2,356',  label: 'Years hosting' },
  'Manhattan Loft, New York':               { count: '31',     label: 'Years hosting' },

  // Phase 4 listings
  'Lunar Hilton Penthouse, Moon':           { count: '67',     label: 'Years hosting' },
  'Federation Ambassador Suite, Earth':     { count: '3',      label: 'Stardates hosting' },  // Outlier: Star Trek uses stardates
  'Research Platform, Bermuda Triangle':    { count: '???',    label: 'Years hosting (probably)' },  // Outlier: time is broken
  'Classified Barracks, Area 51':           { count: '[REDACTED]', label: 'Years hosting' },  // Outlier: classified
  'Cave Dwelling, Lascaux':                 { count: '17,026', label: 'Moons hosting' },  // Outlier: Grok doesn't know what a year is
  'Neo-Showa Capsule Pod, Parallel Tokyo':  { count: '3',      label: 'Years hosting' },
};

/**
 * Detects era category from listing date string
 * Handles formats like: "1650 CE", "c. 9600 BCE", "2154 CE", "15,000 BCE"
 */
export function detectEraFromDate(date: string | null): EraInfo {
  if (!date) {
    return { category: 'unknown', year: null, isBCE: false };
  }

  const dateLower = date.toLowerCase().trim();

  // Check if BCE
  const isBCE = dateLower.includes('bce') || dateLower.includes('bc');

  // Extract year number (handle formats like "c. 9600", "15,000", "1650")
  const yearMatch = date.match(/(\d{1,2}[,\d]*)/);
  let year: number | null = null;

  if (yearMatch) {
    const yearStr = yearMatch[1].replace(/,/g, '');
    year = parseInt(yearStr, 10);
  }

  // Determine era category
  let category: EraInfo['category'] = 'unknown';

  if (year === null) {
    category = 'unknown';
  } else if (isBCE) {
    if (year >= 10000) {
      category = 'prehistoric';
    } else if (year >= 3000) {
      category = 'ancient';
    } else {
      category = 'ancient';
    }
  } else {
    // CE dates
    if (year > 2100) {
      category = 'future';
    } else if (year >= 1500) {
      category = 'modern';
    } else if (year >= 1000) {
      category = 'renaissance';
    } else if (year >= 500) {
      category = 'medieval';
    } else {
      category = 'ancient';
    }
  }

  return { category, year, isBCE };
}

/**
 * Determines appropriate time measurement based on era, location, and title
 * (Legacy — kept for backward compatibility but no longer used by main path)
 */
export function getTimeMeasurement(
  eraInfo: EraInfo,
  location: string | null,
  title: string
): TimeMeasurement {
  const locationLower = (location || '').toLowerCase();
  const titleLower = title.toLowerCase();

  if (locationLower.includes('egypt') || locationLower.includes('nile') ||
      titleLower.includes('egypt') || titleLower.includes('nile')) {
    return { type: 'nile_floods', label: 'Nile flood cycles', conversionRate: 1, suffix: 'hosting' };
  }

  if (locationLower.includes('tokyo') || locationLower.includes('japan') ||
      locationLower.includes('china') || titleLower.includes('tokyo') ||
      titleLower.includes('japan') || titleLower.includes('cherry')) {
    return { type: 'cherry_blossoms', label: 'Cherry blossom seasons', conversionRate: 1, suffix: 'welcoming guests' };
  }

  if (eraInfo.category === 'future' ||
      titleLower.includes('mars') || titleLower.includes('moon') ||
      titleLower.includes('space') || titleLower.includes('lunar') ||
      titleLower.includes('star trek') || titleLower.includes('federation')) {
    return { type: 'solar_eclipses', label: 'Solar eclipses', conversionRate: 2, suffix: 'survived' };
  }

  if (eraInfo.category === 'prehistoric' ||
      (eraInfo.isBCE && eraInfo.year && eraInfo.year >= 10000) ||
      titleLower.includes('stone age') || titleLower.includes('cave') ||
      titleLower.includes('prehistoric')) {
    return { type: 'full_moons', label: 'Full moons', conversionRate: 12, suffix: 'hosting' };
  }

  // Default
  return { type: 'harvest_seasons', label: 'Harvest seasons', conversionRate: 1, suffix: 'welcoming guests' };
}

/**
 * Converts years to era-appropriate measurement count
 * (Legacy — kept for backward compatibility but no longer used by main path)
 */
export function convertYearsToMeasurement(years: number, measurement: TimeMeasurement): number {
  const actualYears = Math.max(1, years);
  const count = Math.round(actualYears * measurement.conversionRate);
  return Math.max(1, count);
}

/**
 * Formats hosting duration using hardcoded per-listing values.
 * Standardized to "Years hosting" with select themed outliers:
 * - Federation: "Stardates hosting" (Star Trek)
 * - Cave Dwelling: "Moons hosting" (Grok doesn't know years)
 * - Bermuda Triangle: "???" (time is broken)
 * - Area 51: "[REDACTED]" (classified)
 */
export function formatEraAppropriateDuration(
  joinDate: string | null,
  listing: ListingDetails
): { count: string; text: string; fullText: string } {
  // Look up hardcoded duration by listing title
  const hardcoded = HOSTING_DURATIONS[listing.title];

  if (hardcoded) {
    return {
      count: hardcoded.count,
      text: hardcoded.label,
      fullText: `${hardcoded.count} ${hardcoded.label}`,
    };
  }

  // Fallback for any listing not in the lookup
  if (joinDate) {
    const join = new Date(joinDate);
    const now = new Date();
    const years = Math.max(1, now.getFullYear() - join.getFullYear());
    return {
      count: String(years),
      text: 'Years hosting',
      fullText: `${years} Years hosting`,
    };
  }

  // Ultimate fallback
  return {
    count: '1',
    text: 'Years hosting',
    fullText: '1 Years hosting',
  };
}
