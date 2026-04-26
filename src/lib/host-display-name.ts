const DISPLAY_NAME_PREFIXES = new Set([
  'mr',
  'mrs',
  'ms',
  'miss',
  'dr',
  'prof',
  'sir',
  'lady',
  'lord',
  'captain',
  'admiral',
  'general',
  'king',
  'queen',
  'emperor',
  'empress',
  'prince',
  'princess',
  'duke',
  'duchess',
]);

function extractSingleDisplayName(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  // Skip title-like prefixes ("Lord", "Captain", etc.) and use the real given name.
  let index = 0;
  while (index < words.length - 1) {
    const normalizedWord = words[index].toLowerCase().replace(/[.,]/g, '');
    if (!DISPLAY_NAME_PREFIXES.has(normalizedWord)) break;
    index += 1;
  }

  return words[index] || words[0];
}

/**
 * Builds a host display name for compact UI surfaces.
 * Examples:
 * - "Lord Poseidon" -> "Poseidon"
 * - "Captain Edward Smith" -> "Edward"
 * - "Alexander the Great" -> "Alexander"
 * - "Hans & Sophie Hoffmann" -> "Hans & Sophie"
 */
export function getHostDisplayName(fullName: string): string {
  if (!fullName) return '';

  if (fullName.includes(' & ')) {
    return fullName
      .split(' & ')
      .map(extractSingleDisplayName)
      .join(' & ');
  }

  return extractSingleDisplayName(fullName);
}
