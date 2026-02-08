-- ============================================================================
-- UPDATE MARS OLYMPUS LISTING CONTENT
-- Based on the new content provided
-- ============================================================================

-- Update the listing with new description and key features
UPDATE listings SET
  full_description = 'Welcome to a private habitat on Mars, located near the base of Olympus Mons, the tallest mountain in the solar system. The pod is engineered to feel immediately familiar inside. Gravity is stabilized to Earth-standard levels, temperature and air pressure are carefully regulated, and daily routines work the way you expect them to. You won''t need to think about life support systems—everything runs quietly in the background. Large viewing panels frame Olympus Mons and the surrounding Martian landscape. Whether you''re making coffee in the morning or winding down at night, the view is simply part of the room. The interior includes a compact, fully equipped kitchen designed for long-term stays, along with reliable connectivity back to Earth (with a short delay). Sleeping areas are designed for normal, uninterrupted rest—no adjustments required. Exterior conditions are handled by an on-site rover that monitors the surrounding area, allowing you to focus on enjoying the stay.',
  key_features = '[
    {"title": "On-site monitoring", "description": "A rover patrols the surrounding area to maintain a secure environment"},
    {"title": "Regulated gravity interior", "description": "The entire pod is stabilized to familiar, full-body gravity for everyday living"},
    {"title": "Olympus Mons on the horizon", "description": "Wake up to views of the tallest mountain in the solar system from your private pod"}
  ]'::jsonb
WHERE id = '10b2efa4-819b-4a10-99a0-1f5dc580b080';

-- Update host description - merging existing content with new quote and known-for items
-- Note: Using the actual UUID from the database
UPDATE hosts SET
  description = 'CEO of SpaceX and founder of the Mars Colony. After decades of dreaming about making humanity multi-planetary, I''m thrilled to welcome guests to our Olympus Mons habitat. I wanted a place on Mars that felt normal inside. So we built one. When not managing interplanetary logistics, I enjoy driving rovers across the Martian surface and tweeting from space. I''m known for building rockets instead of vacation homes, caring a lot about engineering details, and understating very big things. Your comfort and safety are my top priorities.',
  response_time = 'within an hour'
WHERE id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2445';

-- Delete existing reviews for this listing
DELETE FROM reviews 
WHERE listing_id = '10b2efa4-819b-4a10-99a0-1f5dc580b080';

-- Insert new reviews
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Neil Armstrong', NULL, '2024-12-15', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'I''ve spent time walking on the Moon, which was memorable but not especially comfortable. This was a very different experience. The gravity felt familiar, the temperature was controlled, and I didn''t have to think about survival at all, which, frankly, is an upgrade. Waking up and seeing Olympus Mons instead of the lunar surface was unexpected in the best way. Would recommend to anyone taking their second planetary trip.'),
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Han Solo', NULL, '2024-12-10', 4.5, 4.5, 5.0, 4.0, 5.0, 5.0, 4.5, 'Landed. Slept. Left. Nothing exploded.'),
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Neil deGrasse Tyson', NULL, '2024-12-05', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'Olympus Mons is technically a shield volcano nearly three times the height of Everest. Practically speaking, it''s an excellent thing to see before breakfast. The listing is accurate, the science checks out, and the pod behaves exactly as expected.');

-- Update total_reviews count on the listing
UPDATE listings 
SET total_reviews = 3
WHERE id = '10b2efa4-819b-4a10-99a0-1f5dc580b080';

