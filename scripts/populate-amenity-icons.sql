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
-- ADDITIONAL AMENITIES (fill all remaining NULL with relevant Iconify icons)
-- Using lucide or mdi prefix for consistency; color #222222
-- ============================================================================

UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/weight-lifter.svg?color=%23222222' WHERE name = '1/6 gravity amenities';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/flask-outline.svg?color=%23222222' WHERE name = '1953 research equipment';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/clock-outline.svg?color=%23222222' WHERE name = 'Analog clock collection';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/leaf.svg?color=%23222222' WHERE name = 'Authentic rainforest';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bed-outline.svg?color=%23222222' WHERE name = 'Basic bunks';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/leaf.svg?color=%23222222' WHERE name = 'Berry foraging';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/dice-multiple.svg?color=%23222222' WHERE name = 'Board games';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/anchor.svg?color=%23222222' WHERE name = 'Boat parking';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/calendar.svg?color=%23222222' WHERE name = 'Calendar (subjective)';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bed-outline.svg?color=%23222222' WHERE name = 'Capsule sleeping pod';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/cassette.svg?color=%23222222' WHERE name = 'Cassette deck';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/palette-outline.svg?color=%23222222' WHERE name = 'Cave paintings';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/silverware-fork-knife.svg?color=%23222222' WHERE name = 'Classified cafeteria';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/air-conditioner.svg?color=%23222222' WHERE name = 'Climate control';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/utensils-crossed.svg?color=%23222222' WHERE name = 'Compact kitchen';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/compass.svg?color=%23222222' WHERE name = 'Compass (unreliable)';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/robot-outline.svg?color=%23222222' WHERE name = 'Conservation AI guide';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/television.svg?color=%23222222' WHERE name = 'CRT television';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/star.svg?color=%23222222' WHERE name = 'Cultural merit system';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/water.svg?color=%23222222' WHERE name = 'Desalination system';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/desk.svg?color=%23222222' WHERE name = 'Desk workspace';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/diving-scuba-mask.svg?color=%23222222' WHERE name = 'Diving equipment';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/earth.svg?color=%23222222' WHERE name = 'Earth views';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/leaf.svg?color=%23222222' WHERE name = 'Eco-friendly systems';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/book-open.svg?color=%23222222' WHERE name = 'Educational materials';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/school-outline.svg?color=%23222222' WHERE name = 'Educational programs';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/rocket-launch.svg?color=%23222222' WHERE name = 'Emergency ascent capsule';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/rocket-outline.svg?color=%23222222' WHERE name = 'Emergency evacuation pod';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/lifebuoy.svg?color=%23222222' WHERE name = 'Emergency flotation';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/medical-bag.svg?color=%23222222' WHERE name = 'Emergency supplies';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/zap.svg?color=%23222222' WHERE name = 'Emergency transport';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/shield-lock-outline.svg?color=%23222222' WHERE name = 'Entrance protection';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/alert-circle-outline.svg?color=%23222222' WHERE name = 'Existential dread';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/fax.svg?color=%23222222' WHERE name = 'Fax machine';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/flame.svg?color=%23222222' WHERE name = 'Fire pit';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/medical-bag.svg?color=%23222222' WHERE name = 'First aid';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bed-outline.svg?color=%23222222' WHERE name = 'Fur bedding';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/store-outline.svg?color=%23222222' WHERE name = 'Gift shop access';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/sofa-outline.svg?color=%23222222' WHERE name = 'Gimbal-mounted furniture';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/airplane.svg?color=%23222222' WHERE name = 'Hangar views (restricted)';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/rocket-outline.svg?color=%23222222' WHERE name = 'Historic Apollo site nearby';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/map-marker.svg?color=%23222222' WHERE name = 'Historic location';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/star-four-points-outline.svg?color=%23222222' WHERE name = 'Holodeck privileges';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/thermometer.svg?color=%23222222' WHERE name = 'Hot water';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/binoculars.svg?color=%23222222' WHERE name = 'Hunting guide (Grok)';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/noodles.svg?color=%23222222' WHERE name = 'Instant ramen selection';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/toilet.svg?color=%23222222' WHERE name = 'Japanese toilet';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/utensils-crossed.svg?color=%23222222' WHERE name = 'Kitchen';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/lifebuoy.svg?color=%23222222' WHERE name = 'Life jackets';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/ferry.svg?color=%23222222' WHERE name = 'Life rafts';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/store-outline.svg?color=%23222222' WHERE name = 'Local market access';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/hot-tub.svg?color=%23222222' WHERE name = 'Low-gravity spa';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bed-outline.svg?color=%23222222' WHERE name = 'Mammoth-fur comfort';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bed-outline.svg?color=%23222222' WHERE name = 'Memory foam mattress';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/silverware-fork-knife.svg?color=%23222222' WHERE name = 'Mess hall';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bed-outline.svg?color=%23222222' WHERE name = 'Military bunks';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/radio-tower.svg?color=%23222222' WHERE name = 'Monitored communications';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/bed-outline.svg?color=%23222222' WHERE name = 'Mosquito net';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/eye.svg?color=%23222222' WHERE name = 'Mystery atmosphere';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/flower-outline.svg?color=%23222222' WHERE name = 'Native flora access';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/lightbulb-outline.svg?color=%23222222' WHERE name = 'Neon ambient lighting';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/telescope.svg?color=%23222222' WHERE name = 'Night sky observation';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/pillar.svg?color=%23222222' WHERE name = 'Original art deco architecture';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/star-four-points-outline.svg?color=%23222222' WHERE name = 'Post-scarcity living';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/shield-lock.svg?color=%23222222' WHERE name = 'Predator-resistant entrance';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/door-closed-lock.svg?color=%23222222' WHERE name = 'Private airlock';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/shield-outline.svg?color=%23222222' WHERE name = 'Radiation shielding';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/radio.svg?color=%23222222' WHERE name = 'Radio communication';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/weather-rainy.svg?color=%23222222' WHERE name = 'Rain view window';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/eye-off-outline.svg?color=%23222222' WHERE name = 'Redacted amenities';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/cpu.svg?color=%23222222' WHERE name = 'Replicator access';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/book-open-variant.svg?color=%23222222' WHERE name = 'Research logs';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/gamepad-variant-outline.svg?color=%23222222' WHERE name = 'Retro gaming console';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/waves.svg?color=%23222222' WHERE name = 'River access nearby';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/robot-outline.svg?color=%23222222' WHERE name = 'Robot butler service';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/sofa-outline.svg?color=%23222222' WHERE name = 'Rock seating';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/medical-bag.svg?color=%23222222' WHERE name = 'Seasickness remedies';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/smoke-detector-outline.svg?color=%23222222' WHERE name = 'Smoke ventilation';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/leaf.svg?color=%23222222' WHERE name = 'Spirit journey berries (extra)';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/gauge.svg?color=%23222222' WHERE name = 'Stability rating 7.2';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/clock-alert-outline.svg?color=%23222222' WHERE name = 'Temporal anomaly proximity';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/towel.svg?color=%23222222' WHERE name = 'Towels provided';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/zap.svg?color=%23222222' WHERE name = 'Transporter access';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/waves.svg?color=%23222222' WHERE name = 'Underwater views';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/globe.svg?color=%23222222' WHERE name = 'Universal translator';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/robot-outline.svg?color=%23222222' WHERE name = 'Unusual housekeeping';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/candy.svg?color=%23222222' WHERE name = 'Vending machine access';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/television.svg?color=%23222222' WHERE name = 'VHS player';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/desk.svg?color=%23222222' WHERE name = 'Vintage computer terminal';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/robot-industrial-outline.svg?color=%23222222' WHERE name = 'Vintage moon rover access';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/account-group-outline.svg?color=%23222222' WHERE name = 'Vulcan neighbors';
UPDATE amenities SET icon_url = 'https://api.iconify.design/lucide/wifi.svg?color=%23222222' WHERE name = 'Wi-Fi';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/binoculars.svg?color=%23222222' WHERE name = 'Wildlife observation';
UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/fish.svg?color=%23222222' WHERE name = 'Window fishing';

-- ============================================================================
-- FALLBACK: Set default icon for any amenities still without icons
-- ============================================================================

UPDATE amenities SET icon_url = 'https://api.iconify.design/mdi/check-circle-outline.svg?color=%23222222'
WHERE icon_url IS NULL;

-- ============================================================================
-- VERIFY RESULTS
-- ============================================================================

SELECT name, icon_url FROM amenities ORDER BY name;
