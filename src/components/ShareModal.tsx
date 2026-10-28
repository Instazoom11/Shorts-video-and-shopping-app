import React, { useState } from 'react';
import { ShortVideo } from '../types';
import { X, Copy, Check, Share2, MessageCircle, Send, QrCode } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  short: ShortVideo | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, short }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !short) return null;

  const shareUrl = window.location.href.split('#')[0] + `?short=${short.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Check out this shoppable look by ${short.creator.name} on Hipi! ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl z-10 overflow-hidden p-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-neutral-900">Share Short</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Short Preview Card */}
        <div className="flex items-center gap-3 my-4 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
          <img
            src={short.thumbnailUrl}
            alt={short.creator.name}
            className="w-12 h-16 object-cover rounded-lg shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-neutral-900 truncate">
              {short.creator.name} ({short.creator.handle})
            </p>
            <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
              {short.caption}
            </p>
          </div>
        </div>

        {/* Share Destination Buttons */}
        <div className="grid grid-cols-3 gap-3 my-4 text-center">
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
          >
            <MessageCircle className="w-6 h-6 mb-1 text-emerald-600" />
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
          >
            {copied ? <Check className="w-6 h-6 mb-1 text-emerald-600" /> : <Copy className="w-6 h-6 mb-1 text-rose-600" />}
            <span className="text-[11px] font-semibold">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={() => alert(`QR Code for short: ${short.id} generated for mobile scan.`)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
          >
            <QrCode className="w-6 h-6 mb-1 text-purple-600" />
            <span className="text-[11px] font-semibold">QR Code</span>
          </button>
        </div>

        {/* Copy Link Input Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100 rounded-xl border border-neutral-200">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-[11px] text-neutral-600 px-2 truncate outline-hidden"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
