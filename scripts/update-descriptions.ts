import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// ============================================================================
// UPDATED LISTING DESCRIPTIONS — Funnier, more story-driven
// ============================================================================

const DESCRIPTION_UPDATES: Record<
  string,
  { full_description?: string; short_description?: string }
> = {
  // ── Lunar Hilton Penthouse, Moon (2156) ──
  'Lunar Hilton Penthouse, Moon': {
    short_description:
      'The solar system\'s most exclusive address. Dynasty-approved.',
    full_description: `Welcome to the Lunar Hilton — humanity's first off-world luxury hotel, est. 2089, and still the most exclusive address in the solar system. Yes, that solar system.

Your host, Charlotte Hilton-Musk VIII, is the eighth-generation heiress of the Hilton-Musk hospitality-aerospace dynasty, born from the fateful 2031 merger that nobody saw coming and everyone pretends to understand. Great-great-great-great-great-great-grandmother Paris would be SO proud. Or confused. Charlotte genuinely cannot fathom why anyone still lives on Earth. "The gravity is terrible for your hair," she says, without irony.

The penthouse offers unparalleled Earthrise views from the panoramic balcony — watching your home planet rise over the lunar horizon never gets old, though Charlotte insists it's "just okay." The 1/6 gravity jacuzzi is an experience: water forms floating blobs that drift lazily around you, and yes, you will giggle like a child. The low-gravity spa lets you literally bounce off the walls, which the staff has learned to frame as a feature rather than a liability.

Highlights include: the Apollo 11 landing site visible from your balcony (it's a gift shop now — obviously — selling overpriced freeze-dried ice cream and "I walked where Armstrong walked" t-shirts), a vintage 2089 moon rover for guest excursions, and a telescope powerful enough to see your house on Earth. If you squint. And your house is very large.

The robot butler accepts tips in cryptocurrency only (Charlotte's family policy since 2097). The replicator kitchen handles most meals, though pizza quality remains inconsistent — a problem humanity has been unable to solve across two planets. Charlotte may or may not respond to your messages. Generational wealth has made communication feel "optional." But the staff is impeccable, the thread count is dynasty-verified, and the evacuation pods have never been used. Emphasis on "never."`,
  },

  // ── Alexander's Campaign Tent, Persia (330 BCE) ──
  "Alexander's Campaign Tent, Persia": {
    short_description:
      'Sleep where empires were conquered. Wine cellar included.',
    full_description: `Fortune favors the bold! Join me in my campaign headquarters as we reshape the known world. This royal tent served as my command center during the conquest of the Persian Empire — within these silk-and-gold walls, strategies were devised that changed the course of history forever.

The main pavilion spans over 100 square feet and is constructed from the finest Macedonian leather and silk fabrics captured from King Darius himself. Persian carpets cover the floors (spoils of war, but very comfortable spoils), and the bronze panoply display features my personal armor — polished daily by my attendants, though I haven't needed it since Gaugamela.

The tactical war room still has the original campaign maps pinned to the walls. Feel free to study them, but please do not rearrange the pins — my generals get confused easily enough as it is. Aristotle's philosophy scrolls are available for evening reading. He was my tutor, so expect intellectual conversation around the campfire, where my personal chefs prepare roasted feasts nightly.

Bucephalus, my legendary warhorse, has his own grooming station adjacent to the cavalry stables. He is very particular about visitors — approach with an apple and respect. The Persian royal wine cellar was Darius's personal collection before it became mine. The vintage is exceptional. Darius had terrible military strategy but impeccable taste in wine.

Dawn training is available at the practice grounds, and my Elite Companion Guard provides 24-hour perimeter security. The only thing I haven't conquered is bad reviews — and I intend to keep it that way.`,
  },

  // ── Federation Ambassador Suite, Earth (2364) ──
  'Federation Ambassador Suite, Earth': {
    short_description:
      'Post-scarcity luxury. Everything is free. Sort of.',
    full_description: `Welcome to the 24th century, where humanity has evolved beyond money, war, and bad pizza. Well, two out of three — the food replicator still cannot quite nail pizza, and frankly, it's becoming a civilization-wide embarrassment.

This diplomatic suite at Starfleet Academy offers the finest accommodations the post-scarcity economy can provide. Everything is technically free, but you'll need cultural merit points for premium amenities. How do you earn them? Poetry readings. Don't ask why. Just prepare a sonnet.

The holodeck suite auto-suggests educational programs approximately every 45 minutes. You can say no, but it will judge you holographically. The transporter pad offers sightseeing access to any location on Earth — Paris, the Grand Canyon, the bottom of the Mariana Trench — all available at the push of a button, no jet lag included.

Your Vulcan neighbors in Suite 3B have requested quiet hours be enforced from 1800 to 0600. Your Klingon cultural attache on the other side has... different opinions about quiet hours. We recommend noise-canceling technology, available via the replicator (which, again, cannot make pizza but can apparently construct a perfect soundproofing device).

The universal translator implant handles all 6,000+ Federation languages in real-time, so feel free to mispronounce everything — it will fix it for you. The emergency beam-out protocol has been installed in every room, because even in paradise, sometimes you just need a quick exit.`,
  },
};

async function updateDescriptions() {
  console.log('🔍 Starting description updates...\n');

  for (const [title, updates] of Object.entries(DESCRIPTION_UPDATES)) {
    console.log(`📝 Updating: ${title}`);

    const { error } = await supabase
      .from('listings')
      .update(updates)
      .eq('title', title);

    if (error) {
      console.error(`   ❌ Error updating ${title}:`, error);
    } else {
      console.log(`   ✅ Updated ${title}`);
    }
  }

  console.log('\n✅ Description updates complete!');
}

updateDescriptions();
