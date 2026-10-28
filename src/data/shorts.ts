import { ShortVideo, LiveStream } from '../types';

export const INITIAL_SHORTS: ShortVideo[] = [
  {
    id: 'short-1',
    thumbnailUrl: '/src/assets/images/short_streetwear_reel_1793094079389.jpg',
    creator: {
      id: 'creator-kabir',
      name: 'Kabir Verma',
      handle: '@kabir_styles',
      avatar: '/src/assets/images/men_collection_urban_jacket_1793091783710.jpg',
      verified: true,
      followersCount: 420000,
      bio: 'Daily minimalist streetwear & urban fits. Living in oversized linen & chunky soles.'
    },
    caption: 'Commute fit check ☕ Oversized linen overshirt + chunky carved sole sneakers. Super breathable for all-day wear! Tap the tagged product chip to get 50% OFF today!',
    tags: ['#OOTD', '#StreetwearDrop', '#LinenStyle', '#HipiShop', '#MenFashion'],
    music: {
      title: 'Golden Loft Beats (VIP Mix)',
      artist: 'Lo-Fi Collective',
      genre: 'Chillhop'
    },
    stats: {
      likes: 34200,
      comments: 184,
      shares: 4200,
      saves: 8900,
      views: 185000
    },
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    taggedProductIds: ['gp-men-01', 'gp-footwear-01'],
    hotspots: [
      {
        productId: 'gp-men-01',
        xPercent: 52,
        yPercent: 40,
        label: 'Linen Overshirt ₹1,999'
      },
      {
        productId: 'gp-footwear-01',
        xPercent: 54,
        yPercent: 88,
        label: 'Apex Chunky Sneakers ₹2,799'
      }
    ],
    commentsList: [
      {
        id: 'c-101',
        user: 'Vikram Mehta',
        avatar: '/src/assets/images/footwear_chunky_sneakers_1793091785164.jpg',
        text: 'The sneakers look insane in real life! Just added to bag.',
        timestamp: '2h ago',
        likes: 34
      },
      {
        id: 'c-102',
        user: 'Pooja Roy',
        avatar: '/src/assets/images/women_collection_festive_fusion_1793091785102.jpg',
        text: 'What size overshirt are you wearing Kabir? Looks great!',
        timestamp: '5h ago',
        likes: 19
      },
      {
        id: 'c-103',
        user: 'Aman Deep',
        avatar: '/src/assets/images/accessories_leather_tote_1793091786143.jpg',
        text: 'Clean aesthetic bro. Applied coupon and got ₹300 off!',
        timestamp: '8h ago',
        likes: 12
      }
    ],
    videoVibeColor: '#4A5340',
    categoryTag: 'STREETWEAR'
  },
  {
    id: 'short-2',
    thumbnailUrl: '/src/assets/images/short_festive_fusion_1793094080182.jpg',
    creator: {
      id: 'creator-ananya',
      name: 'Ananya Deshmukh',
      handle: '@ananya_glam',
      avatar: '/src/assets/images/women_collection_festive_fusion_1793091785102.jpg',
      verified: true,
      followersCount: 890000,
      bio: 'Fashion curator & wedding guest wardrobe specialist ✨ Modern silhouettes with Indian roots.'
    },
    caption: 'Festive season sorted with this Emerald Raw Silk Co-ord ✨ The zari detailing on the jacket is pure royal elegance. Tap "Shop Look" to grab yours before stock runs out!',
    tags: ['#FestiveGlam', '#EthnicFusion', '#RawSilk', '#WeddingOOTD', '#HipiBestseller'],
    music: {
      title: 'Zari & Dhol Bassline',
      artist: 'Desi Fusion Lab',
      genre: 'Electro Folk'
    },
    stats: {
      likes: 88500,
      comments: 342,
      shares: 9800,
      saves: 21400,
      views: 420000
    },
    isLiked: true,
    isSaved: true,
    isFollowing: true,
    taggedProductIds: ['gp-women-01', 'gp-acc-01'],
    hotspots: [
      {
        productId: 'gp-women-01',
        xPercent: 55,
        yPercent: 44,
        label: 'Emerald Silk Co-ord ₹3,499'
      },
      {
        productId: 'gp-acc-01',
        xPercent: 74,
        yPercent: 55,
        label: 'Cognac Leather Tote ₹2,499'
      }
    ],
    commentsList: [
      {
        id: 'c-201',
        user: 'Meera Kapoor',
        avatar: '/src/assets/images/short_beauty_skincare_1793094079976.jpg',
        text: 'Wore this to my cousin s sangeet, got so many compliments!',
        timestamp: '1h ago',
        likes: 82
      },
      {
        id: 'c-202',
        user: 'Simran Chawla',
        avatar: '/src/assets/images/hero_gpark_summer_edit_1793091770554.jpg',
        text: 'Does this come with the inner slip? Fabric feels so premium.',
        timestamp: '3h ago',
        likes: 41
      }
    ],
    videoVibeColor: '#084C38',
    categoryTag: 'FESTIVE'
  },
  {
    id: 'short-3',
    thumbnailUrl: '/src/assets/images/short_luxury_watch_1793094080929.jpg',
    creator: {
      id: 'creator-rohan',
      name: 'Rohan Singhania',
      handle: '@rohan_edits',
      avatar: '/src/assets/images/short_streetwear_reel_1793094079389.jpg',
      verified: true,
      followersCount: 310000,
      bio: 'Minimalist tech & everyday carry essentials. Precision craftsmanship reviewed.'
    },
    caption: 'Unboxing my holy grail work gear 💼 Grade-2 aerospace titanium chronograph with sapphire glass & vegetable tanned leather tote. Tap the hot-spot to shop directly!',
    tags: ['#EDC', '#TitaniumWatch', '#LeatherTote', '#WorkEssentials', '#HipiShop'],
    music: {
      title: 'Midnight Velocity',
      artist: 'Synthetix',
      genre: 'Synthwave'
    },
    stats: {
      likes: 42100,
      comments: 128,
      shares: 3100,
      saves: 11200,
      views: 210000
    },
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    taggedProductIds: ['gp-acc-02', 'gp-acc-01'],
    hotspots: [
      {
        productId: 'gp-acc-02',
        xPercent: 44,
        yPercent: 55,
        label: 'Matte Titanium Chrono ₹4,999'
      },
      {
        productId: 'gp-acc-01',
        xPercent: 72,
        yPercent: 32,
        label: 'Cognac Leather Tote ₹2,499'
      }
    ],
    commentsList: [
      {
        id: 'c-301',
        user: 'Devansh Roy',
        avatar: '/src/assets/images/footwear_chunky_sneakers_1793091785164.jpg',
        text: 'Is the watch water resistant? Love the gunmetal finish.',
        timestamp: '4h ago',
        likes: 15
      }
    ],
    videoVibeColor: '#4A4E53',
    categoryTag: 'TECH & ACC'
  },
  {
    id: 'short-4',
    thumbnailUrl: '/src/assets/images/short_beauty_skincare_1793094079976.jpg',
    creator: {
      id: 'creator-maya',
      name: 'Maya Glows',
      handle: '@mayaglows',
      avatar: '/src/assets/images/short_beauty_skincare_1793094079976.jpg',
      verified: true,
      followersCount: 560000,
      bio: 'Clean beauty, barrier repair & glass skin hacks 💧 Dermatologist approved.'
    },
    caption: 'My morning dewy glass skin secret 💧 Lumina Botanical Serum with plant hyaluronic acid & niacinamide! Zero stickiness, all glow. Tap "Shop Now" to claim 50% discount!',
    tags: ['#GlassSkin', '#DewyGlow', '#SkincareRoutine', '#HipiBeauty', '#CleanBeauty'],
    music: {
      title: 'Morning Dewdrops & Lofi',
      artist: 'Aura Soundscapes',
      genre: 'Ambient'
    },
    stats: {
      likes: 65800,
      comments: 412,
      shares: 8400,
      saves: 18900,
      views: 380000
    },
    isLiked: false,
    isSaved: true,
    isFollowing: false,
    taggedProductIds: ['gp-beauty-01'],
    hotspots: [
      {
        productId: 'gp-beauty-01',
        xPercent: 44,
        yPercent: 60,
        label: 'Lumina Dewy Serum ₹1,249'
      }
    ],
    commentsList: [
      {
        id: 'c-401',
        user: 'Kritika Sen',
        avatar: '/src/assets/images/women_collection_festive_fusion_1793091785102.jpg',
        text: 'Ordered this last week and my skin texture has smoothed out so much!',
        timestamp: '2h ago',
        likes: 54
      }
    ],
    videoVibeColor: '#DCAE60',
    categoryTag: 'BEAUTY'
  },
  {
    id: 'short-5',
    thumbnailUrl: '/src/assets/images/hero_gpark_summer_edit_1793091770554.jpg',
    creator: {
      id: 'creator-summerduo',
      name: 'Tara & Kabir',
      handle: '@summerduo',
      avatar: '/src/assets/images/men_collection_urban_jacket_1793091783710.jpg',
      verified: true,
      followersCount: 190000,
      bio: 'Travel, resort wear & couples capsule wardrobe aesthetic 🌴'
    },
    caption: 'Golden hour resort styling in South Goa ☀️ Pure French linen wrap dress paired with relaxed camp overshirt. Breathable luxe vacation essentials!',
    tags: ['#ResortWear', '#SummerEdit', '#GoaStyle', '#LinenDress', '#CouplesOOTD'],
    music: {
      title: 'Sunset Horizon Groove',
      artist: 'Tropical Waves',
      genre: 'Deep House'
    },
    stats: {
      likes: 28400,
      comments: 95,
      shares: 2400,
      saves: 6200,
      views: 140000
    },
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    taggedProductIds: ['gp-women-02', 'gp-men-01'],
    hotspots: [
      {
        productId: 'gp-women-02',
        xPercent: 45,
        yPercent: 52,
        label: 'French Linen Wrap Dress ₹2,299'
      },
      {
        productId: 'gp-men-01',
        xPercent: 72,
        yPercent: 48,
        label: 'Linen Overshirt ₹1,999'
      }
    ],
    commentsList: [
      {
        id: 'c-501',
        user: 'Radhika Nair',
        avatar: '/src/assets/images/short_beauty_skincare_1793094079976.jpg',
        text: 'The rust color on the wrap dress is gorgeous! Perfect for beach dinners.',
        timestamp: '6h ago',
        likes: 27
      }
    ],
    videoVibeColor: '#B2533E',
    categoryTag: 'RESORT'
  }
];

export const INITIAL_LIVESTREAMS: LiveStream[] = [
  {
    id: 'live-1',
    creator: {
      id: 'creator-ananya',
      name: 'Ananya Deshmukh',
      handle: '@ananya_glam',
      avatar: '/src/assets/images/women_collection_festive_fusion_1793091785102.jpg',
      followers: '890K'
    },
    title: 'Festive Flash Sale: Exclusive Raw Silk & Zari Looks Try-On!',
    thumbnail: '/src/assets/images/short_festive_fusion_1793094080182.jpg',
    liveViewers: 4820,
    pinnedProductId: 'gp-women-01',
    specialDealBadge: 'EXTRA ₹500 OFF LIVE ONLY',
    couponCode: 'HIPILIVE500',
    chatMessages: [
      { id: 'm1', user: 'Priya K.', avatar: '/src/assets/images/short_beauty_skincare_1793094079976.jpg', message: 'Omg the emerald color is stunning!' },
      { id: 'm2', user: 'Rhea S.', avatar: '/src/assets/images/short_streetwear_reel_1793094079389.jpg', message: 'Just grabbed size M with the live coupon!' },
      { id: 'm3', user: 'Shreya', avatar: '/src/assets/images/hero_gpark_summer_edit_1793091770554.jpg', message: 'Can you show the sleeve embroidery closeup please?', isSuperChat: true },
      { id: 'm4', user: 'Tanvi G.', avatar: '/src/assets/images/accessories_leather_tote_1793091786143.jpg', message: 'Super fast delivery in Mumbai last time! Love Hipi!' }
    ]
  },
  {
    id: 'live-2',
    creator: {
      id: 'creator-kabir',
      name: 'Kabir Verma',
      handle: '@kabir_styles',
      avatar: '/src/assets/images/men_collection_urban_jacket_1793091783710.jpg',
      followers: '420K'
    },
    title: 'Sneakerhead Drop & Linen Styling Masterclass',
    thumbnail: '/src/assets/images/short_streetwear_reel_1793094079389.jpg',
    liveViewers: 2940,
    pinnedProductId: 'gp-footwear-01',
    specialDealBadge: 'LIMITED DROP: 34 PAIRS LEFT',
    couponCode: 'SNEAKERDROP',
    chatMessages: [
      { id: 'm11', user: 'Aman P.', avatar: '/src/assets/images/short_luxury_watch_1793094080929.jpg', message: 'Are the chunky soles comfortable for walking?' },
      { id: 'm12', user: 'Karthik', avatar: '/src/assets/images/men_collection_urban_jacket_1793091783710.jpg', message: 'Yes bro, EVA cushioning is super soft!' }
    ]
  }
];
