import React, { useState, useEffect } from 'react';
import { LiveStream, Product } from '../types';
import { X, Heart, Send, Users, Sparkles, Zap, ShoppingBag, Radio } from 'lucide-react';

interface LiveCommerceRoomProps {
  isOpen: boolean;
  onClose: () => void;
  liveStream: LiveStream | null;
  allProducts: Product[];
  onInstantBuy: (product: Product, size: string, couponCode?: string) => void;
}

export const LiveCommerceRoom: React.FC<LiveCommerceRoomProps> = ({
  isOpen,
  onClose,
  liveStream,
  allProducts,
  onInstantBuy
}) => {
  const [messages, setMessages] = useState<LiveStream['chatMessages']>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [hearts, setHearts] = useState<{ id: number; left: number }[]>([]);
  const [viewers, setViewers] = useState(4820);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes flash sale

  useEffect(() => {
    if (liveStream) {
      setMessages(liveStream.chatMessages);
      setViewers(liveStream.liveViewers);
    }
  }, [liveStream]);

  // Viewers fluctuation & simulated chat incoming
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // random viewer jitter
      setViewers((prev) => prev + Math.floor(Math.random() * 7) - 3);

      // Countdown
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 480));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !liveStream) return null;

  const pinnedProduct = allProducts.find((p) => p.id === liveStream.pinnedProductId) || allProducts[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      user: 'You',
      avatar: '/src/assets/images/men_collection_urban_jacket_1793091783710.jpg',
      message: inputMessage.trim()
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  const handleSendHeart = () => {
    const newHeart = {
      id: Date.now(),
      left: Math.floor(Math.random() * 40) + 50
    };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1500);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      
      {/* Live Stream Stage Container */}
      <div className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl bg-neutral-950 overflow-hidden shadow-2xl flex flex-col justify-between border-0 sm:border border-neutral-800">
        
        {/* Stream Visual Background */}
        <div className="absolute inset-0">
          <img
            src={liveStream.thumbnail}
            alt={liveStream.title}
            className="w-full h-full object-cover filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />
        </div>

        {/* Floating Heart Reactions Animation */}
        {hearts.map((h) => (
          <div
            key={h.id}
            style={{ left: `${h.left}%` }}
            className="absolute bottom-24 pointer-events-none animate-in fade-in slide-in-from-bottom-20 duration-1000"
          >
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse drop-shadow-md" />
          </div>
        ))}

        {/* Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between p-4 text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={liveStream.creator.avatar}
              alt={liveStream.creator.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-rose-500"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold leading-tight truncate">
                  {liveStream.creator.name}
                </span>
                <span className="bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                  <Radio className="w-2.5 h-2.5" />
                  LIVE
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                <Users className="w-3 h-3 text-rose-400" />
                <span className="tabular-nums font-semibold">{viewers.toLocaleString('en-IN')} watching</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Interactive Area */}
        <div className="relative z-20 p-4 space-y-3">
          
          {/* Pinned Flash Sale Product Card */}
          {pinnedProduct && (
            <div className="bg-neutral-900/90 backdrop-blur-md rounded-2xl border border-rose-500/50 p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                  <img
                    src={pinnedProduct.image}
                    alt={pinnedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-rose-600 text-[8px] font-extrabold text-white px-1">
                    PINNED
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">
                      {liveStream.specialDealBadge}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold tabular-nums">
                      ⏳ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mt-0.5">
                    {pinnedProduct.name}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-extrabold text-white">
                      ₹{pinnedProduct.price}
                    </span>
                    <span className="text-[11px] text-neutral-400 line-through">
                      ₹{pinnedProduct.originalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onInstantBuy(pinnedProduct, pinnedProduct.sizes[0] || 'M', liveStream.couponCode);
                  onClose();
                }}
                className="py-2.5 px-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 shrink-0 transition-transform"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          )}

          {/* Live Chat Stream */}
          <div className="max-h-36 overflow-y-auto space-y-1.5 scrollbar-none pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-xs px-2.5 py-1 rounded-xl backdrop-blur-xs flex items-start gap-1.5 w-fit max-w-[90%] ${
                  m.isSuperChat
                    ? 'bg-amber-500/20 border border-amber-400/40 text-amber-200'
                    : 'bg-black/40 text-white/90'
                }`}
              >
                <span className="font-bold text-rose-300 shrink-0">
                  {m.user}:
                </span>
                <span className="break-words">{m.message}</span>
              </div>
            ))}
          </div>

          {/* Live Action Bar & Heart Reaction Button */}
          <div className="flex items-center gap-2 pt-1">
            <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-1.5">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Chat with host or ask questions..."
                className="flex-1 bg-black/50 border border-white/20 focus:border-rose-400 text-white text-xs px-3.5 py-2 rounded-full outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-500 disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Heart Reaction Trigger */}
            <button
              onClick={handleSendHeart}
              className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-125 text-white flex items-center justify-center shadow-lg transition-transform shrink-0"
            >
              <Heart className="w-5 h-5 fill-white" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
