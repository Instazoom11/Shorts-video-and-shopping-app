/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { VideoItem, Comment } from './types';
import { INITIAL_VIDEOS, INITIAL_COMMENTS } from './data/initialVideos';
import { VideoPlayer } from './components/VideoPlayer';
import { CommentDrawer } from './components/CommentDrawer';
import { ShareModal } from './components/ShareModal';
import { WatchPartyRoom } from './components/WatchPartyRoom';
import { CreatorStudio } from './components/CreatorStudio';
import { ExploreTab } from './components/ExploreTab';
import { ProfileTab } from './components/ProfileTab';
import { BottomNav } from './components/BottomNav';
import { HeaderNav } from './components/HeaderNav';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { CartToast } from './components/CartToast';

function TikPulseApp() {
  const { isCartOpen, closeCart, openCart, totalCount } = useCart();
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Nav states
  const [currentTab, setCurrentTab] = useState<'home' | 'discover' | 'party' | 'profile'>('home');
  const [feedType, setFeedType] = useState<'following' | 'foryou' | 'live'>('foryou');

  // Modals
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioInitialTemplate, setStudioInitialTemplate] = useState<string | undefined>(undefined);
  const [isWatchPartyOpen, setIsWatchPartyOpen] = useState(false);
  const [activeWatchRoomId, setActiveWatchRoomId] = useState<string>('fyp-live-party');

  // Touch & Scroll Handling
  const touchStartY = useRef<number>(0);
  const isNavigatingRef = useRef<boolean>(false);

  // Filtered videos based on Following vs For You
  const activeFeedVideos =
    feedType === 'following'
      ? videos.filter((v) => v.author.isFollowing || v.isUserCreated)
      : videos;

  // Fallback if following is empty
  const displayedVideos = activeFeedVideos.length > 0 ? activeFeedVideos : videos;
  const currentVideo = displayedVideos[activeVideoIndex] || displayedVideos[0];

  // Keyboard navigation (ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentTab !== 'home' || isStudioOpen || isCommentDrawerOpen || isShareModalOpen || isCartOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextVideo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoIndex, displayedVideos.length, currentTab, isStudioOpen, isCommentDrawerOpen, isShareModalOpen, isCartOpen]);

  const goToNextVideo = () => {
    if (activeVideoIndex < displayedVideos.length - 1) {
      setActiveVideoIndex((prev) => prev + 1);
    }
  };

  const goToPrevVideo = () => {
    if (activeVideoIndex > 0) {
      setActiveVideoIndex((prev) => prev - 1);
    }
  };

  // Wheel handling with cooldown
  const handleWheel = (e: React.WheelEvent) => {
    if (currentTab !== 'home' || isStudioOpen || isCommentDrawerOpen || isShareModalOpen || isCartOpen) return;
    if (isNavigatingRef.current) return;

    if (Math.abs(e.deltaY) > 35) {
      isNavigatingRef.current = true;
      if (e.deltaY > 0) {
        goToNextVideo();
      } else {
        goToPrevVideo();
      }
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 400);
    }
  };

  // Touch gestures for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (currentTab !== 'home' || isStudioOpen || isCommentDrawerOpen || isShareModalOpen || isCartOpen) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        goToNextVideo();
      } else {
        goToPrevVideo();
      }
    }
  };

  // Like video
  const handleToggleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.stats.isLiked;
          return {
            ...v,
            stats: {
              ...v.stats,
              isLiked,
              likes: isLiked ? v.stats.likes + 1 : v.stats.likes - 1,
            },
          };
        }
        return v;
      })
    );
  };

  // Bookmark video
  const handleToggleBookmark = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isBookmarked = !v.stats.isBookmarked;
          return {
            ...v,
            stats: {
              ...v.stats,
              isBookmarked,
              bookmarks: isBookmarked ? v.stats.bookmarks + 1 : v.stats.bookmarks - 1,
            },
          };
        }
        return v;
      })
    );
  };

  // Follow creator
  const handleToggleFollow = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isFollowing = !v.author.isFollowing;
          return {
            ...v,
            author: {
              ...v.author,
              isFollowing,
            },
          };
        }
        return v;
      })
    );
  };

  // Add Comment
  const handleAddComment = (text: string) => {
    if (!currentVideo) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      user: {
        name: 'You (Alex)',
        handle: 'alex_rivera.ai',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        verified: true,
      },
      text,
      timeAgo: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setCommentsMap((prev) => ({
      ...prev,
      [currentVideo.id]: [newComment, ...(prev[currentVideo.id] || [])],
    }));

    setVideos((prev) =>
      prev.map((v) =>
        v.id === currentVideo.id
          ? { ...v, stats: { ...v.stats, comments: v.stats.comments + 1 } }
          : v
      )
    );
  };

  // Like a specific comment
  const handleLikeComment = (commentId: string) => {
    if (!currentVideo) return;
    setCommentsMap((prev) => {
      const list = prev[currentVideo.id] || [];
      return {
        ...prev,
        [currentVideo.id]: list.map((c) =>
          c.id === commentId
            ? {
                ...c,
                isLiked: !c.isLiked,
                likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              }
            : c
        ),
      };
    });
  };

  // Handle publishing a new AI created video
  const handlePublishNewVideo = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
    setActiveVideoIndex(0);
    setCurrentTab('home');
  };

  // Handle start watch party
  const handleStartWatchParty = () => {
    setActiveWatchRoomId(`party-${currentVideo?.id || 'room'}`);
    setIsWatchPartyOpen(true);
  };

  return (
    <div className="relative w-full h-screen bg-neutral-950 flex justify-center items-center overflow-hidden font-sans select-none">
      {/* Desktop Centered Phone-like Wrapper (max-w-md on desktop, full-width on mobile) */}
      <div
        className="relative w-full h-full max-w-md bg-black shadow-2xl flex flex-col overflow-hidden"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Header Navigation (Only on Home Feed) */}
        {currentTab === 'home' && (
          <HeaderNav
            feedType={feedType}
            onChangeFeedType={(type) => {
              if (type === 'live') {
                handleStartWatchParty();
              } else {
                setFeedType(type);
                setActiveVideoIndex(0);
              }
            }}
            onOpenSearch={() => setCurrentTab('discover')}
            onOpenStudio={() => {
              setStudioInitialTemplate(undefined);
              setIsStudioOpen(true);
            }}
          />
        )}

        {/* Tab 1: Home Vertical Short Video Feed */}
        {currentTab === 'home' && currentVideo && (
          <div className="relative w-full h-full flex-1">
            <VideoPlayer
              key={currentVideo.id}
              video={currentVideo}
              isActive={true}
              onLike={() => handleToggleLike(currentVideo.id)}
              onComment={() => setIsCommentDrawerOpen(true)}
              onBookmark={() => handleToggleBookmark(currentVideo.id)}
              onShare={() => setIsShareModalOpen(true)}
              onOpenStudioWithRemix={() => {
                setStudioInitialTemplate(currentVideo.id);
                setIsStudioOpen(true);
              }}
              onToggleFollow={() => handleToggleFollow(currentVideo.id)}
            />

            {/* Desktop Navigation Floating Arrows */}
            <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-3 z-30 pointer-events-auto">
              <button
                onClick={goToPrevVideo}
                disabled={activeVideoIndex === 0}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white disabled:opacity-20 flex items-center justify-center shadow-lg transition active:scale-90"
                aria-label="Previous video"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <button
                onClick={goToNextVideo}
                disabled={activeVideoIndex >= displayedVideos.length - 1}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white disabled:opacity-20 flex items-center justify-center shadow-lg transition active:scale-90"
                aria-label="Next video"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Discover / Search & Trending */}
        {currentTab === 'discover' && (
          <ExploreTab
            videos={videos}
            onSelectVideo={(id) => {
              const idx = videos.findIndex((v) => v.id === id);
              if (idx !== -1) {
                setActiveVideoIndex(idx);
                setCurrentTab('home');
              }
            }}
            onOpenStudio={() => {
              setStudioInitialTemplate(undefined);
              setIsStudioOpen(true);
            }}
          />
        )}

        {/* Tab 3: Profile */}
        {currentTab === 'profile' && (
          <ProfileTab
            videos={videos}
            onSelectVideo={(id) => {
              const idx = videos.findIndex((v) => v.id === id);
              if (idx !== -1) {
                setActiveVideoIndex(idx);
                setCurrentTab('home');
              }
            }}
            onOpenStudio={() => {
              setStudioInitialTemplate(undefined);
              setIsStudioOpen(true);
            }}
          />
        )}

        {/* Bottom Persistent Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={(tab) => {
            if (tab === 'party') {
              handleStartWatchParty();
            } else {
              setCurrentTab(tab);
            }
          }}
          onOpenStudio={() => {
            setStudioInitialTemplate(undefined);
            setIsStudioOpen(true);
          }}
        />

        {/* Real-time Comments Drawer */}
        <CommentDrawer
          isOpen={isCommentDrawerOpen}
          onClose={() => setIsCommentDrawerOpen(false)}
          video={currentVideo}
          comments={commentsMap[currentVideo?.id] || []}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />

        {/* Real-Time Social Share Modal */}
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          video={currentVideo}
          onStartWatchParty={handleStartWatchParty}
        />

        {/* Fullscreen Live Watch Party Room */}
        {isWatchPartyOpen && currentVideo && (
          <WatchPartyRoom
            roomId={activeWatchRoomId}
            video={currentVideo}
            onClose={() => setIsWatchPartyOpen(false)}
          />
        )}

        {/* AI-Powered Creator Studio Modal */}
        <CreatorStudio
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          onPublish={handlePublishNewVideo}
          initialTemplate={studioInitialTemplate}
        />

        {/* Persistent Shopping Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={closeCart}
          onJumpToVideo={(videoId) => {
            const idx = videos.findIndex((v) => v.id === videoId);
            if (idx !== -1) {
              setActiveVideoIndex(idx);
              setCurrentTab('home');
            }
          }}
        />

        {/* Floating Cart Button for Non-Home tabs or fast access */}
        {currentTab !== 'home' && totalCount > 0 && (
          <button
            onClick={openCart}
            className="fixed bottom-18 right-4 z-40 px-3.5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold text-xs shadow-2xl shadow-pink-500/40 flex items-center gap-2 border border-white/20 animate-in zoom-in active:scale-95 transition"
            aria-label="Open persistent shopping bag"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Bag ({totalCount})</span>
          </button>
        )}

        {/* Non-intrusive Cart Toast Notification */}
        <CartToast />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <TikPulseApp />
    </CartProvider>
  );
}
