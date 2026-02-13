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
 */
export function getTimeMeasurement(
  eraInfo: EraInfo,
  location: string | null,
  title: string
): TimeMeasurement {
  const locationLower = (location || '').toLowerCase();
  const titleLower = title.toLowerCase();

  // Location-based mappings (highest priority)
  
  // Ancient Egypt / Nile region
  if (locationLower.includes('egypt') || locationLower.includes('nile') || 
      titleLower.includes('egypt') || titleLower.includes('nile')) {
    return {
      type: 'nile_floods',
      label: 'Nile flood cycles',
      conversionRate: 1,
      suffix: 'hosting'
    };
  }

  // Japanese / Asian regions
  if (locationLower.includes('tokyo') || locationLower.includes('japan') || 
      locationLower.includes('china') || titleLower.includes('tokyo') ||
      titleLower.includes('japan') || titleLower.includes('cherry')) {
    return {
      type: 'cherry_blossoms',
      label: 'Cherry blossom seasons',
      conversionRate: 1,
      suffix: 'welcoming guests'
    };
  }

  // Desert regions
  if (locationLower.includes('desert') || locationLower.includes('sahara') ||
      locationLower.includes('arabia') || titleLower.includes('desert')) {
    return {
      type: 'sandstorms',
      label: 'Sandstorms',
      conversionRate: 25, // Creative: ~25 sandstorms per year
      suffix: 'experienced'
    };
  }

  // Space / Future / Mars / Moon
  if (eraInfo.category === 'future' || 
      titleLower.includes('mars') || titleLower.includes('moon') || 
      titleLower.includes('space') || titleLower.includes('lunar') ||
      titleLower.includes('star trek') || titleLower.includes('federation')) {
    return {
      type: 'solar_eclipses',
      label: 'Solar eclipses',
      conversionRate: 2, // Creative: ~2 per year
      suffix: 'survived'
    };
  }

  // Era-based mappings
  
  // Prehistoric / Stone Age
  if (eraInfo.category === 'prehistoric' || 
      (eraInfo.isBCE && eraInfo.year && eraInfo.year >= 10000) ||
      titleLower.includes('stone age') || titleLower.includes('cave') ||
      titleLower.includes('prehistoric')) {
    return {
      type: 'full_moons',
      label: 'Full moons',
      conversionRate: 12, // ~12 per year
      suffix: 'hosting'
    };
  }

  // Ancient periods (before 500 CE)
  if (eraInfo.category === 'ancient' && !eraInfo.isBCE && eraInfo.year && eraInfo.year < 500) {
    return {
      type: 'harvest_seasons',
      label: 'Harvest seasons',
      conversionRate: 1,
      suffix: 'welcoming guests'
    };
  }

  // Medieval periods (500-1500 CE)
  if (eraInfo.category === 'medieval' || eraInfo.category === 'renaissance') {
    return {
      type: 'harvest_seasons',
      label: 'Harvest seasons',
      conversionRate: 1,
      suffix: 'welcoming guests'
    };
  }

  // Modern periods (1500-2100 CE)
  if (eraInfo.category === 'modern') {
    return {
      type: 'harvest_seasons',
      label: 'Harvest seasons',
      conversionRate: 1,
      suffix: 'welcoming guests'
    };
  }

  // Default fallback
  return {
    type: 'full_moons',
    label: 'Full moons',
    conversionRate: 12,
    suffix: 'hosting'
  };
}

/**
 * Converts years to era-appropriate measurement count
 */
export function convertYearsToMeasurement(years: number, measurement: TimeMeasurement): number {
  // Ensure minimum of 1 year
  const actualYears = Math.max(1, years);
  
  // Calculate count based on conversion rate
  const count = Math.round(actualYears * measurement.conversionRate);
  
  // Ensure minimum count of 1
  return Math.max(1, count);
}

/**
 * Formats hosting duration with era-appropriate time measurement
 * Returns an object with the count and the full text
 */
export function formatEraAppropriateDuration(
  joinDate: string | null,
  listing: ListingDetails
): { count: number; text: string; fullText: string } {
  if (!joinDate) {
    // Default fallback
    const defaultMeasurement: TimeMeasurement = {
      type: 'full_moons',
      label: 'Full moons',
      conversionRate: 12,
      suffix: 'hosting'
    };
    return {
      count: 12,
      text: `${defaultMeasurement.label} ${defaultMeasurement.suffix}`,
      fullText: `12 ${defaultMeasurement.label} ${defaultMeasurement.suffix}`
    };
  }

  // Calculate years from join_date
  const join = new Date(joinDate);
  const now = new Date();
  const years = Math.max(1, now.getFullYear() - join.getFullYear());

  // Detect era from listing date
  const eraInfo = detectEraFromDate(listing.date);

  // Get appropriate measurement
  const measurement = getTimeMeasurement(
    eraInfo,
    listing.location_description,
    listing.title
  );

  // Convert years to measurement count
  const count = convertYearsToMeasurement(years, measurement);

  // Format text
  const text = `${measurement.label} ${measurement.suffix}`;
  const fullText = `${count} ${text}`;

  return { count, text, fullText };
}
