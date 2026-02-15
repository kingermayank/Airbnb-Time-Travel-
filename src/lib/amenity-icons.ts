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

  // WiFi and connectivity
  const w = match(name, ['wifi', 'wi-fi', 'starlink'], Wifi);
  if (w) return w;
  if (match(name, ['radio', 'communication'], Radio)) return { Icon: Radio, isDedicated: true };

  // Building and atmosphere
  if (match(name, ['nyc', 'building', 'atmosphere'], Building2)) return { Icon: Building2, isDedicated: true };
  if (match(name, ['panoramic', 'views'], Eye)) return { Icon: Eye, isDedicated: true };
  if (match(name, ['night', 'watch', 'protection'], ShieldCheck)) return { Icon: ShieldCheck, isDedicated: true };
  if (match(name, ['command', 'access'], Lock)) return { Icon: Lock, isDedicated: true };
  if (match(name, ['elite', 'guard', 'perimeter'], Shield)) return { Icon: Shield, isDedicated: true };
  if (match(name, ['edwardian', 'technology'], Settings)) return { Icon: Settings, isDedicated: true };
  if (match(name, ['iceberg', 'spotting'], Binoculars)) return { Icon: Binoculars, isDedicated: true };
  if (match(name, ['chandelier', 'decor'], Sparkles)) return { Icon: Sparkles, isDedicated: true };
  if (match(name, ['brandy', 'champagne', 'service'], ConciergeBell)) return { Icon: ConciergeBell, isDedicated: true };

  // Kitchen and food
  if (match(name, ['kitchen', 'galley'], UtensilsCrossed)) return { Icon: UtensilsCrossed, isDedicated: true };
  if (match(name, ['refrigerator', 'cold', 'storage'], Refrigerator)) return { Icon: Refrigerator, isDedicated: true };
  if (match(name, ['chef', 'cooking'], ChefHat)) return { Icon: ChefHat, isDedicated: true };

  // Climate and environment
  if (match(name, ['air conditioning', 'climate', 'heating'], Thermometer)) return { Icon: Thermometer, isDedicated: true };
  if (name.includes('life support')) return { Icon: Activity, isDedicated: true };
  if (name.includes('habitat')) return { Icon: Building2, isDedicated: true };
  if (name.includes('pressure')) return { Icon: Gauge, isDedicated: true };

  // Views and nature
  if (match(name, ['view', 'observation'], Eye)) return { Icon: Eye, isDedicated: true };
  if (match(name, ['mountain', 'floating'], Mountain)) return { Icon: Mountain, isDedicated: true };
  if (match(name, ['underwater', 'ocean', 'marine'], Waves)) return { Icon: Waves, isDedicated: true };
  if (match(name, ['crystal', 'gem'], Gem)) return { Icon: Gem, isDedicated: true };
  if (match(name, ['bioluminescent', 'glow'], Sparkles)) return { Icon: Sparkles, isDedicated: true };
  if (match(name, ['flora', 'native', 'plant', 'tree'], TreePine)) return { Icon: TreePine, isDedicated: true };
  if (match(name, ['wildlife', 'bird'], Bird)) return { Icon: Bird, isDedicated: true };

  // Space and technology
  if (match(name, ['rover', 'exploration'], Car)) return { Icon: Car, isDedicated: true };
  if (match(name, ['monitoring', 'perimeter'], Eye)) return { Icon: Eye, isDedicated: true };
  if (match(name, ['recycler', 'fabric'], Recycle)) return { Icon: Recycle, isDedicated: true };
  if (match(name, ['drying', 'thermal'], Sun)) return { Icon: Sun, isDedicated: true };
  if (name.includes('replicator')) return { Icon: Cpu, isDedicated: true };
  if (name.includes('holodeck')) return { Icon: Sparkles, isDedicated: true };
  if (name.includes('transporter access')) return { Icon: Zap, isDedicated: true };
  if (match(name, ['robot', 'butler'], Bot)) return { Icon: Bot, isDedicated: true };
  if (match(name, ['radiation', 'shielding'], Shield)) return { Icon: Shield, isDedicated: true };
  if (match(name, ['evacuation', 'emergency transport', 'escape'], Rocket)) return { Icon: Rocket, isDedicated: true };

  // Historical and cultural
  if (match(name, ['historical', 'preservation', 'authentic'], BookOpen)) return { Icon: BookOpen, isDedicated: true };
  if (match(name, ['artifact', 'cultural'], Scroll)) return { Icon: Scroll, isDedicated: true };
  if (match(name, ['period', 'furnishing'], Armchair)) return { Icon: Armchair, isDedicated: true };
  if (match(name, ['hieroglyphic', 'decoration', 'painting', 'art'], Palette)) return { Icon: Palette, isDedicated: true };
  if (match(name, ['nile', 'yamuna', 'river'], Anchor)) return { Icon: Anchor, isDedicated: true };
  if (match(name, ['courtyard', 'garden'], Leaf)) return { Icon: Leaf, isDedicated: true };
  if (match(name, ['tour', 'guide'], Compass)) return { Icon: Compass, isDedicated: true };
  if (match(name, ['military', 'camp'], Tent)) return { Icon: Tent, isDedicated: true };
  if (match(name, ['hidden', 'compartment', 'secret'], Lock)) return { Icon: Lock, isDedicated: true };
  if (match(name, ['covert', 'entry'], DoorClosed)) return { Icon: DoorClosed, isDedicated: true };
  if (match(name, ['bronze', 'armor'], ShieldCheck)) return { Icon: ShieldCheck, isDedicated: true };
  if (match(name, ['weapons', 'rack'], Swords)) return { Icon: Swords, isDedicated: true };
  if (match(name, ['royal', 'entry', 'crown'], Crown)) return { Icon: Crown, isDedicated: true };
  if (match(name, ['feather', 'pillow'], Feather)) return { Icon: Feather, isDedicated: true };
  if (match(name, ['atlantic', 'crossing', 'ocean-facing', 'southampton', 'departure'], Ship)) return { Icon: Ship, isDedicated: true };
  if (match(name, ['retro', 'tv', 'technology'], Tv)) return { Icon: Tv, isDedicated: true };
  if (match(name, ['dining', 'access'], Utensils)) return { Icon: Utensils, isDedicated: true };

  // Comfort and amenities
  if (match(name, ['bed', 'sleeping'], Bed)) return { Icon: Bed, isDedicated: true };
  if (match(name, ['bath', 'spa'], Bath)) return { Icon: Bath, isDedicated: true };
  if (match(name, ['gym', 'fitness'], Dumbbell)) return { Icon: Dumbbell, isDedicated: true };
  if (match(name, ['pool', 'jacuzzi'], Droplets)) return { Icon: Droplets, isDedicated: true };
  if (name.includes('parking')) return { Icon: Car, isDedicated: true };
  if (match(name, ['concierge', 'service', 'steward'], ConciergeBell)) return { Icon: ConciergeBell, isDedicated: true };
  if (match(name, ['wardrobe', 'storage'], Warehouse)) return { Icon: Warehouse, isDedicated: true };
  if (match(name, ['vinyl', 'record'], Music)) return { Icon: Music, isDedicated: true };
  if (match(name, ['educational', 'materials'], GraduationCap)) return { Icon: GraduationCap, isDedicated: true };
  if (match(name, ['immersion', 'experience'], Award)) return { Icon: Award, isDedicated: true };
  if (match(name, ['marble', 'craftsmanship', 'inlay'], Landmark)) return { Icon: Landmark, isDedicated: true };
  if (match(name, ['cooling', 'architecture'], Snowflake)) return { Icon: Snowflake, isDedicated: true };

  // Stone age / primitive
  if (match(name, ['fire', 'pit'], Flame)) return { Icon: Flame, isDedicated: true };
  if (match(name, ['fur', 'bedding'], Bed)) return { Icon: Bed, isDedicated: true };
  if (match(name, ['cave', 'entrance'], DoorOpen)) return { Icon: DoorOpen, isDedicated: true };
  if (match(name, ['hunting', 'grok'], Binoculars)) return { Icon: Binoculars, isDedicated: true };
  if (match(name, ['berry', 'foraging'], Leaf)) return { Icon: Leaf, isDedicated: true };
  if (match(name, ['mammoth', 'comfort'], Heart)) return { Icon: Heart, isDedicated: true };
  if (match(name, ['smoke', 'ventilation'], Wind)) return { Icon: Wind, isDedicated: true };
  // Circle is a generic fallback — don't count rock/seating as having a dedicated icon
  if (match(name, ['rock', 'seating'], Circle)) return { Icon: Circle, isDedicated: false };
  if (match(name, ['predator', 'protection'], Shield)) return { Icon: Shield, isDedicated: true };
  if (match(name, ['spirit', 'journey'], Sparkles)) return { Icon: Sparkles, isDedicated: true };

  // Bermuda / Mystery
  if (match(name, ['temporal', 'anomaly'], Clock)) return { Icon: Clock, isDedicated: true };
  if (name.includes('unreliable compass')) return { Icon: Navigation, isDedicated: true };
  if (name.includes('subjective calendar')) return { Icon: CalendarClock, isDedicated: true };
  if (match(name, ['research', 'equipment'], Settings)) return { Icon: Settings, isDedicated: true };
  if (match(name, ['mystery', 'atmosphere'], Eye)) return { Icon: Eye, isDedicated: true };
  if (match(name, ['bunk', 'mess'], Bed)) return { Icon: Bed, isDedicated: true };
  if (match(name, ['log', 'record'], BookOpen)) return { Icon: BookOpen, isDedicated: true };
  if (match(name, ['dread', 'existential'], AlertTriangle)) return { Icon: AlertTriangle, isDedicated: true };
  if (match(name, ['raft', 'life'], Anchor)) return { Icon: Anchor, isDedicated: true };

  // Area 51 / Classified
  if (match(name, ['classified', 'cafeteria'], UtensilsCrossed)) return { Icon: UtensilsCrossed, isDedicated: true };
  if (match(name, ['unusual', 'housekeeping'], Users)) return { Icon: Users, isDedicated: true };
  if (match(name, ['monitored', 'communications'], Radio)) return { Icon: Radio, isDedicated: true };
  if (match(name, ['hangar', 'restricted'], Ban)) return { Icon: Ban, isDedicated: true };
  if (name.includes('first aid')) return { Icon: Heart, isDedicated: true };
  if (name.includes('night sky')) return { Icon: Moon, isDedicated: true };
  if (name.includes('redacted')) return { Icon: XCircle, isDedicated: true };

  // Floating city
  if (match(name, ['window', 'fishing'], Fish)) return { Icon: Fish, isDedicated: true };
  if (match(name, ['gimbal', 'furniture'], Settings)) return { Icon: Settings, isDedicated: true };
  if (match(name, ['seasickness', 'remedies'], Heart)) return { Icon: Heart, isDedicated: true };
  if (name.includes('life jacket')) return { Icon: Shield, isDedicated: true };
  if (match(name, ['boat', 'parking'], Anchor)) return { Icon: Anchor, isDedicated: true };
  if (match(name, ['market', 'local'], Building)) return { Icon: Building, isDedicated: true };
  if (match(name, ['stability', 'rating'], GaugeCircle)) return { Icon: GaugeCircle, isDedicated: true };
  if (name.includes('flotation')) return { Icon: Waves, isDedicated: true };
  if (name.includes('desalination')) return { Icon: Droplets, isDedicated: true };

  // Star Trek
  if (match(name, ['vulcan', 'neighbor'], Users)) return { Icon: Users, isDedicated: true };
  if (match(name, ['merit', 'cultural'], Star)) return { Icon: Star, isDedicated: true };
  if (match(name, ['educational', 'program'], BookOpen)) return { Icon: BookOpen, isDedicated: true };
  if (match(name, ['translator', 'universal'], Globe)) return { Icon: Globe, isDedicated: true };
  if (name.includes('post-scarcity')) return { Icon: Sparkles, isDedicated: true };
  if (name.includes('transport')) return { Icon: Zap, isDedicated: true };

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
