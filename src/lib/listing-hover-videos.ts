import { slugifyListingTitle } from './listing-slug';

const LISTING_HOVER_VIDEO_BY_SLUG: Record<string, string> = {
  'alexander-s-campaign-tent-persia': '/videos/listing-hover/alexander-s-campaign-tent-persia.mp4',
  'cave-dwelling-lascaux': '/videos/listing-hover/cave-dwelling-lascaux.mp4',
  'classified-barracks-area-51': '/videos/listing-hover/classified-barracks-area-51.mp4',
  'crystal-villa-atlantis': '/videos/listing-hover/crystal-villa-atlantis.mp4',
  'federation-ambassador-suite-earth': '/videos/listing-hover/federation-ambassador-suite-earth.mp4',
  'first-class-suite-rms-titanic': '/videos/listing-hover/first-class-suite-rms-titanic.mp4',
  'floating-mountain-bungalow-pandora': '/videos/listing-hover/floating-mountain-bungalow-pandora.mp4',
  'lunar-hilton-penthouse-moon': '/videos/listing-hover/lunar-hilton-penthouse-moon.mp4',
  'manhattan-loft-new-york': '/videos/listing-hover/manhattan-loft-new-york.mp4',
  'mars-colony-pod-olympus-mons': '/videos/listing-hover/mars-colony-pod-olympus-mons.mp4',
  'neo-showa-capsule-pod-parallel-tokyo': '/videos/listing-hover/neo-showa-capsule-pod-parallel-tokyo.mp4',
  'nile-villa-ancient-egypt': '/videos/listing-hover/nile-villa-ancient-egypt.mp4',
  'research-platform-bermuda-triangle': '/videos/listing-hover/research-platform-bermuda-triangle.mp4',
  'resistance-safehouse-loft-berlin': '/videos/listing-hover/resistance-safehouse-loft-berlin.mp4',
  'shah-jahan-s-marble-suite-agra': '/videos/listing-hover/shah-jahan-s-marble-suite-agra.mp4',
};

export function getListingHoverVideo(title: string): string | undefined {
  return LISTING_HOVER_VIDEO_BY_SLUG[slugifyListingTitle(title)];
}
