export interface CaptionSegment {
  start: number;
  end: number;
  text: string;
  highlight?: string;
  emoji?: string;
}

export interface Comment {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  text: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
}

export type VideoFilter = 'none' | 'cyberpunk' | 'vhs' | 'sunset' | 'noir' | 'vivid' | 'glitch';

export interface ProductTagVariant {
  sizes?: string[];
  colors?: { name: string; hex: string }[];
}

export interface ProductTag {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  badge?: string; // e.g. 'Viral Hit', 'Creator Pick', 'Limited Drop', 'Hot Deal'
  hotspot: { x: number; y: number }; // Percentage (0-100) on the video screen
  timestamp?: { start: number; end: number }; // Specific video seconds when highlighted
  variants?: ProductTagVariant;
  inStock: boolean;
  soldCount?: string;
  category?: string;
}

export interface CartItem {
  id: string; // Unique key e.g. prodId-size-color
  productId: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  addedFromVideoId: string;
  addedFromVideoTitle: string;
  addedFromCreatorHandle: string;
  addedFromCreatorName: string;
  addedFromVideoThumbnail?: string;
  addedAt: number;
}

export interface VideoItem {
  id: string;
  url: string;
  thumbnail?: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
    followers: string;
    isFollowing?: boolean;
  };
  description: string;
  hashtags: string[];
  music: {
    name: string;
    author: string;
    coverUrl?: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
  captions?: CaptionSegment[];
  filter?: VideoFilter;
  voiceoverUrl?: string;
  speed?: number;
  stickers?: { id: string; text: string; x: number; y: number }[];
  products?: ProductTag[];
  isUserCreated?: boolean;
  createdAt: number;
}

export interface WatchPartyViewer {
  id: string;
  name: string;
  avatar: string;
}

export interface WatchPartyMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export interface WatchPartyReaction {
  id: string;
  emoji: string;
  sender: string;
  timestamp: number;
}
