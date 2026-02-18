-- Rename all listing titles to consistent format: "[Stay Type], [Location]"
-- No years, no em-dashes, no parentheticals

UPDATE listings SET title = 'Crystal Villa, Atlantis'
WHERE title = 'The Lost Atlantean Crystal Villa';

UPDATE listings SET title = 'Manhattan Loft, New York'
WHERE title = '1990s Manhattan Loft in Pre-Internet NYC';

UPDATE listings SET title = E'Alexander''s Campaign Tent, Persia'
WHERE title = E'Alexander the Great''s Campaign Tent \u2014 Persia, 330 BCE';

UPDATE listings SET title = E'Shah Jahan''s Marble Suite, Agra'
WHERE title = E'Shah Jahan''s Marble Suite \u2014 Agra, 1650';

UPDATE listings SET title = 'Mars Colony Pod, Olympus Mons'
WHERE title = 'SpaceX Mars Colony Pod at Olympus Mons';

UPDATE listings SET title = 'First-Class Suite, RMS Titanic'
WHERE title LIKE 'Titanic First-Class Suite%';

UPDATE listings SET title = 'Floating Mountain Bungalow, Pandora'
WHERE title = 'Pandora Floating Mountain Bungalow';

UPDATE listings SET title = 'Nile Villa, Ancient Egypt'
WHERE title LIKE 'Ancient Egyptian Nile Villa%';

UPDATE listings SET title = 'Resistance Safehouse Loft, Berlin'
WHERE title = 'WWII German Resistance Safehouse Loft';

UPDATE listings SET title = 'Lunar Hilton Penthouse, Moon'
WHERE title LIKE 'Lunar Hilton Penthouse%';

UPDATE listings SET title = 'Federation Ambassador Suite, Earth'
WHERE title LIKE 'Federation Ambassador Suite%';

UPDATE listings SET title = 'Research Platform, Bermuda Triangle'
WHERE title LIKE 'Bermuda Triangle Research Platform%';

UPDATE listings SET title = 'Classified Barracks, Area 51'
WHERE title LIKE 'Area 51 Classified Barracks%';

UPDATE listings SET title = 'Cave Dwelling, Lascaux'
WHERE title LIKE 'Premium Cave Dwelling%';

UPDATE listings SET title = 'Neo-Showa Capsule Pod, Parallel Tokyo'
WHERE title LIKE 'Neo-Showa Capsule Pod%';
