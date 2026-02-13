# Product Requirements Document (PRD)
## Airbnb Time Travel - Booking Platform

**Version:** 2.0  
**Last Updated:** January 2026  
**Status:** In Development

---

## 1. Executive Summary

### 1.1 Product Vision
Airbnb Time Travel is a comical, fun side project that imagines Airbnb launching a time travel feature. Users can "book" accommodations across different historical eras and futuristic settings, complete with whimsical time travel mechanics, vehicle selection, and cryptocurrency payments. The platform combines entertainment value with polished technical execution.

### 1.2 Problem Statement
This is a creative, humorous take on the Airbnb booking experience, designed to be visually appealing and entertaining while showcasing modern web development capabilities.

### 1.3 Target Audience
- **Primary:** Developers, designers, and tech enthusiasts
- **Secondary:** General users looking for an entertaining, interactive experience
- **Tertiary:** Potential employers/clients evaluating technical skills

---

## 2. Product Overview

### 2.1 Core Concept
A fully functional, comical Airbnb-style booking platform featuring:
- **Time Travel Bookings:** Accommodations from historical periods and futuristic settings
- **Time Frame Selection:** Users select duration (not specific dates) - time doesn't pass, you just go and come back
- **Vehicle Selection:** Choose your time travel method (DeLorean, Time Stone, Dr. Strange, TARDIS)
- **Cryptocurrency Payments:** Pay with Bitcoin, Ethereum, or USTC
- **Optional Add-ons:** e.g. Emergency Extraction for temporal rescue
- **Post-Booking Summary:** After reserving, users see a confirmation status (e.g. "We're securing your arrival window"), their listing image, and can share on social (Twitter, LinkedIn) or give feedback via a modal
- **Enhanced Search:** Filter by era (past/future), geography, guest count
- **Easter Eggs:** Hidden interactive elements for discovery

### 2.2 Key Differentiators
1. **Comical & Fun:** Whimsical time travel mechanics and vehicle selection
2. **Visual Excellence:** Highly polished, visually appealing design
3. **Interactive Elements:** Easter eggs and engaging micro-interactions
4. **Modern Tech:** React 19, TypeScript, Supabase, Tailwind CSS

---

## 3. Goals & Objectives

### 3.1 Primary Goals
1. **Entertainment Value**
   - Create a fun, memorable user experience
   - Include easter eggs and interactive surprises
   - Maintain comical tone throughout

2. **Visual Appeal**
   - Highly polished, beautiful UI/UX
   - Smooth animations and transitions
   - Professional-quality imagery

3. **Technical Excellence**
   - Modern React patterns and best practices
   - Responsive, performant implementation
   - Clean, maintainable codebase

### 3.2 Success Criteria
- ✅ Users can browse and filter listings by era/geography
- ✅ Users can select time frame (duration) for their trip
- ✅ Users can choose time travel vehicle with unique messaging
- ✅ Users can optionally add emergency extraction (or other add-ons)
- ✅ Users can complete booking with cryptocurrency selection
- ✅ After booking, users see a confirmation status and summary page with listing image
- ✅ Users can share their booking (e.g. Twitter, LinkedIn) and give feedback via modal
- ✅ Beautiful, engaging confirmation and post-booking experience
- ✅ Easter eggs discovered and enjoyed
- ✅ Application works seamlessly on all devices

---

## 4. User Stories

### 4.1 As a Visitor Browsing
- **US-1:** I want to browse available time travel listings
- **US-2:** I want to filter listings by era (Past/Future)
- **US-3:** I want to filter listings by geographical location
- **US-4:** I want to filter by number of guests
- **US-5:** I want to see listing cards with images, titles, prices, and ratings
- **US-6:** I want to discover easter eggs while browsing

### 4.2 As a User Viewing a Listing
- **US-7:** I want to see a photo gallery with multiple images
- **US-8:** I want to read detailed descriptions of the property
- **US-9:** I want to see host information and profile
- **US-10:** I want to view amenities with icons
- **US-11:** I want to read reviews from previous time travelers
- **US-12:** I want to select a time frame (duration) for my trip
- **US-13:** I want to see a note explaining that time doesn't change (you go and come back)
- **US-14:** I want to see pricing that updates based on duration and guest count
- **US-15:** I want to proceed to booking

### 4.3 As a User Booking
- **US-16:** I want to select my time travel vehicle (DeLorean, Time Stone, Dr. Strange, TARDIS)
- **US-17:** I want to see vehicle-specific messages and nuances
- **US-18:** I want to see how vehicle selection affects pricing
- **US-19:** I want to optionally add emergency extraction to my booking
- **US-20:** I want to select payment currency (Bitcoin, Ethereum, USTC)
- **US-21:** I want to see a fancy, engaging payment/confirmation step
- **US-22:** I want to enter my email to receive confirmation
- **US-23:** I want to see my booking details clearly displayed before completing

### 4.4 After Booking (Summary / Confirmation Status)
- **US-24:** I want to see a confirmation status (e.g. "We're securing your arrival window") after I complete my booking
- **US-25:** I want to see a picture of my booked listing on the confirmation summary page
- **US-26:** I want to share my booking on social (e.g. Twitter, LinkedIn) via a share button
- **US-27:** I want to give feedback via a button that opens a feedback modal
- **US-28:** I want to go back to the listing, go to the homepage, or stay on the summary page

### 4.5 As a Future Host (Roadmap)
- **US-29:** I want to suggest a new time travel listing
- **US-30:** I want to submit listing details and images
- **US-31:** I want to see my submission status

---

## 5. Features & Functionality

### 5.1 Homepage (`/`)
**Components:**
- Header with navigation (Homes, Experiences, Services, **Time Travel**)
- Enhanced search/filter bar:
  - Era selector (Past / Future / All)
  - Geography filter (dropdown or search)
  - Guest count selector
  - Search button
- Hero grid of listing cards
- Loading states (skeleton loaders)
- Error handling with fallback to mock data

**Features:**
- Filter listings by era (historical vs. futuristic)
- Filter by geographical location
- Filter by guest capacity
- Display all matching listings in responsive grid
- Each card shows: image, title, price, rating, era indicator, guest favorite badge
- Click to navigate to listing detail page
- Heart icon for favorites (UI only)
- Smooth animations using Framer Motion
- **Easter Eggs:** Hidden interactive elements throughout

**Data Source:**
- Primary: Supabase `listings` table
- Fallback: Mock data if Supabase not configured

### 5.2 Listing Detail Page (`/listing/:id`)
**Components:**
- Photo viewer with image gallery
- Host information section
- Amenities grid with icons
- Reviews section
- **Time Frame Booking Widget:**
  - Duration selector (1 night, 2 nights, 3 nights, 1 week, etc.)
  - Guest count selector
  - **Important Note:** "Time doesn't change - you'll travel there and return to the same moment you left"
  - Real-time price calculation
  - Book button
- Key features highlight
- Cancellation policy
- Sleeping arrangements

**Features:**
- Full-screen photo viewer with navigation
- Detailed property description with era context
- Host profile with avatar, superhost badge, response rate
- Amenity icons (custom SVG fallbacks or URL-based)
- Review cards with ratings breakdown
- **Time Frame Selection:** Users select duration, not specific dates
- **Price Calculation:** Based on duration × price_per_night × guest_count
- Vehicle selection happens on confirmation page (not here)

**Data Sources:**
- `listings` table (main listing data)
- `hosts` table (host information)
- `listing_images` table (photo gallery)
- `amenities` + `listing_amenities` (amenities)
- `reviews` table (guest reviews)

### 5.3 Booking/Confirmation Flow (`/listing/:id/confirm`)

The flow has four steps (vehicle → optional add-on → payment → submit), then a **post-booking summary page**.

#### Step 1: Vehicle Selection
**Components:**
- Vehicle selection interface
- Vehicle cards with:
  - Vehicle name and icon/image
  - Description
  - Unique characteristics/messages
  - Price modifier (if applicable)
- Selected vehicle highlight
- Continue button

**Available Vehicles:**
1. **DeLorean Time Machine** (Back to the Future)
   - Message: "Great Scott! 88 mph required. Watch out for lightning!"
   - Nuance: "Classic choice, but may experience temporal paradoxes"
   - Price: Base price

2. **Time Stone** (Marvel/Infinity Stones)
   - Message: "The Time Stone grants you control over time itself"
   - Nuance: "Most reliable, but requires mastery of the mystic arts"
   - Price: +10% premium

3. **Dr. Strange Portal** (Marvel)
   - Message: "Open a portal to any time period instantly"
   - Nuance: "Fastest method, but may cause dimensional rifts"
   - Price: +15% premium

4. **TARDIS** (Doctor Who)
   - Message: "It's bigger on the inside! The Doctor's preferred method"
   - Nuance: "Most spacious, but may arrive slightly off-target"
   - Price: +20% premium (most expensive, but most comfortable)

**Features:**
- Visual vehicle selection (cards or buttons)
- Vehicle-specific messaging displayed on selection
- Price update based on vehicle selection
- Smooth transitions between selections

#### Step 2: Optional Add-ons (e.g. Emergency Extraction)
**Components:**
- Optional add-on selector (e.g. "Emergency Extraction" for temporal rescue)
- Price impact display
- Continue button

**Features:**
- User can opt in or skip
- Price updates if add-on selected
- Clear, comical copy for the add-on

#### Step 3: Currency & Payment
**Components:**
- Currency selector (Bitcoin, Ethereum, USTC)
- Current exchange rates display (mock or real-time)
- Price conversion display
- Email input field
- "Complete booking" / "Reserve" button

**Features:**
- Select payment currency
- Show price in selected currency (including add-ons)
- Display exchange rate information
- Email capture for confirmation
- On submit: save booking, then navigate to post-booking summary page

#### Step 4: Post-Booking Summary Page (Confirmation Status)

After the user completes the reservation, they land on a **summary/confirmation status page**.

**Components:**
- **Confirmation status message** (e.g. "We're securing your arrival window")
- **Picture of the booked listing** (main image or gallery highlight)
- **Booking summary** (listing name, duration, guests, vehicle, total, booking ID)
- **Actions:**
  - **Share** – Button(s) to share on Twitter, LinkedIn, or other platforms (opens share intent or copy link)
  - **Give feedback** – Button that opens a **feedback modal** (form or quick survey)
  - **Go to homepage** – Navigate back to `/`
  - **View listing** – Navigate back to the listing detail page

**Features:**
- Reassuring, fun status copy so the user knows the booking is confirmed
- Prominent listing image for visual confirmation
- Share and feedback increase engagement and optional viral/sentiment capture
- Clear next steps (browse more, return to listing, or leave feedback)

**Data Storage (bookings table):**
- `listing_id`
- `listing_title`
- `duration_nights`
- `guest_count`
- `vehicle_type`
- `emergency_extraction` (optional boolean or add-on flag)
- `currency_type`
- `price_usd`
- `price_crypto` (calculated)
- `email` (optional)
- `status` ('confirmed')
- `created_at`

---

## 6. Technical Architecture

### 6.1 Frontend Stack
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **UI Components:** Custom components + Radix UI primitives
- **State Management:** React hooks (useState, useEffect, useContext)
- **Form Handling:** React Hook Form + Zod validation

### 6.2 Backend Stack
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (for listing images)
- **API:** Supabase REST API via `@supabase/supabase-js`
- **Email:** Supabase Edge Functions or external service (SendGrid, Resend)

### 6.3 Database Schema Updates

**New Fields for `listings` table:**
- `era` (enum: 'past', 'future') - for filtering
- `geographical_location` (text) - for geography filtering
- `min_guests` (integer)
- `max_guests` (integer)

**New Fields for `bookings` table:**
- `duration_nights` (integer) - replaces date range
- `vehicle_type` (enum: 'delorean', 'time_stone', 'dr_strange', 'tardis')
- `emergency_extraction` (boolean, optional) - whether user added emergency extraction add-on
- `currency_type` (enum: 'bitcoin', 'ethereum', 'ustc')
- `price_crypto` (decimal) - price in selected cryptocurrency
- `email` (text, nullable) - for confirmation emails

**New Table: `listing_suggestions` (Future)**
- `id` (uuid)
- `suggested_by_email` (text)
- `title` (text)
- `description` (text)
- `era` (enum)
- `geographical_location` (text)
- `status` (enum: 'pending', 'approved', 'rejected')
- `created_at` (timestamp)

### 6.4 Key Files Structure
```
src/
├── App.tsx                    # Main app, routing
├── components/
│   ├── generated/
│   │   └── Component.tsx     # Homepage with enhanced search
│   ├── ListingDetailPage.tsx  # Listing detail with time frame selector
│   ├── ConfirmationPage.tsx   # Multi-step booking flow
│   ├── VehicleSelector.tsx    # Vehicle selection component
│   ├── CurrencySelector.tsx   # Currency selection component
│   ├── BookingSummary.tsx     # Confirmation display
│   ├── SearchFilters.tsx      # Enhanced search/filter component
│   ├── PhotoViewer.tsx        # Image gallery
│   └── [skeletons, loaders]   # Loading states
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── supabase-queries.ts   # Data fetching functions
│   ├── currency-converter.ts # Crypto price conversion
│   └── easter-eggs.ts        # Easter egg utilities
├── hooks/
│   ├── use-vehicle-pricing.ts # Vehicle price calculations
│   └── use-currency.ts       # Currency conversion hook
└── types/
    └── database.ts           # TypeScript types
```

---

## 7. Vehicle System Details

### 7.1 Vehicle Types & Characteristics

| Vehicle | Base Price Modifier | Unique Message | Special Features |
|---------|-------------------|----------------|------------------|
| DeLorean | 0% (base) | "Great Scott! 88 mph required" | Classic, reliable |
| Time Stone | +10% | "Control over time itself" | Most reliable |
| Dr. Strange | +15% | "Instant portal travel" | Fastest method |
| TARDIS | +20% | "Bigger on the inside!" | Most spacious, premium |

### 7.2 Vehicle-Specific Easter Eggs
- **DeLorean + Historical Listings:** "You'll need 1.21 gigawatts for this trip!"
- **TARDIS + Futuristic Listings:** "The Doctor approves of this destination"
- **Time Stone + Ancient Listings:** "The Ancient One would be proud"
- **Dr. Strange + Any Listing:** "By the Hoary Hosts of Hoggoth!"

---

## 8. Enhanced Search & Filtering

### 8.1 Filter Options

**Era Filter:**
- Past (all historical listings)
- Future (all futuristic listings)
- All (default)

**Geography Filter:**
- Dropdown or searchable list
- Options: Mars, Atlantis, Pandora, Agra, Egypt, Manhattan, etc.
- "Any Location" (default)

**Guest Count:**
- Number input or slider
- Filters listings by `min_guests` and `max_guests`
- Default: 1 guest

**Search Implementation:**
- Real-time filtering as user selects options
- URL query parameters for shareable filtered views
- Clear filters button
- Results count display

---

## 9. Easter Eggs & Interactive Elements

### 9.1 Easter Egg Ideas
1. **Konami Code:** Enter code to unlock special listing
2. **Hidden Messages:** Click certain elements multiple times
3. **Vehicle Combinations:** Special messages for specific vehicle + listing combos
4. **Time Travel Jokes:** Random humorous messages
5. **Hidden Credits:** Click logo 10 times
6. **Secret Listing:** Unlockable listing via easter egg
7. **Animation Surprises:** Unexpected animations on interactions
8. **Console Messages:** Fun messages in browser console

### 9.2 Implementation
- Centralized easter egg system
- Track discovered easter eggs (localStorage)
- Achievement-style notifications
- Shareable easter egg discoveries

---

## 10. Current Listings

### 10.1 Historical Listings (Past)
1. **Alexander the Great's Campaign Tent** (330 BCE) - Greece/Macedonia
2. **Shah Jahan's Marble Suite** - Agra, 1650
3. **Titanic First-Class Suite** - April 1912 (alternate timeline)
4. **WWII German Resistance Safehouse Loft** - 1940s
5. **1990s Manhattan Loft** - Pre-Internet NYC
6. **Ancient Egyptian Nile Villa** (Old Kingdom) - Egypt
7. **Bermuda Triangle Research Platform** - Atlantic, 1953
8. **Area 51 Classified Barracks** - Nevada, 1962
9. **Premium Cave Dwelling** - Lascaux, 15,000 BCE

### 10.2 Futuristic/Fantasy Listings (Future)
1. **SpaceX Mars Colony Pod** - Olympus Mons Base, 2150
2. **The Lost Atlantean Crystal Villa** - Atlantis
3. **Pandora Floating Mountain Bungalow** - Pandora
4. **Neo-Showa Capsule Pod in Parallel Tokyo 2087** - Neo-Shinjuku District, Parallel Tokyo
5. **Lunar Hilton Penthouse** - Moon, 2156
6. **Federation Ambassador Suite** - Earth, 2364

---

## 11. Future Roadmap

### 11.1 Phase 2: Enhanced Features
- [ ] **Become a Host Feature**
  - Submission form for new listings
  - Image upload
  - Admin review system
  - Approval workflow

- [ ] **Enhanced Search**
  - Full-text search
  - Advanced filters (price range, rating)
  - Saved searches

- [ ] **User Accounts** (optional)
  - Booking history
  - Saved favorites
  - Profile management

### 11.2 Phase 3: Advanced Features
- [ ] **More Vehicles**
  - Custom vehicle creation
  - Vehicle comparison tool
  - Vehicle-specific amenities

- [ ] **Social Features**
  - Share bookings
  - Time travel stories/experiences
  - Community reviews

- [ ] **Gamification**
  - Achievement system
  - Time traveler badges
  - Leaderboard (most bookings)

### 11.3 Technical Improvements
- [ ] Real cryptocurrency integration (testnet)
- [ ] Email service integration
- [ ] Analytics dashboard
- [ ] Performance optimizations
- [ ] SEO improvements
- [ ] PWA capabilities

---

## 12. Success Metrics

### 12.1 Technical Metrics
- ✅ Page load time < 2 seconds
- ✅ Time to interactive < 3 seconds
- ✅ Lighthouse performance score > 90
- ✅ Zero console errors
- ✅ Responsive on all devices

### 12.2 Functional Metrics
- ✅ All filters work correctly
- ✅ Vehicle selection updates pricing
- ✅ Currency conversion accurate
- ✅ Booking flow completes
- ✅ Email confirmation sent
- ✅ Data persists correctly

### 12.3 Engagement Metrics
- ✅ Easter eggs discovered
- ✅ Users complete full booking flow
- ✅ Time spent on site
- ✅ Return visits
- ✅ Social shares

---

## 13. Constraints & Assumptions

### 13.1 Constraints
- No real payment processing (cryptocurrency is mock/demo)
- No actual time travel (obviously!)
- All listings are fictional
- Supabase free tier limitations

### 13.2 Assumptions
- Users understand comical/fictional nature
- Cryptocurrency prices can be mock or use public API
- Email service available (Supabase or external)
- Images are AI-generated or stock photos

---

## 14. Design Principles

### 14.1 Visual Appeal
- **Modern, Clean Design:** Minimalist with bold accents
- **Smooth Animations:** Every interaction feels polished
- **High-Quality Imagery:** Professional photos for all listings
- **Consistent Branding:** Cohesive color scheme and typography

### 14.2 User Experience
- **Intuitive Navigation:** Clear, obvious user flows
- **Delightful Micro-interactions:** Surprising, fun details
- **Responsive Design:** Perfect on mobile, tablet, desktop
- **Accessibility:** Keyboard navigation, screen reader support

### 14.3 Tone & Voice
- **Comical but Professional:** Fun without being unprofessional
- **Self-Aware Humor:** Acknowledge the absurdity
- **Engaging Copy:** Entertaining descriptions and messages

---

## 15. Implementation Priority

### 15.1 Must Have (MVP)
1. Enhanced search/filtering (era, geography, guests)
2. Time frame selection (duration, not dates)
3. Vehicle selection with pricing
4. Optional add-ons (e.g. emergency extraction)
5. Currency selection and payment step
6. Post-booking summary page: confirmation status ("We're securing your arrival window"), listing image, share (Twitter, LinkedIn), feedback modal, go home / back to listing
7. Email input and confirmation
8. Basic easter eggs

### 15.2 Should Have (Phase 1)
1. Vehicle-specific messages and nuances
2. Enhanced easter egg system
3. More vehicle options
4. Improved animations

### 15.3 Nice to Have (Phase 2+)
1. Become a Host feature
2. User accounts
3. Social sharing
4. Advanced gamification

---

## 16. Approval & Sign-off

**Product Owner:** [To be filled]  
**Technical Lead:** [To be filled]  
**Design Lead:** [To be filled]  
**Date:** January 2026

---

**Document Status:** Updated v2.0  
**Next Review Date:** [To be scheduled]


