/**
 * Comprehensive listing data generation
 * Maps listing IDs to theme-appropriate amenities and detailed reviews
 */

export interface ReviewData {
  reviewer_name: string;
  reviewer_avatar_url: string | null;
  review_date: string; // YYYY-MM-DD format
  rating_overall: number;
  rating_cleanliness: number;
  rating_accuracy: number;
  rating_communication: number;
  rating_location: number;
  rating_checkin: number;
  rating_value: number;
  comment: string;
}

// Mapping of listing IDs to amenity names
export const ListingAmenityMap: Record<string, string[]> = {
  // Shah Jahan's Marble Suite in Agra - Historical/Mughal
  'bdf429ac-9274-44e1-9986-b43dcffe87e9': [
    'Wi-Fi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Historical preservation',
    'Period-accurate furnishings',
    'Cultural artifacts',
    'Educational materials',
    'Authentic Mughal architecture',
    'Marble craftsmanship',
    'Private courtyard',
    'Guided tour access'
  ],

  // SpaceX Mars Colony Pod at Olympus Mons - Futuristic
  '10b2efa4-819b-4a10-99a0-1f5dc580b080': [
    'Starlink Wi-Fi',
    'Compact galley kitchen',
    'Mars surface view',
    'Life support systems',
    'Climate-controlled habitat',
    'Exploration rovers',
    'Automated fabric recycler',
    'Thermal drying unit',
    'External perimeter monitoring',
    'Cold-storage unit',
    'Companion-friendly',
    'Zero-gravity sleeping pods'
  ],

  // The Lost Atlantean Crystal Villa - Fantasy/Underwater
  'cf84c7ff-aea0-49f3-ad12-3bc09a52326b': [
    'Wi-Fi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Underwater views',
    'Crystal energy systems',
    'Ancient Atlantean technology',
    '360-degree ocean views',
    'Pressure-controlled environment',
    'Marine life observation',
    'Crystal-powered lighting',
    'Underwater access portal'
  ],

  // First-Class Suite in Titanic April 1912 - Historical
  '0580d737-156f-49ea-abcb-621797f493cf': [
    'Wi-Fi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Historical preservation',
    'Period-accurate furnishings',
    '1912 decor',
    'Ocean views',
    'First-class amenities',
    'Period-accurate technology',
    'Cultural artifacts',
    'Authentic experience'
  ],

  // WWII German Resistance Safehouse Loft - Historical
  '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5': [
    'Wi-Fi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Historical preservation',
    'Period-accurate furnishings',
    'Hidden compartments',
    '1940s decor',
    'Covert entry system',
    'Historical artifacts',
    'Educational materials',
    'Authentic safehouse experience'
  ],

  // Pandora Floating Mountain Bungalow - Sci-Fi
  '41f8401a-e8a8-42fa-9809-10604c91d274': [
    'Wi-Fi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Bioluminescent views',
    'Pandoran energy systems',
    'Native flora access',
    'Floating structure tech',
    'Eco-friendly systems',
    'Mountain views',
    'Alien wildlife observation',
    'Na\'vi cultural artifacts'
  ],

  // Ancient Egyptian Nile Villa (Old Kingdom) - Historical
  '32bb68c5-f89a-4a83-a8f3-90b712482575': [
    'Wi-Fi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Historical preservation',
    'Period-accurate furnishings',
    'Nile River access',
    'Ancient Egyptian artifacts',
    'Hieroglyphic decorations',
    'Courtyard gardens',
    'Cultural immersion',
    'Guided historical tours'
  ],

  // Alexander the Great's Campaign Tent - Historical
  '385e8c54-9458-4fc4-8482-4b2efe7efc2b': [
    'Wi-Fi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Historical preservation',
    'Period-accurate furnishings',
    'Military camp atmosphere',
    'Ancient Persian decor',
    'Camp life experience',
    'Historical artifacts',
    'Authentic tent structure',
    'Educational materials'
  ],

  // 1990s Manhattan Loft in Pre-Internet NYC - Retro
  'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93': [
    'Wi-Fi',
    'Kitchen',
    'Air conditioning',
    'Heating',
    'Retro technology',
    'Vintage entertainment',
    'Period-accurate decor',
    'Pre-internet experience',
    '1990s furnishings',
    'Retro electronics',
    'Vintage record player',
    'Classic NYC atmosphere'
  ]
};

// Detailed reviews for each listing
export const ListingReviews: Record<string, ReviewData[]> = {
  // Shah Jahan's Marble Suite in Agra
  'bdf429ac-9274-44e1-9986-b43dcffe87e9': [
    {
      reviewer_name: 'Priya Sharma',
      reviewer_avatar_url: null,
      review_date: '2024-11-15',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.7,
      comment: 'Absolutely breathtaking! The marble craftsmanship is exquisite and the historical authenticity is remarkable. The private courtyard was perfect for morning tea. The guided tour provided incredible insights into Mughal architecture. This is truly a once-in-a-lifetime experience.'
    },
    {
      reviewer_name: 'James Mitchell',
      reviewer_avatar_url: null,
      review_date: '2024-10-22',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 4.9,
      rating_checkin: 5.0,
      rating_value: 4.6,
      comment: 'Stunning suite with incredible attention to detail. The period-accurate furnishings and cultural artifacts made us feel like we stepped back in time. The location near the Taj Mahal is perfect. The host was very knowledgeable about the history.'
    },
    {
      reviewer_name: 'Aisha Khan',
      reviewer_avatar_url: null,
      review_date: '2024-09-30',
      rating_overall: 5.0,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 5.0,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.9,
      comment: 'Pure luxury and historical immersion! Every corner of this suite tells a story. The marble work is museum-quality, and the educational materials helped us appreciate the Mughal era even more. Highly recommend for history enthusiasts.'
    },
    {
      reviewer_name: 'Robert Chen',
      reviewer_avatar_url: null,
      review_date: '2024-08-18',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.7,
      rating_communication: 4.6,
      rating_location: 4.8,
      rating_checkin: 4.9,
      rating_value: 4.5,
      comment: 'Beautiful suite with authentic Mughal architecture. The preservation work is impressive, and the cultural artifacts add to the experience. The kitchen had modern amenities while maintaining the historical aesthetic. Great value for such a unique stay.'
    },
    {
      reviewer_name: 'Sofia Martinez',
      reviewer_avatar_url: null,
      review_date: '2024-07-05',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 4.9,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'An extraordinary experience! The marble suite exceeded all expectations. The attention to historical detail is remarkable, from the furnishings to the architectural elements. The guided tour was informative and the host was incredibly responsive.'
    },
    {
      reviewer_name: 'David Thompson',
      reviewer_avatar_url: null,
      review_date: '2024-06-12',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 4.9,
      rating_checkin: 4.8,
      rating_value: 4.7,
      comment: 'Incredible historical authenticity combined with modern comfort. The period-accurate furnishings and cultural artifacts create an immersive experience. The location is perfect for exploring Agra\'s historical sites. Highly recommend!'
    }
  ],

  // SpaceX Mars Colony Pod at Olympus Mons
  '10b2efa4-819b-4a10-99a0-1f5dc580b080': [
    {
      reviewer_name: 'Dr. Sarah Chen',
      reviewer_avatar_url: null,
      review_date: '2024-11-20',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.9,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'As a planetary scientist, I was blown away by the technical accuracy of this habitat. The life support systems are state-of-the-art, and the Mars surface views from the observation dome are absolutely stunning. The exploration rovers are a fantastic addition. This is the future of space tourism!'
    },
    {
      reviewer_name: 'Marcus Rodriguez',
      reviewer_avatar_url: null,
      review_date: '2024-10-28',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 5.0,
      rating_checkin: 4.9,
      rating_value: 4.6,
      comment: 'Incredible experience! The Starlink Wi-Fi worked perfectly, and the climate-controlled habitat made the stay comfortable despite Mars\' harsh environment. The automated fabric recycler and thermal drying unit are brilliant innovations. The zero-gravity sleeping pods are a unique touch.'
    },
    {
      reviewer_name: 'Dr. Emily Watson',
      reviewer_avatar_url: null,
      review_date: '2024-09-15',
      rating_overall: 5.0,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 5.0,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.9,
      comment: 'Absolutely phenomenal! The life support systems are flawless, and the external perimeter monitoring gives great peace of mind. The cold-storage unit kept our supplies fresh, and the companion-friendly setup was perfect for our research team. This is space exploration at its finest.'
    },
    {
      reviewer_name: 'Alex Kim',
      reviewer_avatar_url: null,
      review_date: '2024-08-22',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.7,
      rating_communication: 4.6,
      rating_location: 4.9,
      rating_checkin: 4.8,
      rating_value: 4.5,
      comment: 'Amazing futuristic experience! The Mars surface views are breathtaking, especially during sunrise. The compact galley kitchen has everything needed, and the exploration rovers made our excursions unforgettable. The habitat feels safe and well-maintained.'
    },
    {
      reviewer_name: 'Dr. Michael Park',
      reviewer_avatar_url: null,
      review_date: '2024-07-10',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 4.9,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Outstanding habitat design! The climate control is perfect, and the life support systems are incredibly reliable. The automated systems make daily life easy, and the views of Olympus Mons are spectacular. This is exactly what I imagined living on Mars would be like.'
    },
    {
      reviewer_name: 'Jessica Liu',
      reviewer_avatar_url: null,
      review_date: '2024-06-25',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 5.0,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Incredible stay on the Red Planet! The habitat is well-designed with all the modern amenities you\'d expect, plus some amazing space-specific features. The thermal drying unit and fabric recycler are game-changers. The host (Elon) was very responsive to questions.'
    },
    {
      reviewer_name: 'Dr. Raj Patel',
      reviewer_avatar_url: null,
      review_date: '2024-05-18',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.9,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'As an aerospace engineer, I\'m impressed by the technical excellence of this habitat. The life support systems are top-notch, and the external monitoring provides excellent security. The exploration rovers are well-maintained and fun to operate. A truly unique experience!'
    }
  ],

  // The Lost Atlantean Crystal Villa
  'cf84c7ff-aea0-49f3-ad12-3bc09a52326b': [
    {
      reviewer_name: 'Marina Delphinus',
      reviewer_avatar_url: null,
      review_date: '2024-11-10',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Absolutely magical! The crystal energy systems create the most beautiful ambient lighting, and the 360-degree ocean views are mesmerizing. The pressure-controlled environment is perfectly maintained. Watching marine life through the crystal walls is an unforgettable experience.'
    },
    {
      reviewer_name: 'Oceanus Triton',
      reviewer_avatar_url: null,
      review_date: '2024-10-05',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 5.0,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Incredible underwater villa! The ancient Atlantean technology is fascinating, and the crystal-powered lighting creates an ethereal atmosphere. The underwater access portal made exploring the ocean depths easy and safe. This is truly a unique experience.'
    },
    {
      reviewer_name: 'Coral Reef',
      reviewer_avatar_url: null,
      review_date: '2024-09-18',
      rating_overall: 5.0,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.9,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.9,
      comment: 'A dream come true! The crystal villa is stunning, and the marine life observation opportunities are incredible. The pressure control is flawless, and the ancient technology adds to the mystique. The underwater views are absolutely breathtaking, especially at night when the bioluminescent creatures pass by.'
    },
    {
      reviewer_name: 'Neptune Wave',
      reviewer_avatar_url: null,
      review_date: '2024-08-12',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.7,
      rating_communication: 4.6,
      rating_location: 5.0,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Amazing underwater experience! The crystal energy systems work perfectly, and the 360-degree views are stunning. The marine life observation is a highlight - we saw so many fascinating creatures. The villa combines ancient mystique with modern comfort beautifully.'
    },
    {
      reviewer_name: 'Aqua Blue',
      reviewer_avatar_url: null,
      review_date: '2024-07-22',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 4.9,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Incredible stay in Atlantis! The crystal villa is beautifully designed, and the underwater access portal is a fantastic feature. The pressure-controlled environment is perfectly maintained, and the crystal-powered lighting creates a magical atmosphere. Highly recommend!'
    },
    {
      reviewer_name: 'Deep Sea Explorer',
      reviewer_avatar_url: null,
      review_date: '2024-06-08',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 5.0,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Fascinating underwater villa! The ancient Atlantean technology is impressive, and the crystal energy systems provide beautiful ambient lighting. The marine life observation is incredible - we saw species we\'ve never encountered before. A truly unique and memorable experience.'
    }
  ],

  // First-Class Suite in Titanic April 1912
  '0580d737-156f-49ea-abcb-621797f493cf': [
    {
      reviewer_name: 'Margaret Astor',
      reviewer_avatar_url: null,
      review_date: '2024-11-08',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Exquisite first-class accommodations! The 1912 decor is meticulously recreated, and the period-accurate furnishings transport you back in time. The ocean views are stunning, and the cultural artifacts add authenticity. This is exactly how I imagined first-class travel on the Titanic would be.'
    },
    {
      reviewer_name: 'William Vanderbilt',
      reviewer_avatar_url: null,
      review_date: '2024-10-15',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 4.9,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Remarkable historical accuracy! The suite captures the elegance of the era perfectly. The period-accurate technology and furnishings create an immersive experience. The ocean views are breathtaking, and the first-class amenities are exactly as described. A truly unique stay.'
    },
    {
      reviewer_name: 'Eleanor Straus',
      reviewer_avatar_url: null,
      review_date: '2024-09-22',
      rating_overall: 5.0,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.9,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.9,
      comment: 'Absolutely magnificent! The historical preservation is outstanding, and every detail reflects the opulence of 1912 first-class travel. The cultural artifacts and period-accurate decor create an authentic experience. The ocean views are spectacular, especially at sunset.'
    },
    {
      reviewer_name: 'John Thayer',
      reviewer_avatar_url: null,
      review_date: '2024-08-30',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.7,
      rating_communication: 4.6,
      rating_location: 4.8,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Beautiful suite with incredible attention to historical detail. The 1912 furnishings and technology are fascinating, and the ocean views are stunning. The authentic experience is enhanced by the cultural artifacts. A wonderful journey back in time.'
    },
    {
      reviewer_name: 'Madeleine Astor',
      reviewer_avatar_url: null,
      review_date: '2024-07-14',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 4.9,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Elegant and historically accurate! The suite perfectly captures the grandeur of Titanic\'s first-class accommodations. The period-accurate decor and cultural artifacts create an immersive experience. The ocean views are magnificent, and the host was very knowledgeable about the ship\'s history.'
    },
    {
      reviewer_name: 'Benjamin Guggenheim',
      reviewer_avatar_url: null,
      review_date: '2024-06-20',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 4.9,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Incredible historical recreation! The suite is beautifully furnished with period-accurate items, and the 1912 technology is fascinating to experience. The ocean views are spectacular, and the cultural artifacts add authenticity. A truly unique and memorable stay.'
    }
  ],

  // WWII German Resistance Safehouse Loft
  '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5': [
    {
      reviewer_name: 'Sophie Scholl',
      reviewer_avatar_url: null,
      review_date: '2024-11-12',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 5.0,
      rating_communication: 4.7,
      rating_location: 4.8,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Powerful and moving experience. The historical preservation is remarkable, and the hidden compartments are fascinating to discover. The 1940s decor and period-accurate furnishings create an authentic atmosphere. The educational materials help you understand the significance of this place.'
    },
    {
      reviewer_name: 'Hans von Dohnanyi',
      reviewer_avatar_url: null,
      review_date: '2024-10-19',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.9,
      rating_communication: 4.6,
      rating_location: 4.7,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Incredible historical significance. The safehouse is well-preserved with authentic 1940s furnishings and hidden compartments that tell a story. The covert entry system adds to the experience. The historical artifacts and educational materials provide important context.'
    },
    {
      reviewer_name: 'Claus von Stauffenberg',
      reviewer_avatar_url: null,
      review_date: '2024-09-25',
      rating_overall: 4.9,
      rating_cleanliness: 4.9,
      rating_accuracy: 5.0,
      rating_communication: 4.8,
      rating_location: 4.8,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'A deeply meaningful stay. The loft preserves the courage and sacrifice of the resistance movement. The hidden compartments and period-accurate decor create an authentic experience. The historical artifacts are carefully curated, and the educational materials are invaluable.'
    },
    {
      reviewer_name: 'Maria von Maltzan',
      reviewer_avatar_url: null,
      review_date: '2024-08-16',
      rating_overall: 4.8,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.9,
      rating_communication: 4.7,
      rating_location: 4.8,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Remarkable preservation of history. The safehouse maintains its authentic character with 1940s furnishings and hidden features. The covert entry system is fascinating, and the historical artifacts tell important stories. A moving and educational experience.'
    },
    {
      reviewer_name: 'Helmuth von Moltke',
      reviewer_avatar_url: null,
      review_date: '2024-07-28',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.8,
      rating_communication: 4.6,
      rating_location: 4.7,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Powerful historical experience. The loft is authentically preserved with period-accurate decor and hidden compartments. The educational materials help you understand the resistance movement\'s significance. The historical artifacts are carefully maintained and tell important stories.'
    }
  ],

  // Pandora Floating Mountain Bungalow
  '41f8401a-e8a8-42fa-9809-10604c91d274': [
    {
      reviewer_name: 'Jake Sully',
      reviewer_avatar_url: null,
      review_date: '2024-11-18',
      rating_overall: 5.0,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.9,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.9,
      comment: 'Absolutely incredible! The bioluminescent views at night are beyond words - watching the native Pandoran life light up the sky is magical. The floating structure technology is fascinating, and the eco-friendly systems work perfectly. The Na\'vi cultural artifacts add authenticity. This is paradise!'
    },
    {
      reviewer_name: 'Neytiri te Tskaha',
      reviewer_avatar_url: null,
      review_date: '2024-10-25',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Beautiful connection with Pandora! The native flora access allows you to experience the planet\'s unique ecosystem up close. The floating structure provides stunning mountain views, and the Pandoran energy systems are impressive. The alien wildlife observation is incredible.'
    },
    {
      reviewer_name: 'Dr. Grace Augustine',
      reviewer_avatar_url: null,
      review_date: '2024-09-12',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.9,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'As a xenobiologist, I\'m amazed by the access to Pandora\'s native flora and wildlife. The bungalow\'s eco-friendly systems are perfectly integrated with the environment. The bioluminescent displays are spectacular, and the floating structure technology is remarkable. A researcher\'s dream!'
    },
    {
      reviewer_name: 'Norm Spellman',
      reviewer_avatar_url: null,
      review_date: '2024-08-20',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 5.0,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Incredible experience on Pandora! The floating mountain bungalow offers breathtaking views, and the bioluminescent displays at night are mesmerizing. The Pandoran energy systems are fascinating, and the native flora access is a unique feature. The Na\'vi artifacts add cultural depth.'
    },
    {
      reviewer_name: 'Trudy Chacón',
      reviewer_avatar_url: null,
      review_date: '2024-07-05',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 4.9,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Absolutely stunning! The floating structure provides incredible views of Pandora\'s landscape. The bioluminescent views are the highlight - watching the native life light up at night is unforgettable. The eco-friendly systems work perfectly, and the mountain views are spectacular.'
    },
    {
      reviewer_name: 'Dr. Max Patel',
      reviewer_avatar_url: null,
      review_date: '2024-06-15',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 5.0,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Fascinating stay on Pandora! The floating mountain bungalow is beautifully designed, and the Pandoran energy systems are impressive. The native flora access and alien wildlife observation opportunities are incredible. The bioluminescent displays are truly magical. Highly recommend!'
    },
    {
      reviewer_name: 'Tsu\'tey',
      reviewer_avatar_url: null,
      review_date: '2024-05-22',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Beautiful connection with Eywa! The bungalow respects Pandora\'s ecosystem with its eco-friendly systems. The floating structure provides amazing views, and the Na\'vi cultural artifacts honor our traditions. The bioluminescent displays are breathtaking. A true Pandoran experience!'
    }
  ],

  // Ancient Egyptian Nile Villa (Old Kingdom)
  '32bb68c5-f89a-4a83-a8f3-90b712482575': [
    {
      reviewer_name: 'Cleopatra VII',
      reviewer_avatar_url: null,
      review_date: '2024-11-14',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Magnificent villa with authentic Old Kingdom architecture! The hieroglyphic decorations are beautifully preserved, and the Nile River access is perfect for morning boat rides. The courtyard gardens are peaceful, and the ancient Egyptian artifacts are fascinating. The guided historical tours are informative.'
    },
    {
      reviewer_name: 'Ramesses II',
      reviewer_avatar_url: null,
      review_date: '2024-10-21',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 5.0,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Incredible historical immersion! The villa\'s period-accurate furnishings and hieroglyphic decorations create an authentic Old Kingdom atmosphere. The Nile River access is wonderful, and the cultural artifacts are well-curated. The guided tours provide excellent historical context.'
    },
    {
      reviewer_name: 'Hatshepsut',
      reviewer_avatar_url: null,
      review_date: '2024-09-28',
      rating_overall: 5.0,
      rating_cleanliness: 5.0,
      rating_accuracy: 5.0,
      rating_communication: 4.9,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.9,
      comment: 'Exquisite villa with remarkable historical preservation! The Old Kingdom architecture is authentic, and the hieroglyphic decorations are stunning. The Nile views are breathtaking, especially at sunrise. The courtyard gardens are peaceful, and the cultural immersion experience is unparalleled.'
    },
    {
      reviewer_name: 'Tutankhamun',
      reviewer_avatar_url: null,
      review_date: '2024-08-14',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.7,
      rating_communication: 4.6,
      rating_location: 4.9,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Beautiful villa with authentic Egyptian character! The period-accurate furnishings and hieroglyphic decorations create an immersive experience. The Nile River access is fantastic, and the ancient artifacts are fascinating. The guided tours help you appreciate the historical significance.'
    },
    {
      reviewer_name: 'Nefertiti',
      reviewer_avatar_url: null,
      review_date: '2024-07-30',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 4.9,
      rating_communication: 4.8,
      rating_location: 5.0,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Stunning villa with incredible attention to historical detail! The Old Kingdom architecture and hieroglyphic decorations are beautifully preserved. The Nile views are spectacular, and the courtyard gardens provide a peaceful retreat. The cultural artifacts and guided tours enhance the experience.'
    },
    {
      reviewer_name: 'Imhotep',
      reviewer_avatar_url: null,
      review_date: '2024-06-18',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 5.0,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Remarkable historical authenticity! The villa captures the essence of Old Kingdom Egypt perfectly. The hieroglyphic decorations and period-accurate furnishings create an immersive experience. The Nile River access and courtyard gardens are highlights. The guided historical tours are excellent.'
    }
  ],

  // Alexander the Great's Campaign Tent
  '385e8c54-9458-4fc4-8482-4b2efe7efc2b': [
    {
      reviewer_name: 'Hephaestion',
      reviewer_avatar_url: null,
      review_date: '2024-11-16',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 5.0,
      rating_communication: 4.7,
      rating_location: 4.8,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Authentic military camp experience! The tent structure is impressive, and the period-accurate furnishings transport you to Alexander\'s campaigns. The military camp atmosphere is well-captured, and the ancient Persian decor adds authenticity. The historical artifacts are fascinating.'
    },
    {
      reviewer_name: 'Ptolemy I',
      reviewer_avatar_url: null,
      review_date: '2024-10-23',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.9,
      rating_communication: 4.6,
      rating_location: 4.7,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Incredible historical recreation! The campaign tent is authentically designed with period-accurate furnishings and ancient Persian decor. The military camp atmosphere is immersive, and the historical artifacts provide context. The educational materials help you understand the era.'
    },
    {
      reviewer_name: 'Craterus',
      reviewer_avatar_url: null,
      review_date: '2024-09-30',
      rating_overall: 4.9,
      rating_cleanliness: 4.9,
      rating_accuracy: 5.0,
      rating_communication: 4.8,
      rating_location: 4.8,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Remarkable authenticity! The tent captures the essence of Alexander\'s military campaigns perfectly. The period-accurate furnishings and ancient Persian decor create an immersive experience. The camp life atmosphere is well-maintained, and the historical artifacts are carefully curated.'
    },
    {
      reviewer_name: 'Seleucus I',
      reviewer_avatar_url: null,
      review_date: '2024-08-18',
      rating_overall: 4.8,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.9,
      rating_communication: 4.7,
      rating_location: 4.8,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Fascinating historical experience! The campaign tent is beautifully designed with authentic 4th century BCE military furnishings. The ancient Persian decor and military camp atmosphere create an immersive experience. The historical artifacts and educational materials are excellent.'
    },
    {
      reviewer_name: 'Perdiccas',
      reviewer_avatar_url: null,
      review_date: '2024-07-12',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.8,
      rating_communication: 4.6,
      rating_location: 4.7,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Authentic military camp experience! The tent structure is impressive, and the period-accurate furnishings are fascinating. The ancient Persian decor adds authenticity, and the camp life atmosphere is well-captured. The historical artifacts provide valuable context.'
    }
  ],

  // 1990s Manhattan Loft in Pre-Internet NYC
  'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93': [
    {
      reviewer_name: 'Sarah Chen',
      reviewer_avatar_url: null,
      review_date: '2024-11-22',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 4.9,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Nostalgic trip back to the 90s! The retro technology and vintage entertainment are fantastic - the record player still works perfectly. The period-accurate decor captures that pre-internet NYC vibe beautifully. The vintage electronics are a fun touch, and the classic Manhattan atmosphere is spot-on.'
    },
    {
      reviewer_name: 'Mike Johnson',
      reviewer_avatar_url: null,
      review_date: '2024-10-30',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.7,
      rating_communication: 4.6,
      rating_location: 4.8,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Great retro experience! The 1990s furnishings and technology are authentic, and the pre-internet experience is refreshing. The vintage entertainment options are fun, and the period-accurate decor creates a genuine 90s NYC atmosphere. The location is perfect for exploring Manhattan.'
    },
    {
      reviewer_name: 'Jennifer Martinez',
      reviewer_avatar_url: null,
      review_date: '2024-09-20',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 4.9,
      rating_communication: 4.8,
      rating_location: 4.9,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Absolutely loved the 90s vibe! The retro technology is fascinating to experience, and the vintage record player is a highlight. The period-accurate decor and 1990s furnishings create an authentic pre-internet NYC experience. The classic Manhattan atmosphere is perfect.'
    },
    {
      reviewer_name: 'David Kim',
      reviewer_avatar_url: null,
      review_date: '2024-08-26',
      rating_overall: 4.8,
      rating_cleanliness: 4.9,
      rating_accuracy: 4.8,
      rating_communication: 4.7,
      rating_location: 4.9,
      rating_checkin: 4.9,
      rating_value: 4.7,
      comment: 'Nostalgic and fun! The retro technology and vintage entertainment take you back to a simpler time. The period-accurate decor is well-maintained, and the pre-internet experience is refreshing. The 1990s furnishings and classic NYC atmosphere make this a unique stay.'
    },
    {
      reviewer_name: 'Lisa Thompson',
      reviewer_avatar_url: null,
      review_date: '2024-07-18',
      rating_overall: 4.7,
      rating_cleanliness: 4.8,
      rating_accuracy: 4.7,
      rating_communication: 4.6,
      rating_location: 4.8,
      rating_checkin: 4.8,
      rating_value: 4.6,
      comment: 'Great retro loft! The 1990s decor and technology are authentic, and the vintage entertainment options are entertaining. The period-accurate furnishings create a genuine pre-internet NYC experience. The location in Manhattan is perfect for exploring the city.'
    },
    {
      reviewer_name: 'Robert Williams',
      reviewer_avatar_url: null,
      review_date: '2024-06-28',
      rating_overall: 4.9,
      rating_cleanliness: 5.0,
      rating_accuracy: 4.9,
      rating_communication: 4.8,
      rating_location: 4.9,
      rating_checkin: 5.0,
      rating_value: 4.8,
      comment: 'Amazing 90s experience! The retro technology and vintage record player are highlights. The period-accurate decor and 1990s furnishings create an authentic pre-internet atmosphere. The classic Manhattan location is perfect, and the vintage electronics add to the charm.'
    }
  ]
};

