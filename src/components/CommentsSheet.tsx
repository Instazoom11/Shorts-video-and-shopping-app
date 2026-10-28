import React, { useState } from 'react';
import { ShortComment } from '../types';
import { X, Heart, Send } from 'lucide-react';

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  comments: ShortComment[];
  onAddComment: (text: string) => void;
  onToggleCommentLike: (commentId: string) => void;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onToggleCommentLike
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(inputText.trim());
    setInputText('');
  };

  const quickEmojis = ['🔥', '😍', '✨', '🛍️', '💯', '👏'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl h-[70vh] flex flex-col z-10 overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto my-3" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-neutral-900">Comments</h3>
            <span className="text-xs text-neutral-500 font-semibold bg-neutral-100 px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 items-start">
                <img
                  src={comment.avatar}
                  alt={comment.user}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-neutral-900">
                      {comment.user}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 mt-0.5 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
                <button
                  onClick={() => onToggleCommentLike(comment.id)}
                  className="flex flex-col items-center gap-0.5 pt-1 text-neutral-400 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      comment.isLiked
                        ? 'fill-rose-500 stroke-rose-500 text-rose-500'
                        : ''
                    }`}
                  />
                  <span className="text-[10px] font-semibold tabular-nums">
                    {comment.likes}
                  </span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Emoji Quick Row */}
        <div className="px-4 py-1.5 bg-neutral-50 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setInputText((prev) => prev + emoji)}
              className="text-base p-1 hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Comment Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a comment... (ask about fabric, fit, coupons)"
            className="flex-1 bg-neutral-100 border border-transparent focus:border-rose-400 focus:bg-white text-xs px-3.5 py-2.5 rounded-full outline-hidden transition-all text-neutral-900 placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-rose-600 disabled:bg-neutral-200 text-white flex items-center justify-center shrink-0 transition-all hover:bg-rose-700 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
