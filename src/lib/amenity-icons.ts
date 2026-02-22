/**
 * Central mapping of amenity names to Lucide icons.
 * Only amenities that match a rule are considered "dedicated" (isDedicated: true).
 * The default fallback (Circle) is used when no rule matches; those amenities
 * should not be shown on the listing page.
 */

import {
  Wifi,
  UtensilsCrossed,
  Mountain,
  Activity,
  Wind,
  Car,
  Recycle,
  Droplets,
  Shield,
  Users,
  Bed,
  Eye,
  Gauge,
  Settings,
  ChefHat,
  Heart,
  Refrigerator,
  Thermometer,
  Circle,
  Gem,
  Waves,
  Fish,
  DoorOpen,
  Building2,
  BookOpen,
  Sparkles,
  Star,
  Lock,
  Zap,
  Clock,
  Globe,
  Tent,
  Leaf,
  Building,
  Armchair,
  PenLine,
  Anchor,
  Compass,
  DoorClosed,
  Bath,
  Dumbbell,
  ConciergeBell,
  Flame,
  Binoculars,
  AlertTriangle,
  Radio,
  Bot,
  Rocket,
  Cpu,
  Ban,
  Moon,
  XCircle,
  GaugeCircle,
  TreePine,
  Bird,
  Scroll,
  Sun,
  Tv,
  Swords,
  ShieldCheck,
  CalendarClock,
  Navigation,
  Palette,
  Crown,
  Feather,
  Ship,
  Utensils,
  Warehouse,
  ShoppingBag,
  Award,
  Landmark,
  GraduationCap,
  Music,
  Archive,
  Snowflake,
  // New icons for elevated amenities
  Telescope,
  Wine,
  Map,
  Phone,
  Gamepad2,
  PawPrint,
  Shell,
  CupSoda,
  Headphones,
  Keyboard,
  Brain,
  Monitor,
  type LucideIcon,
} from 'lucide-react';

export type AmenityIconResult = { Icon: LucideIcon; isDedicated: boolean };

function match(
  name: string,
  patterns: string[],
  icon: LucideIcon
): AmenityIconResult | null {
  const lower = name.toLowerCase();
  const matched = patterns.some((p) => lower.includes(p));
  return matched ? { Icon: icon, isDedicated: true } : null;
}

/**
 * Returns the Lucide icon and whether this amenity has a dedicated icon
 * (true = show on listing, false = do not show).
 */
export function getAmenityIcon(amenityName: string): AmenityIconResult {
  const name = amenityName.toLowerCase();

  // ── WiFi and connectivity ──
  const w = match(name, ['wifi', 'wi-fi', 'starlink', 'subspace', 'uplink', 'comms'], Wifi);
  if (w) return w;
  if (match(name, ['radio', 'shortwave'], Radio)) return { Icon: Radio, isDedicated: true };

  // ── New specific patterns (must come before generic fallbacks) ──
  if (match(name, ['telescope', 'stargazing', 'terraforming'], Telescope)) return { Icon: Telescope, isDedicated: true };
  if (match(name, ['wine cellar', 'wine'], Wine)) return { Icon: Wine, isDedicated: true };
  if (match(name, ['war room', 'street map', 'paper.*map'], Map)) return { Icon: Map, isDedicated: true };
  if (match(name, ['rotary phone', 'phone'], Phone)) return { Icon: Phone, isDedicated: true };
  if (match(name, ['lan party', 'gamepad'], Gamepad2)) return { Icon: Gamepad2, isDedicated: true };
  if (match(name, ['pixel-chan', 'sacred cat', 'paw'], PawPrint)) return { Icon: PawPrint, isDedicated: true };
  if (match(name, ['concierge shell', 'telepathic'], Shell)) return { Icon: Shell, isDedicated: true };
  if (match(name, ['vending machine', 'beverage option'], CupSoda)) return { Icon: CupSoda, isDedicated: true };
  if (match(name, ['boombox', 'mixtape'], Headphones)) return { Icon: Headphones, isDedicated: true };
  if (match(name, ['macintosh', 'green-phosphor', 'terminal'], Keyboard)) return { Icon: Keyboard, isDedicated: true };
  if (match(name, ['neural network', 'neural'], Brain)) return { Icon: Brain, isDedicated: true };
  if (match(name, ['vhs collection'], Monitor)) return { Icon: Monitor, isDedicated: true };

  // ── Building and atmosphere ──
  if (match(name, ['loft space', 'building', 'atmosphere'], Building2)) return { Icon: Building2, isDedicated: true };
  if (match(name, ['panoramic'], Eye)) return { Icon: Eye, isDedicated: true };
  if (match(name, ['three-knock', 'panoply'], ShieldCheck)) return { Icon: ShieldCheck, isDedicated: true };
  if (match(name, ['debriefing', 'hidden', 'compartment', 'secret'], Lock)) return { Icon: Lock, isDedicated: true };
  if (match(name, ['elite', 'guard post', 'imperial guard', 'radiation shielding', 'radiation-hardened', 'solid rock', 'life jacket'], Shield)) return { Icon: Shield, isDedicated: true };
  if (match(name, ['edwardian'], Settings)) return { Icon: Settings, isDedicated: true };
  if (match(name, ['iceberg spotting', 'weather balloon', 'hunting', 'grok'], Binoculars)) return { Icon: Binoculars, isDedicated: true };
  if (match(name, ['chandelier', 'bioluminescent', 'nightlight', 'holodeck', 'spirit journey'], Sparkles)) return { Icon: Sparkles, isDedicated: true };
  if (match(name, ['white-glove', 'steward'], ConciergeBell)) return { Icon: ConciergeBell, isDedicated: true };

  // ── Kitchen and food ──
  if (match(name, ['kitchen', 'galley', 'food synthesizer', 'feast', 'strudel', 'mess hall', 'cafeteria', 'replicator kitchen', 'food replicator', 'bread & beer'], UtensilsCrossed)) return { Icon: UtensilsCrossed, isDedicated: true };
  if (match(name, ['cryo-storage'], Refrigerator)) return { Icon: Refrigerator, isDedicated: true };
  if (match(name, ['chef', 'cooking'], ChefHat)) return { Icon: ChefHat, isDedicated: true };

  // ── Climate and environment ──
  if (match(name, ['air conditioning', 'climate', 'heating', 'heated floors', 'steam heating', 'radiator', 'crystal-powered climate'], Thermometer)) return { Icon: Thermometer, isDedicated: true };
  if (name.includes('life support')) return { Icon: Activity, isDedicated: true };
  if (name.includes('habitat')) return { Icon: Building2, isDedicated: true };
  if (name.includes('pressure')) return { Icon: Gauge, isDedicated: true };

  // ── Views and nature ──
  if (match(name, ['view', 'observation', 'panorama', 'balcony', 'blackout curtain', 'rain window', 'earthrise'], Eye)) return { Icon: Eye, isDedicated: true };
  if (match(name, ['mountain', 'floating patio', 'anti-gravity'], Mountain)) return { Icon: Mountain, isDedicated: true };
  if (match(name, ['underwater', 'ocean', 'marine', 'portal access'], Waves)) return { Icon: Waves, isDedicated: true };
  if (match(name, ['crystal', 'gem', 'orichalcum', 'gemstone', 'treasure chest'], Gem)) return { Icon: Gem, isDedicated: true };
  if (match(name, ['flora', 'native', 'plant', 'vine', 'living vine'], TreePine)) return { Icon: TreePine, isDedicated: true };
  if (match(name, ['wildlife', 'bird', 'woodsprite', 'banshee', 'peacock'], Bird)) return { Icon: Bird, isDedicated: true };

  // ── Space and technology ──
  if (match(name, ['rover', 'exploration', 'cavalry', 'stables'], Car)) return { Icon: Car, isDedicated: true };
  if (match(name, ['recycler', 'fabric'], Recycle)) return { Icon: Recycle, isDedicated: true };
  if (match(name, ['drying', 'thermal drying'], Sun)) return { Icon: Sun, isDedicated: true };
  if (name.includes('replicator access')) return { Icon: Cpu, isDedicated: true };
  if (name.includes('transporter')) return { Icon: Zap, isDedicated: true };
  if (match(name, ['robot', 'butler'], Bot)) return { Icon: Bot, isDedicated: true };
  if (match(name, ['evacuation', 'beam-out', 'escape', 'landing pad', 'ikran'], Rocket)) return { Icon: Rocket, isDedicated: true };

  // ── Historical and cultural ──
  if (match(name, ['resistance document', 'research log', 'poetry reading', 'educational program'], BookOpen)) return { Icon: BookOpen, isDedicated: true };
  if (match(name, ['artifact', 'museum', 'philosophy scroll', 'identity papers', 'technology museum'], Scroll)) return { Icon: Scroll, isDedicated: true };
  if (match(name, ['furnishing', '1940s', 'linen', 'persian linen', 'furs &'], Armchair)) return { Icon: Armchair, isDedicated: true };
  if (match(name, ['hieroglyphic', 'mural', 'painting', 'cave painting'], Palette)) return { Icon: Palette, isDedicated: true };
  if (match(name, ['nile', 'yamuna', 'river access', 'felucca', 'barge dock', 'life raft'], Anchor)) return { Icon: Anchor, isDedicated: true };
  if (match(name, ['courtyard', 'garden', 'grove', 'meditation', 'coral garden', 'foraging', 'berry'], Leaf)) return { Icon: Leaf, isDedicated: true };
  if (match(name, ['tour', 'guide', 'gallery guide', 'subway token'], Compass)) return { Icon: Compass, isDedicated: true };
  if (match(name, ['military', 'camp'], Tent)) return { Icon: Tent, isDedicated: true };
  if (match(name, ['covert', 'bookshelf entrance'], DoorClosed)) return { Icon: DoorClosed, isDedicated: true };
  if (match(name, ['training ground', 'swords', 'klingon', 'dawn training'], Swords)) return { Icon: Swords, isDedicated: true };
  if (match(name, ['canopy', 'royal', 'crown', 'silk & gold', 'persian silk'], Crown)) return { Icon: Crown, isDedicated: true };
  if (match(name, ['feather', 'pillow'], Feather)) return { Icon: Feather, isDedicated: true };
  if (match(name, ['promenade deck', 'ocean-facing', 'atlantic', 'crossing', 'southampton', 'departure'], Ship)) return { Icon: Ship, isDedicated: true };
  if (match(name, ['retro', 'tv', 'crt television', 'cathode-ray'], Tv)) return { Icon: Tv, isDedicated: true };
  if (match(name, ['dining', 'grand staircase'], Utensils)) return { Icon: Utensils, isDedicated: true };

  // ── Comfort and amenities ──
  if (match(name, ['bed', 'sleeping', 'capsule bed', 'hammock', 'thread count', 'firmness bed', 'bunks', 'memory foam'], Bed)) return { Icon: Bed, isDedicated: true };
  if (match(name, ['bath', 'spa', 'jacuzzi', 'gravity spa', 'toilet', 'en-suite bathroom'], Bath)) return { Icon: Bath, isDedicated: true };
  if (match(name, ['gym', 'fitness', 'gymnasium', 'mechanical horse'], Dumbbell)) return { Icon: Dumbbell, isDedicated: true };
  if (match(name, ['pool', 'swimming', 'gravity jacuzzi', 'floating blob'], Droplets)) return { Icon: Droplets, isDedicated: true };
  if (name.includes('parking')) return { Icon: Car, isDedicated: true };
  if (match(name, ['wardrobe'], Warehouse)) return { Icon: Warehouse, isDedicated: true };
  if (match(name, ['vinyl', 'turntable', 'record'], Music)) return { Icon: Music, isDedicated: true };
  if (match(name, ['educational material'], GraduationCap)) return { Icon: GraduationCap, isDedicated: true };
  if (match(name, ['immersion', 'merit point', 'cultural merit'], Award)) return { Icon: Award, isDedicated: true };
  if (match(name, ['marble', 'craftsmanship', 'makrana'], Landmark)) return { Icon: Landmark, isDedicated: true };
  if (match(name, ['cooling', 'denial about iceberg'], Snowflake)) return { Icon: Snowflake, isDedicated: true };
  if (match(name, ['calligraphy', 'writing desk', 'papyrus'], PenLine)) return { Icon: PenLine, isDedicated: true };
  if (match(name, ['gift shop', 'apollo'], ShoppingBag)) return { Icon: ShoppingBag, isDedicated: true };
  if (match(name, ['musician', 'court musician'], Music)) return { Icon: Music, isDedicated: true };

  // ── Stone age / primitive ──
  if (match(name, ['fire pit', 'campfire', 'coal-fired', 'stove'], Flame)) return { Icon: Flame, isDedicated: true };
  if (match(name, ['cave', 'entrance', 'predator-resistant'], DoorOpen)) return { Icon: DoorOpen, isDedicated: true };
  if (match(name, ['mammoth', 'comfort'], Heart)) return { Icon: Heart, isDedicated: true };
  if (match(name, ['smoke', 'ventilation', 'smoke-hole'], Wind)) return { Icon: Wind, isDedicated: true };
  if (match(name, ['rock', 'seating'], Circle)) return { Icon: Circle, isDedicated: false };
  if (match(name, ['predator', 'protection'], Shield)) return { Icon: Shield, isDedicated: true };

  // ── Bermuda / Mystery ──
  if (match(name, ['temporal', 'anomaly', 'analog clock'], Clock)) return { Icon: Clock, isDedicated: true };
  if (match(name, ['compass'], Navigation)) return { Icon: Navigation, isDedicated: true };
  if (match(name, ['calendar'], CalendarClock)) return { Icon: CalendarClock, isDedicated: true };
  if (match(name, ['research equipment', 'vintage research'], Settings)) return { Icon: Settings, isDedicated: true };
  if (match(name, ['mystery', 'atmosphere'], Eye)) return { Icon: Eye, isDedicated: true };
  if (match(name, ['dread', 'existential'], AlertTriangle)) return { Icon: AlertTriangle, isDedicated: true };

  // ── Area 51 / Classified ──
  if (match(name, ['unusual', 'housekeeping'], Users)) return { Icon: Users, isDedicated: true };
  if (match(name, ['monitored communication'], Radio)) return { Icon: Radio, isDedicated: true };
  if (match(name, ['hangar', 'restricted'], Ban)) return { Icon: Ban, isDedicated: true };
  if (match(name, ['first aid', 'medical remedies', 'emergency supplies'], Heart)) return { Icon: Heart, isDedicated: true };
  if (match(name, ['night sky', 'observation (do not'], Moon)) return { Icon: Moon, isDedicated: true };
  if (name.includes('redacted')) return { Icon: XCircle, isDedicated: true };

  // ── Floating city ──
  if (match(name, ['window', 'fishing'], Fish)) return { Icon: Fish, isDedicated: true };
  if (match(name, ['gimbal', 'furniture'], Settings)) return { Icon: Settings, isDedicated: true };
  if (match(name, ['seasickness', 'remedies'], Heart)) return { Icon: Heart, isDedicated: true };
  if (match(name, ['boat', 'parking'], Anchor)) return { Icon: Anchor, isDedicated: true };
  if (match(name, ['market', 'local'], Building)) return { Icon: Building, isDedicated: true };
  if (match(name, ['stability', 'rating'], GaugeCircle)) return { Icon: GaugeCircle, isDedicated: true };
  if (name.includes('flotation')) return { Icon: Waves, isDedicated: true };
  if (name.includes('desalination')) return { Icon: Droplets, isDedicated: true };

  // ── Star Trek ──
  if (match(name, ['vulcan', 'neighbor'], Users)) return { Icon: Users, isDedicated: true };
  if (match(name, ['post-scarcity', 'everything free'], Star)) return { Icon: Star, isDedicated: true };
  if (match(name, ['translator', 'universal'], Globe)) return { Icon: Globe, isDedicated: true };
  if (name.includes('transport')) return { Icon: Zap, isDedicated: true };

  // ── Misc / remaining patterns ──
  if (match(name, ['floppy disk', 'dead-drop', 'dead drop'], Archive)) return { Icon: Archive, isDedicated: true };
  if (match(name, ['dust storm', 'alert'], AlertTriangle)) return { Icon: AlertTriangle, isDedicated: true };
  if (match(name, ['motivational poster', 'bucephalus', 'night sky unpolluted', 'unpolluted'], Star)) return { Icon: Star, isDedicated: true };
  if (match(name, ['electric lighting', 'edwardian electric'], Zap)) return { Icon: Zap, isDedicated: true };

  // No dedicated icon
  return { Icon: Circle, isDedicated: false };
}

/**
 * Use this to filter amenities for display and for DB cleanup.
 * Only amenities with a dedicated icon should be shown or kept.
 */
export function hasDedicatedAmenityIcon(amenityName: string): boolean {
  return getAmenityIcon(amenityName).isDedicated;
}
