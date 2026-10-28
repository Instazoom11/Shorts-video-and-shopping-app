import { Product, LookbookLook } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'gp-men-01',
    name: 'Minimalist Utility Linen Overshirt',
    brand: 'Gpark Atelier',
    category: 'MEN',
    subcategory: 'Shirts & Jackets',
    price: 1999,
    originalPrice: 3999,
    discountPercent: 50,
    rating: 4.6,
    reviewCount: 842,
    image: '/src/assets/images/men_collection_urban_jacket_1793091783710.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    tag: 'Trending',
    description: 'Crafted from a breathable organic linen-cotton blend. Designed with a clean camp collar, dual chest patch pockets, and reinforced horn buttons for effortless layering.',
    details: {
      fabric: '70% Linen, 30% Long-Staple Cotton',
      fit: 'Relaxed Tailored Fit',
      careInstructions: 'Machine wash cold with like colors, line dry in shade',
      origin: 'Made in India'
    },
    colorName: 'Olive Drab',
    colorHex: '#4A5340'
  },
  {
    id: 'gp-women-01',
    name: 'Heritage Emerald Embroidered Fusion Co-Ord',
    brand: 'Gpark Festive',
    category: 'WOMEN',
    subcategory: 'Ethnic & Fusion',
    price: 3499,
    originalPrice: 6999,
    discountPercent: 50,
    rating: 4.8,
    reviewCount: 1290,
    image: '/src/assets/images/women_collection_festive_fusion_1793091785102.jpg',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    tag: 'Festive Bestseller',
    description: 'A striking festive fusion ensemble featuring an intricate gold zari embroidered bandhgala jacket paired with wide-leg tailored trousers in rich emerald green raw silk texture.',
    details: {
      fabric: 'Fine Raw Silk Blend with Zari Detailing',
      fit: 'Contemporary Straight Fit',
      careInstructions: 'Dry clean only',
      origin: 'Jaipur Atelier, India'
    },
    colorName: 'Emerald Green',
    colorHex: '#084C38'
  },
  {
    id: 'gp-footwear-01',
    name: 'Apex Chunky Architectural Sneakers',
    brand: 'Gpark Street',
    category: 'FOOTWEAR',
    subcategory: 'Sneakers',
    price: 2799,
    originalPrice: 5499,
    discountPercent: 49,
    rating: 4.7,
    reviewCount: 654,
    image: '/src/assets/images/footwear_chunky_sneakers_1793091785164.jpg',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    inStock: true,
    tag: 'Drop of the Week',
    description: 'Architectural retro-futuristic silhouette with dual-density EVA cushioning, premium cream calfskin overlays, and high-traction carved rubber outsole.',
    details: {
      fabric: 'Full-Grain Leather, Suede & Breathable Mesh',
      fit: 'True to size with ergonomic arch support',
      careInstructions: 'Wipe clean with a damp cloth, use suede brush for panels',
      origin: 'Imported Craftsmanship'
    },
    colorName: 'Chalk & Taupe',
    colorHex: '#E6E1D8'
  },
  {
    id: 'gp-acc-01',
    name: 'Cognac Full-Grain Structured Work Tote',
    brand: 'Gpark Atelier',
    category: 'ACCESSORIES',
    subcategory: 'Bags & Wallets',
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 420,
    image: '/src/assets/images/accessories_leather_tote_1793091786143.jpg',
    sizes: ['One Size (15L)'],
    inStock: true,
    tag: 'Staff Pick',
    description: 'Meticulously crafted from vegetable-tanned full grain leather. Features a dedicated 14-inch padded laptop compartment, internal slip organizers, and brass hardware.',
    details: {
      fabric: '100% Vegetable-Tanned Genuine Leather',
      fit: 'Dimensions: 38cm x 30cm x 12cm',
      careInstructions: 'Apply natural leather balm every 6 months',
      origin: 'Handmade in India'
    },
    colorName: 'Cognac Amber',
    colorHex: '#9E5B32'
  },
  {
    id: 'gp-men-02',
    name: 'Heavyweight Supima Cotton Boxy Tee',
    brand: 'Gpark Basics',
    category: 'MEN',
    subcategory: 'T-Shirts',
    price: 899,
    originalPrice: 1799,
    discountPercent: 50,
    rating: 4.5,
    reviewCount: 2180,
    image: '/src/assets/images/men_collection_urban_jacket_1793091783710.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    tag: 'Everyday Essential',
    description: '240 GSM dense knit Supima cotton with a drop-shoulder cut, reinforced ribbed crew collar, and pre-shrunk finish for lifetime shape retention.',
    details: {
      fabric: '100% Combed Supima Cotton (240 GSM)',
      fit: 'Relaxed Boxy Fit',
      careInstructions: 'Gentle cycle machine wash',
      origin: 'Tirupur, India'
    },
    colorName: 'Oatmeal Heather',
    colorHex: '#D8D4CC'
  },
  {
    id: 'gp-women-02',
    name: 'French Linen Wrap Midi Dress',
    brand: 'Gpark Studio',
    category: 'WOMEN',
    subcategory: 'Dresses',
    price: 2299,
    originalPrice: 4599,
    discountPercent: 50,
    rating: 4.6,
    reviewCount: 912,
    image: '/src/assets/images/hero_gpark_summer_edit_1793091770554.jpg',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    tag: 'Trending',
    description: 'Effortless summer silhouette with flattering side-tie wrap closure, puff sleeves with elastic cuffs, and functional side seam pockets.',
    details: {
      fabric: '100% Pure Normandy Flax Linen',
      fit: 'A-Line Wrap Fit',
      careInstructions: 'Cold hand wash or dry clean',
      origin: 'Made in India'
    },
    colorName: 'Terracotta Rust',
    colorHex: '#B2533E'
  },
  {
    id: 'gp-men-03',
    name: 'Selvedge Raw Indigo Relaxed Denim',
    brand: 'Gpark Denim Co.',
    category: 'MEN',
    subcategory: 'Jeans & Trousers',
    price: 2899,
    originalPrice: 5999,
    discountPercent: 52,
    rating: 4.7,
    reviewCount: 740,
    image: '/src/assets/images/short_streetwear_reel_1793094079389.jpg',
    sizes: ['30', '32', '34', '36', '38'],
    inStock: true,
    tag: 'Bestseller',
    description: '13.5oz shuttle-loom selvedge denim woven with authentic red-line ticker. Develops unique personalized fades over time with continuous wear.',
    details: {
      fabric: '100% Ring-Spun Cotton Raw Selvedge',
      fit: 'Relaxed Tapered Leg',
      careInstructions: 'Soak inside out in cold water after 6 months of wear',
      origin: 'Kuroki Mill Craft'
    },
    colorName: 'Deep Raw Indigo',
    colorHex: '#1B2A4A'
  },
  {
    id: 'gp-women-03',
    name: 'Pleated Chiffon Floral Tiered Skirt',
    brand: 'Gpark Atelier',
    category: 'WOMEN',
    subcategory: 'Skirts',
    price: 1599,
    originalPrice: 3199,
    discountPercent: 50,
    rating: 4.4,
    reviewCount: 480,
    image: '/src/assets/images/women_collection_festive_fusion_1793091785102.jpg',
    sizes: ['S', 'M', 'L'],
    inStock: true,
    tag: 'New Season',
    description: 'Flowing tiered construction with accordion pleating, gentle smocked waistband, and soft tonal viscose lining for effortless sway.',
    details: {
      fabric: 'Georgette Chiffon with Viscose Lining',
      fit: 'Flared Midi Length',
      careInstructions: 'Hand wash with mild detergent',
      origin: 'Made in India'
    },
    colorName: 'Dusty Rose Blossom',
    colorHex: '#D4A5A5'
  },
  {
    id: 'gp-beauty-01',
    name: 'Lumina Dewy Radiance Botanical Serum',
    brand: 'Hipi Beauty',
    category: 'ACCESSORIES',
    subcategory: 'Skincare & Glow',
    price: 1249,
    originalPrice: 2499,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 1640,
    image: '/src/assets/images/short_beauty_skincare_1793094079976.jpg',
    sizes: ['30ml Bottle', '50ml Jumbo'],
    inStock: true,
    tag: 'Viral on Shorts',
    description: 'Infused with cold-pressed rosehip seed oil, plant hyaluronic acid, and niacinamide for an instant glass-skin luminous finish.',
    details: {
      fabric: 'Clean Vegan Ingredients & Cruelty-Free',
      fit: 'Fast Absorbing Non-Greasy Elixir',
      careInstructions: 'Store in cool dry place away from sunlight',
      origin: 'Formulated in Korea'
    },
    colorName: 'Golden Amber Glow',
    colorHex: '#DCAE60'
  },
  {
    id: 'gp-footwear-02',
    name: 'Handcrafted Chelsea Suede Ankle Boots',
    brand: 'Gpark Heritage',
    category: 'FOOTWEAR',
    subcategory: 'Boots',
    price: 3299,
    originalPrice: 6599,
    discountPercent: 50,
    rating: 4.9,
    reviewCount: 388,
    image: '/src/assets/images/footwear_chunky_sneakers_1793091785164.jpg',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    inStock: true,
    tag: 'Artisan Crafted',
    description: 'Italian split calf suede with Goodyear-welted construction, elasticated side gussets, and storm-welt crepe outsole for all-day comfort.',
    details: {
      fabric: 'Split Calf Suede with Full Leather Lining',
      fit: 'Standard D Width',
      careInstructions: 'Waterproof spray protection recommended',
      origin: 'Agra Craft Guild'
    },
    colorName: 'Tobacco Brown',
    colorHex: '#654321'
  },
  {
    id: 'gp-acc-02',
    name: 'Matte Titanium Minimalist Chronograph',
    brand: 'Gpark Timepieces',
    category: 'ACCESSORIES',
    subcategory: 'Watches',
    price: 4999,
    originalPrice: 9999,
    discountPercent: 50,
    rating: 4.8,
    reviewCount: 275,
    image: '/src/assets/images/short_luxury_watch_1793094080929.jpg',
    sizes: ['40mm Dial'],
    inStock: true,
    tag: 'Luxury',
    description: 'Aerospace-grade matte titanium case paired with sapphire crystal glass, Japanese quartz movement, and quick-release Milanese mesh strap.',
    details: {
      fabric: 'Grade 2 Titanium & Sapphire Crystal',
      fit: '40mm diameter, 8.2mm slim profile',
      careInstructions: '5 ATM water resistant (50 meters)',
      origin: 'Precision Movement'
    },
    colorName: 'Gunmetal Silver',
    colorHex: '#4A4E53'
  }
];

export const LOOKBOOK_LOOKS: LookbookLook[] = [
  {
    id: 'look-1',
    title: 'The Contemporary Urban Minimalist',
    stylist: 'Priya Sengupta · Gpark Lead Stylist',
    tagline: 'Effortless earth tones tailored for weekday commutes and weekend cafe crawls.',
    image: '/src/assets/images/hero_gpark_summer_edit_1793091770554.jpg',
    taggedProductIds: ['gp-men-01', 'gp-acc-01', 'gp-footwear-01'],
    likes: 1420
  },
  {
    id: 'look-2',
    title: 'Festive Splendor & Modern Silhouette',
    stylist: 'Aarav Mehta · Senior Wardrobe Director',
    tagline: 'Opulent jewel tones reimagined with sharp contemporary lines and heritage zari craft.',
    image: '/src/assets/images/women_collection_festive_fusion_1793091785102.jpg',
    taggedProductIds: ['gp-women-01', 'gp-acc-01'],
    likes: 1980
  }
];

export const AVAILABLE_COUPONS = [
  {
    code: 'GPARK300',
    description: 'Flat ₹300 OFF on orders above ₹1,999',
    discountAmount: 300,
    minOrder: 1999
  },
  {
    code: 'FASHION15',
    description: 'Extra 15% OFF (up to ₹500) on your order',
    percentage: 15,
    maxDiscount: 500,
    minOrder: 1499
  },
  {
    code: 'FIRSTBUY',
    description: 'Welcome gift: Flat ₹200 OFF on your first purchase',
    discountAmount: 200,
    minOrder: 999
  }
];
