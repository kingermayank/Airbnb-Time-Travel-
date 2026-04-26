/**
 * Listing-specific loading messages for the "Confirm and Warp" transaction state.
 * Messages are mapped by keyword match against listing title.
 * Deadpan, corporate-sincere humor — treat absurd things as completely normal.
 */

interface LoadingMessageSet {
  /** Keywords to match against listing title (case-insensitive) */
  keywords: string[];
  /** Array of funny status messages to cycle through */
  messages: string[];
}

const LISTING_MESSAGE_SETS: LoadingMessageSet[] = [
  {
    keywords: ['cave', 'dwelling'],
    messages: [
      'Confirming the dinosaurs are indeed that big…',
      'Negotiating fire usage rights with neighboring tribe…',
      'Checking mammoth fur bedding for allergens…',
      'Translating your reservation into cave paintings…',
      'Verifying wheel has been invented at destination…',
      'Calibrating temporal coordinates to pre-extinction…',
    ],
  },
  {
    keywords: ['atlantean', 'atlantis', 'crystal villa'],
    messages: [
      'Locating Atlantis (this takes a moment)…',
      'Checking waterproofing on your luggage…',
      'Verifying city hasn\'t sunk yet at your dates…',
      'Confirming crystal energy grid is operational…',
      'Adjusting cabin pressure for underwater arrival…',
      'Running background check with Poseidon…',
    ],
  },
  {
    keywords: ['manhattan', '1990s', 'loft'],
    messages: [
      'Rewinding to dial-up internet speeds…',
      'Queuing your Blockbuster rentals…',
      'Confirming Seinfeld is still airing at destination…',
      'Pre-loading your AOL Instant Messenger buddy list…',
      'Adjusting your expectations for pizza prices…',
      'Verifying rent is still under four figures…',
    ],
  },
  {
    keywords: ['alexander', 'great', 'campaign tent'],
    messages: [
      'Plotting coordinates across the Persian Empire…',
      'Confirming Alexander is in a good mood today…',
      'Securing your spot outside the warpath…',
      'Checking if Bucephalus has been fed…',
      'Translating your booking into Ancient Greek…',
      'Packing period-appropriate armor just in case…',
    ],
  },
  {
    keywords: ['shah jahan', 'marble suite', 'taj mahal'],
    messages: [
      'Polishing 20,000 marble surfaces for your arrival…',
      'Confirming precious gem count in your suite…',
      'Coordinating with 22,000 laborers on check-in time…',
      'Verifying moonlight viewing conditions…',
      'Calibrating symmetry of all onion domes…',
      'Arranging your complimentary Mughal feast…',
    ],
  },
  {
    keywords: ['spacex', 'mars', 'colony', 'olympus mons'],
    messages: [
      'Pressurizing habitat module…',
      'Confirming Elon hasn\'t moved the colony again…',
      'Calculating optimal Hohmann transfer window…',
      'Loading Mars soil samples for your welcome basket…',
      'Running pre-flight check on oxygen recyclers…',
      'Verifying your booking wasn\'t overwritten by a firmware update…',
    ],
  },
  {
    keywords: ['titanic', 'first-class'],
    messages: [
      'Verifying iceberg-free itinerary…',
      'Polishing the first-class silverware…',
      'Confirming your lifeboat reservation (we learned from last time)…',
      'Loading string quartet playlist…',
      'Calibrating departure from Southampton dock…',
      'Running structural integrity scan (just in case)…',
    ],
  },
  {
    keywords: ['pandora', 'floating', 'mountain', 'bungalow'],
    messages: [
      'Establishing neural link with local flora…',
      'Confirming floating mountain hasn\'t drifted since listing…',
      'Loading Na\'vi phrasebook to your device…',
      'Scanning for hostile wildlife in bungalow radius…',
      'Verifying unobtanium reserves in your area…',
      'Calibrating banshee landing pad for your arrival…',
    ],
  },
  {
    keywords: ['ancient egyptian', 'nile', 'egypt'],
    messages: [
      'Consulting the pharaoh\'s booking calendar…',
      'Verifying Nile flood levels for your dates…',
      'Arranging complimentary hieroglyphic room service menu…',
      'Confirming cats are well-fed and worshipped…',
      'Calibrating sundial for accurate check-in time…',
      'Running a quick curse check on your assigned chamber…',
    ],
  },
  {
    keywords: ['lunar', 'hilton', 'penthouse', 'moon'],
    messages: [
      'Confirming Earth is still visible from penthouse window…',
      'Adjusting artificial gravity to comfortable levels…',
      'Running vacuum seal check on all airlocks…',
      'Loading lunar rover for your complimentary crater tour…',
      'Syncing check-in time across Earth and Moon timezones…',
      'Verifying your reservation wasn\'t double-booked by astronauts…',
    ],
  },
  {
    keywords: ['neo-showa', 'capsule', 'tokyo', '2087'],
    messages: [
      'Downloading parallel dimension translation firmware…',
      'Confirming capsule hasn\'t phased into alternate timeline…',
      'Loading neon-drenched city ambiance playlist…',
      'Checking holographic room service interface…',
      'Verifying your biometric profile with Neo-Tokyo immigration…',
      'Syncing your neural interface to local network…',
    ],
  },
  {
    keywords: ['area 51'],
    messages: [
      'Bribing security clearance officer…',
      'Disguising you as a government contractor…',
      'Confirming aliens are in a good mood today…',
      'Loading cover story into your fake badge…',
      'Scanning for surveillance drones in arrival zone…',
      'Verifying your NDA is signed in triplicate…',
    ],
  },
  {
    keywords: ['bermuda triangle'],
    messages: [
      'Attempting to locate the Bermuda Triangle (ironic, we know)…',
      'Running a quick disappearance risk assessment…',
      'Calibrating compass (it won\'t work, but it\'s tradition)…',
      'Confirming you\'ve updated your emergency contacts…',
      'Loading last known coordinates of previous guests…',
      'Verifying your travel insurance covers "unexplained vanishing"…',
    ],
  },
  {
    keywords: ['federation', 'ambassador', 'star trek'],
    messages: [
      'Requesting docking clearance from Starfleet Command…',
      'Replicating fresh towels in your quarters…',
      'Running diagnostic on holodeck recreational programs…',
      'Confirming universal translator is calibrated…',
      'Loading Federation diplomatic protocols to your PADD…',
      'Verifying Klingon guests have checked out of adjacent suite…',
    ],
  },
  {
    keywords: ['wwii', 'world war', 'german resistance', 'safehouse'],
    messages: [
      'Encrypting your arrival coordinates…',
      'Confirming safehouse hasn\'t been compromised…',
      'Loading period-appropriate identity documents…',
      'Verifying radio frequencies for your check-in window…',
      'Calibrating temporal insertion to avoid patrols…',
      'Running cover story plausibility check…',
    ],
  },
];

/** Fallback messages used when no listing-specific match is found */
const FALLBACK_MESSAGES = [
  'Calculating temporal coordinates…',
  'Stabilizing wormhole aperture…',
  'Running paradox probability assessment…',
  'Confirming timeline integrity at destination…',
  'Calibrating arrival window…',
  'Syncing your reservation across timelines…',
];

/**
 * Get loading messages relevant to a specific listing.
 * Matches against listing title using keywords.
 */
export function getWarpLoadingMessages(listingTitle: string): string[] {
  const lower = listingTitle.toLowerCase();
  for (const set of LISTING_MESSAGE_SETS) {
    if (set.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return set.messages;
    }
  }
  return FALLBACK_MESSAGES;
}

/**
 * Listing-specific background colors for the booking confirmation page.
 * All colors are light enough for black text — same lightness range as
 * the default cream rgba(243, 239, 236, 1).
 */
export function getConfirmationBackgroundColor(listingTitle: string): string {
  const lower = listingTitle.toLowerCase();

  // All 15 listings — each with a visibly distinct color.
  // Ordered to match the homepage sort order for easy reference.
  const colorMap: { keywords: string[]; color: string }[] = [
    { keywords: ['lost atlantean', 'crystal villa'],              color: 'rgba(214, 233, 244, 1)' },  // 1.  deep ocean mist — cool submerged blue
    { keywords: ['manhattan', '1990s', 'loft'],                   color: 'rgba(244, 235, 222, 1)' },  // 2.  90s brownstone — warm brick cream
    { keywords: ['alexander', 'campaign tent'],                   color: 'rgba(244, 233, 210, 1)' },  // 3.  Macedonian gold — warm desert sand
    { keywords: ['shah jahan', 'marble'],                         color: 'rgba(241, 230, 239, 1)' },  // 4.  blush marble — soft Mughal rose
    { keywords: ['spacex', 'mars', 'olympus'],                    color: 'rgba(242, 224, 214, 1)' },  // 5.  dusty Mars — terracotta pink
    { keywords: ['titanic'],                                      color: 'rgba(220, 233, 246, 1)' },  // 6.  Atlantic ice — cold steel blue
    { keywords: ['pandora', 'floating mountain'],                 color: 'rgba(216, 242, 228, 1)' },  // 7.  bioluminescent — vibrant emerald tint
    { keywords: ['ancient egyptian', 'nile'],                     color: 'rgba(246, 237, 213, 1)' },  // 8.  papyrus gold — warm Nile amber
    { keywords: ['lunar hilton', 'penthouse'],                    color: 'rgba(232, 232, 242, 1)' },  // 9.  lunar silver — cool gray-violet
    { keywords: ['neo-showa', 'capsule', 'tokyo'],                color: 'rgba(230, 224, 246, 1)' },  // 10. neon lavender — cyberpunk purple tint
    { keywords: ['area 51'],                                      color: 'rgba(224, 238, 222, 1)' },  // 11. military sage — muted olive green
    { keywords: ['bermuda'],                                      color: 'rgba(214, 242, 242, 1)' },  // 12. tropical teal — Caribbean aqua
    { keywords: ['federation', 'ambassador'],                     color: 'rgba(222, 228, 246, 1)' },  // 13. starfleet blue — command uniform
    { keywords: ['cave'],                                         color: 'rgba(236, 228, 214, 1)' },  // 14. cave sandstone — earthy warm ochre
    { keywords: ['wwii', 'world war', 'resistance', 'safehouse'], color: 'rgba(232, 230, 224, 1)' },  // 15. wartime gray — muted khaki
  ];

  for (const entry of colorMap) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry.color;
    }
  }

  return 'rgba(243, 239, 236, 1)'; // default cream
}
