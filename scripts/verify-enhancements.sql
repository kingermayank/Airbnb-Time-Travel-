-- ============================================
-- VERIFY LISTING ENHANCEMENTS
-- This script checks data quality and completeness
-- ============================================

-- 1. Check amenity counts per listing (should be 8-12)
SELECT 
  l.id,
  l.title,
  COUNT(DISTINCT la.amenity_id) as amenity_count,
  CASE 
    WHEN COUNT(DISTINCT la.amenity_id) >= 8 AND COUNT(DISTINCT la.amenity_id) <= 12 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as status
FROM listings l
LEFT JOIN listing_amenities la ON l.id = la.listing_id
GROUP BY l.id, l.title
ORDER BY l.title;

-- 2. Check review counts per listing (should be 5-8)
SELECT 
  l.id,
  l.title,
  COUNT(DISTINCT r.id) as review_count,
  CASE 
    WHEN COUNT(DISTINCT r.id) >= 5 AND COUNT(DISTINCT r.id) <= 8 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as status
FROM listings l
LEFT JOIN reviews r ON l.id = r.listing_id
GROUP BY l.id, l.title
ORDER BY l.title;

-- 3. Check review quality - average comment length (should be substantial)
SELECT 
  l.id,
  l.title,
  COUNT(r.id) as review_count,
  ROUND(AVG(LENGTH(r.comment))) as avg_comment_length,
  MIN(LENGTH(r.comment)) as min_comment_length,
  MAX(LENGTH(r.comment)) as max_comment_length,
  CASE 
    WHEN AVG(LENGTH(r.comment)) >= 100 THEN '✓ PASS'
    ELSE '✗ FAIL'
  END as quality_status
FROM listings l
LEFT JOIN reviews r ON l.id = r.listing_id
GROUP BY l.id, l.title
ORDER BY l.title;

-- 4. Check review rating distribution (should have variety)
SELECT 
  l.id,
  l.title,
  COUNT(r.id) as review_count,
  ROUND(AVG(r.rating_overall), 2) as avg_rating,
  MIN(r.rating_overall) as min_rating,
  MAX(r.rating_overall) as max_rating,
  ROUND(STDDEV(r.rating_overall), 2) as rating_stddev
FROM listings l
LEFT JOIN reviews r ON l.id = r.listing_id
GROUP BY l.id, l.title
ORDER BY l.title;

-- 5. Check that reviews have all rating fields populated
SELECT 
  l.id,
  l.title,
  COUNT(r.id) as total_reviews,
  COUNT(CASE WHEN r.rating_overall IS NOT NULL THEN 1 END) as has_overall,
  COUNT(CASE WHEN r.rating_cleanliness IS NOT NULL THEN 1 END) as has_cleanliness,
  COUNT(CASE WHEN r.rating_accuracy IS NOT NULL THEN 1 END) as has_accuracy,
  COUNT(CASE WHEN r.rating_communication IS NOT NULL THEN 1 END) as has_communication,
  COUNT(CASE WHEN r.rating_location IS NOT NULL THEN 1 END) as has_location,
  COUNT(CASE WHEN r.rating_checkin IS NOT NULL THEN 1 END) as has_checkin,
  COUNT(CASE WHEN r.rating_value IS NOT NULL THEN 1 END) as has_value
FROM listings l
LEFT JOIN reviews r ON l.id = r.listing_id
GROUP BY l.id, l.title
ORDER BY l.title;

-- 6. Check review date distribution (should be spread over time)
SELECT 
  l.id,
  l.title,
  COUNT(r.id) as review_count,
  MIN(r.review_date) as earliest_review,
  MAX(r.review_date) as latest_review,
  MAX(r.review_date) - MIN(r.review_date) as date_span_days
FROM listings l
LEFT JOIN reviews r ON l.id = r.listing_id
GROUP BY l.id, l.title
ORDER BY l.title;

-- 7. Summary statistics
SELECT 
  'Total Listings' as metric,
  COUNT(*)::text as value
FROM listings
UNION ALL
SELECT 
  'Listings with 8-12 amenities' as metric,
  COUNT(*)::text as value
FROM (
  SELECT l.id
  FROM listings l
  LEFT JOIN listing_amenities la ON l.id = la.listing_id
  GROUP BY l.id
  HAVING COUNT(DISTINCT la.amenity_id) >= 8 AND COUNT(DISTINCT la.amenity_id) <= 12
) subq
UNION ALL
SELECT 
  'Listings with 5-8 reviews' as metric,
  COUNT(*)::text as value
FROM (
  SELECT l.id
  FROM listings l
  LEFT JOIN reviews r ON l.id = r.listing_id
  GROUP BY l.id
  HAVING COUNT(DISTINCT r.id) >= 5 AND COUNT(DISTINCT r.id) <= 8
) subq
UNION ALL
SELECT 
  'Total Reviews' as metric,
  COUNT(*)::text as value
FROM reviews
UNION ALL
SELECT 
  'Total Amenities' as metric,
  COUNT(*)::text as value
FROM amenities
UNION ALL
SELECT 
  'Total Amenity Links' as metric,
  COUNT(*)::text as value
FROM listing_amenities;

-- 8. Sample review comments for quality check
SELECT 
  l.title,
  r.reviewer_name,
  r.review_date,
  LENGTH(r.comment) as comment_length,
  LEFT(r.comment, 100) || '...' as comment_preview
FROM listings l
JOIN reviews r ON l.id = r.listing_id
ORDER BY l.title, r.review_date DESC
LIMIT 10;

