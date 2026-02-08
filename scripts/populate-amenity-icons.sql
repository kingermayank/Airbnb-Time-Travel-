-- ============================================================================
-- AMENITY ICONS POPULATION SCRIPT
-- Updates all amenities with Iconify icon URLs
-- Run this script in Supabase SQL Editor
-- ============================================================================

-- Icon URLs use the Iconify API format: https://api.iconify.design/{prefix}/{name}.svg
-- This allows dynamic SVG fetching with customizable color and size parameters

-- ============================================================================
-- COMMON AMENITIES (Shared across multiple listings)
-- ============================================================================

-- Wi-Fi
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/wifi.svg?color=%23222222'
WHERE LOWER(name) = 'wi-fi' OR LOWER(name) = 'wifi';

-- Starlink Wi-Fi
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/satellite-variant.svg?color=%23222222'
WHERE LOWER(name) LIKE '%starlink%';

-- Kitchen
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/chef-hat.svg?color=%23222222'
WHERE LOWER(name) = 'kitchen';

-- Compact galley kitchen
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/stove.svg?color=%23222222'
WHERE LOWER(name) LIKE '%galley kitchen%';

-- Air conditioning
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/air-conditioner.svg?color=%23222222'
WHERE LOWER(name) LIKE '%air conditioning%';

-- Heating
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/radiator.svg?color=%23222222'
WHERE LOWER(name) = 'heating';

-- ============================================================================
-- HISTORICAL/CULTURAL AMENITIES
-- ============================================================================

-- Historical preservation
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/pillar.svg?color=%23222222'
WHERE LOWER(name) LIKE '%historical preservation%';

-- Period-accurate furnishings
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/sofa-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%period-accurate furnishings%';

-- Cultural artifacts
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/vase-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%cultural artifacts%';

-- Educational materials
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/book-open.svg?color=%23222222'
WHERE LOWER(name) LIKE '%educational materials%';

-- Authentic Mughal architecture
UPDATE amenities SET icon_url = 'https://api.iconify.design/game-icons/indian-palace.svg?color=%23222222'
WHERE LOWER(name) LIKE '%mughal architecture%';

-- Marble craftsmanship
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/texture-box.svg?color=%23222222'
WHERE LOWER(name) LIKE '%marble%';

-- Private courtyard
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/gate.svg?color=%23222222'
WHERE LOWER(name) LIKE '%courtyard%';

-- Guided tour access
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/map-marker-path.svg?color=%23222222'
WHERE LOWER(name) LIKE '%guided tour%' OR LOWER(name) LIKE '%guided historical%';

-- Historical artifacts
UPDATE amenities SET icon_url = 'https://api.iconify.design/game-icons/ancient-columns.svg?color=%23222222'
WHERE LOWER(name) LIKE '%historical artifacts%';

-- ============================================================================
-- SPACE/MARS COLONY AMENITIES
-- ============================================================================

-- Mars surface view
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/planet.svg?color=%23222222'
WHERE LOWER(name) LIKE '%mars surface%';

-- Life support systems
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/heart-pulse.svg?color=%23222222'
WHERE LOWER(name) LIKE '%life support%';

-- Climate-controlled habitat
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/thermometer.svg?color=%23222222'
WHERE LOWER(name) LIKE '%climate-controlled%';

-- Exploration rovers
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/robot-industrial-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%rover%';

-- Automated fabric recycler
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/recycle-variant.svg?color=%23222222'
WHERE LOWER(name) LIKE '%recycler%';

-- Thermal drying unit
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/tumble-dryer.svg?color=%23222222'
WHERE LOWER(name) LIKE '%drying%' OR LOWER(name) LIKE '%thermal%';

-- External perimeter monitoring
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/cctv.svg?color=%23222222'
WHERE LOWER(name) LIKE '%monitoring%' OR LOWER(name) LIKE '%perimeter%';

-- Cold-storage unit
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/fridge-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%cold-storage%' OR LOWER(name) LIKE '%storage unit%';

-- Companion-friendly
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/account-group-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%companion%';

-- Zero-gravity sleeping pods
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bed-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%sleeping pod%' OR LOWER(name) LIKE '%zero-gravity%';

-- ============================================================================
-- ATLANTIS/UNDERWATER AMENITIES
-- ============================================================================

-- Underwater views
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/waves.svg?color=%23222222'
WHERE LOWER(name) LIKE '%underwater view%';

-- Crystal energy systems
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/diamond-stone.svg?color=%23222222'
WHERE LOWER(name) LIKE '%crystal energy%';

-- Ancient Atlantean technology
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/atom-variant.svg?color=%23222222'
WHERE LOWER(name) LIKE '%atlantean technology%';

-- 360-degree ocean views
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/rotate-3d-variant.svg?color=%23222222'
WHERE LOWER(name) LIKE '%360%';

-- Pressure-controlled environment
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/gauge.svg?color=%23222222'
WHERE LOWER(name) LIKE '%pressure%';

-- Marine life observation
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/fish.svg?color=%23222222'
WHERE LOWER(name) LIKE '%marine%';

-- Crystal-powered lighting
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/lightbulb-on-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%crystal-powered%' OR LOWER(name) LIKE '%lighting%';

-- Underwater access portal
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/door-open.svg?color=%23222222'
WHERE LOWER(name) LIKE '%portal%' OR LOWER(name) LIKE '%underwater access%';

-- ============================================================================
-- TITANIC AMENITIES
-- ============================================================================

-- 1912 decor
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/chandelier.svg?color=%23222222'
WHERE LOWER(name) LIKE '%1912 decor%';

-- Ocean views
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/waves.svg?color=%23222222'
WHERE LOWER(name) = 'ocean views';

-- First-class amenities
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/star-circle-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%first-class%';

-- Period-accurate technology
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/cog-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%period-accurate technology%';

-- Authentic experience
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/certificate-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%authentic experience%';

-- ============================================================================
-- WWII RESISTANCE SAFEHOUSE AMENITIES
-- ============================================================================

-- Hidden compartments
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/eye-off-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%hidden compartment%';

-- 1940s decor
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/lamp-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%1940s decor%';

-- Covert entry system
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/shield-lock-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%covert entry%';

-- Authentic safehouse experience
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/home-lock.svg?color=%23222222'
WHERE LOWER(name) LIKE '%safehouse experience%';

-- ============================================================================
-- PANDORA AMENITIES
-- ============================================================================

-- Bioluminescent views
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/star-four-points-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%bioluminescent%';

-- Pandoran energy systems
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/lightning-bolt-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%pandoran energy%';

-- Native flora access
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/flower-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%native flora%';

-- Floating structure tech
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/cloud-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%floating structure%';

-- Eco-friendly systems
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/leaf.svg?color=%23222222'
WHERE LOWER(name) LIKE '%eco-friendly%';

-- Mountain views
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/image-filter-hdr.svg?color=%23222222'
WHERE LOWER(name) LIKE '%mountain view%';

-- Alien wildlife observation
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/binoculars.svg?color=%23222222'
WHERE LOWER(name) LIKE '%wildlife observation%' OR LOWER(name) LIKE '%alien wildlife%';

-- Na'vi cultural artifacts
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bow-arrow.svg?color=%23222222'
WHERE LOWER(name) LIKE '%na''vi%';

-- ============================================================================
-- ANCIENT EGYPTIAN AMENITIES
-- ============================================================================

-- Nile River access
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/sail-boat.svg?color=%23222222'
WHERE LOWER(name) LIKE '%nile%';

-- Ancient Egyptian artifacts
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/pyramid.svg?color=%23222222'
WHERE LOWER(name) LIKE '%egyptian artifacts%';

-- Hieroglyphic decorations
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/format-text-variant.svg?color=%23222222'
WHERE LOWER(name) LIKE '%hieroglyphic%';

-- Courtyard gardens
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/palm-tree.svg?color=%23222222'
WHERE LOWER(name) LIKE '%courtyard garden%';

-- Cultural immersion
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/account-school-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%cultural immersion%';

-- ============================================================================
-- ALEXANDER'S CAMPAIGN TENT AMENITIES
-- ============================================================================

-- Military camp atmosphere
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/tent.svg?color=%23222222'
WHERE LOWER(name) LIKE '%military camp%';

-- Ancient Persian decor
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/rug.svg?color=%23222222'
WHERE LOWER(name) LIKE '%persian decor%';

-- Camp life experience
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/campfire.svg?color=%23222222'
WHERE LOWER(name) LIKE '%camp life%';

-- Authentic tent structure
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/tent.svg?color=%23222222'
WHERE LOWER(name) LIKE '%tent structure%';

-- ============================================================================
-- 1990s MANHATTAN LOFT AMENITIES
-- ============================================================================

-- Retro technology
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/television-classic.svg?color=%23222222'
WHERE LOWER(name) LIKE '%retro technology%';

-- Vintage entertainment
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/cassette.svg?color=%23222222'
WHERE LOWER(name) LIKE '%vintage entertainment%';

-- Period-accurate decor
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/clock-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%period-accurate decor%';

-- Pre-internet experience
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/phone-classic.svg?color=%23222222'
WHERE LOWER(name) LIKE '%pre-internet%';

-- 1990s furnishings
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/sofa.svg?color=%23222222'
WHERE LOWER(name) LIKE '%1990s furnishings%';

-- Retro electronics
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/gamepad-variant-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%retro electronics%';

-- Vintage record player
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/music-circle-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%record player%' OR LOWER(name) LIKE '%vinyl%';

-- Classic NYC atmosphere
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/city-variant-outline.svg?color=%23222222'
WHERE LOWER(name) LIKE '%nyc atmosphere%' OR LOWER(name) LIKE '%classic nyc%';

-- ============================================================================
-- FALLBACK: Set default icon for any amenities still without icons
-- ============================================================================

UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/check-circle-outline.svg?color=%23222222'
WHERE icon_url IS NULL;

-- ============================================================================
-- VERIFY RESULTS
-- ============================================================================

SELECT name, icon_url FROM amenities ORDER BY name;
