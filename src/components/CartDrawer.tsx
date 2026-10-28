import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Play,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToVideo?: (videoId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onJumpToVideo,
}) => {
  const {
    items,
    totalCount,
    subtotal,
    discountPercent,
    discountAmount,
    shippingFee,
    freeShippingThreshold,
    freeShippingProgress,
    isFreeShipping,
    tax,
    grandTotal,
    appliedPromoCode,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
    checkoutSuccess,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  // Checkout states inside the drawer
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'google_pay'>('apple_pay');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    total: number;
    itemCount: number;
    items: CartItem[];
  } | null>(null);

  // Address form fields
  const [address, setAddress] = useState({
    name: 'Alex Rivera',
    street: '742 Market Street, Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = (codeToApply?: string) => {
    const code = codeToApply || promoInput;
    if (!code.trim()) return;
    const res = applyPromoCode(code);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError(null);
      setPromoInput('');
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessingOrder(true);

    setTimeout(() => {
      const orderId = `TP-${Math.floor(100000 + Math.random() * 900000)}`;
      const savedItems = [...items];
      const savedTotal = grandTotal;
      const savedCount = totalCount;

      setIsProcessingOrder(false);
      setCompletedOrder({
        id: orderId,
        total: savedTotal,
        itemCount: savedCount,
        items: savedItems,
      });

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#06b6d4', '#eab308', '#a855f7'],
        });
      } catch (e) {
        console.warn('Confetti trigger skipped', e);
      }

      checkoutSuccess(orderId);
    }, 1200);
  };

  const handleDoneWatching = () => {
    setCompletedOrder(null);
    setIsCheckingOut(false);
    onClose();
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md h-full bg-neutral-950 border-l border-neutral-800/80 shadow-2xl flex flex-col text-white animate-in slide-in-from-right duration-300 select-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/80 bg-neutral-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                Shopping Bag
                <span className="text-[11px] font-bold bg-neutral-800 text-pink-400 px-2 py-0.5 rounded-full border border-neutral-700">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Tracked from in-video creator tags
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && !isCheckingOut && !completedOrder && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-neutral-400 hover:text-rose-400 transition px-2 py-1"
                title="Clear Bag"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition"
              aria-label="Close Shopping Bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Meter (Visible when cart has items and not completed) */}
        {items.length > 0 && !completedOrder && (
          <div className="px-5 py-2.5 bg-neutral-900/90 border-b border-neutral-800/60">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                {isFreeShipping ? (
                  <span className="font-bold text-emerald-400">
                    🎉 You unlocked FREE Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-white">${amountNeededForFreeShipping.toFixed(2)}</strong> more for <strong className="text-cyan-400">FREE Express Delivery</strong>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-400 font-bold">
                ${freeShippingThreshold} threshold
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isFreeShipping
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                    : 'bg-gradient-to-r from-rose-500 to-purple-500'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ORDER COMPLETED VIEW */}
        {completedOrder ? (
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/20 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Order Confirmed #{completedOrder.id}
            </span>

            <h3 className="text-xl font-black text-white">Thank You, Alex!</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
              Your order has been placed seamlessly without leaving the video stream. Tracking details sent to instazoom11@gmail.com.
            </p>

            {/* Order Card Receipt */}
            <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 mt-6 text-left space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Total Charged</span>
                <span className="font-extrabold text-white text-sm">
                  ${completedOrder.total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Delivery To</span>
                <span className="font-medium text-white truncate max-w-[200px]">
                  {address.street}, {address.city}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Estimated Arrival</span>
                <span className="font-semibold text-cyan-400">In 2 business days</span>
              </div>

              <div className="border-t border-neutral-800 pt-2">
                <p className="text-[11px] text-neutral-500 font-medium mb-1.5">
                  Items from videos ({completedOrder.itemCount})
                </p>
                <div className="flex -space-x-2 overflow-hidden">
                  {completedOrder.items.slice(0, 4).map((it) => (
                    <img
                      key={it.id}
                      src={it.image}
                      alt={it.title}
                      className="inline-block h-8 w-8 rounded-lg ring-2 ring-neutral-900 object-cover"
                    />
                  ))}
                  {completedOrder.items.length > 4 && (
                    <div className="h-8 w-8 rounded-lg ring-2 ring-neutral-900 bg-neutral-800 text-[10px] font-bold text-white flex items-center justify-center">
                      +{completedOrder.items.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleDoneWatching}
              className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Continue Watching Videos
            </button>
          </div>
        ) : isCheckingOut ? (
          /* CHECKOUT VIEW (IN-APP SEAMLESS REVIEW) */
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
            {/* Back button to Cart */}
            <button
              onClick={() => setIsCheckingOut(false)}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition font-semibold"
            >
              ← Back to Bag
            </button>

            {/* Shipping Address Review */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Shipping Address
                </span>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs font-semibold text-pink-400 hover:text-pink-300"
                >
                  {isEditingAddress ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingAddress ? (
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Street Address"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                      className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="State"
                      className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      placeholder="ZIP"
                      className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-neutral-300 space-y-0.5">
                  <p className="font-bold text-white">{address.name}</p>
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Payment Method
              </span>

              <div className="space-y-2">
                {/* Apple Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                    paymentMethod === 'apple_pay'
                      ? 'border-white bg-neutral-800 text-white shadow'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-white text-black font-black flex items-center justify-center text-[10px]">
                      
                    </div>
                    <span>Apple Pay</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">Instant 1-Click</span>
                </button>

                {/* Google Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                    paymentMethod === 'google_pay'
                      ? 'border-white bg-neutral-800 text-white shadow'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-cyan-400">G Pay</span>
                    <span>Google Pay</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">alex@rivera.ai</span>
                </button>

                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                    paymentMethod === 'card'
                      ? 'border-white bg-neutral-800 text-white shadow'
                      : 'border-neutral-800 bg-neutral-950/60 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-pink-400" />
                    <span>Card ending in •••• 4242</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">Exp 12/28</span>
                </button>
              </div>
            </div>

            {/* Quick Line Items Review */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                Review Items ({totalCount})
              </span>
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <img
                      src={it.image}
                      alt={it.title}
                      className="w-9 h-9 rounded-lg object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="min-w-0 truncate">
                      <p className="font-bold text-white truncate">{it.title}</p>
                      <p className="text-[10px] text-neutral-400">
                        Qty: {it.quantity} {it.selectedSize ? `• ${it.selectedSize}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-white shrink-0">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 justify-center py-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted Instant In-App Checkout</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4 shadow-xl">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-extrabold text-white">Your bag is empty</h3>
            <p className="text-xs text-neutral-400 max-w-xs mt-1.5 leading-relaxed">
              Explore short videos and tap in-video product tags to shop clothing, gadgets, and creator favorites directly without leaving the app!
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 hover:opacity-95 transition active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Shop In Videos Now
            </button>
          </div>
        ) : (
          /* CART ITEMS ACTIVE LIST VIEW */
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 no-scrollbar">
            {/* Items list */}
            {items.map((item) => {
              const itemTotal = (item.price * item.quantity).toFixed(2);

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 shadow-md flex flex-col gap-3 group hover:border-neutral-700/80 transition"
                >
                  {/* Creator / In-Video Origin Attribution Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800/60 text-[10px]">
                    <div className="flex items-center gap-1.5 text-neutral-400 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      <span>Tagged in</span>
                      <strong className="text-white font-semibold">
                        @{item.addedFromCreatorHandle}
                      </strong>
                      <span className="text-neutral-500 hidden sm:inline">•</span>
                      <span className="truncate max-w-[140px] text-neutral-400 hidden sm:inline">
                        {item.addedFromVideoTitle}
                      </span>
                    </div>

                    {onJumpToVideo && (
                      <button
                        onClick={() => {
                          onJumpToVideo(item.addedFromVideoId);
                          onClose();
                        }}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
                        title="Jump back to source video"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        View Video
                      </button>
                    )}
                  </div>

                  {/* Main Product Line Details */}
                  <div className="flex gap-3 items-start">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                            {item.brand}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate leading-tight">
                            {item.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-500 hover:text-rose-400 transition p-1"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Variants Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.selectedColor && (
                          <span className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-300 text-[10px] font-medium border border-neutral-800">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-300 text-[10px] font-medium border border-neutral-800">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>

                      {/* Price & Stepper controls */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-black text-white">
                            ${itemTotal}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-neutral-500">
                              (${item.price.toFixed(2)} ea)
                            </span>
                          )}
                          {item.originalPrice && (
                            <span className="text-[10px] text-neutral-500 line-through">
                              ${(item.originalPrice * item.quantity).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-xl bg-neutral-950 border border-neutral-800 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center transition active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center transition active:scale-90"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Promo Code Input & Popular suggestions */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-pink-400" />
                  Promo Code / Discount
                </span>
                {appliedPromoCode && (
                  <button
                    onClick={removePromoCode}
                    className="text-[11px] text-rose-400 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedPromoCode ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span>Code "{appliedPromoCode}" Applied</span>
                  <span>-{discountPercent}% OFF (${discountAmount.toFixed(2)})</span>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError(null);
                      }}
                      placeholder="e.g. TIKPULSE20"
                      className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-pink-500 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder:normal-case placeholder-neutral-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleApplyPromo()}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-400 mt-1 font-medium">{promoError}</p>
                  )}

                  {/* Quick-apply suggested tags */}
                  <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] text-neutral-400 shrink-0">Try:</span>
                    <button
                      onClick={() => handleApplyPromo('TIKPULSE20')}
                      className="px-2 py-0.5 rounded-md bg-neutral-950 text-pink-300 text-[10px] font-bold border border-pink-500/30 hover:bg-pink-500/10 shrink-0"
                    >
                      TIKPULSE20 (20% off)
                    </button>
                    <button
                      onClick={() => handleApplyPromo('CREATOR10')}
                      className="px-2 py-0.5 rounded-md bg-neutral-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 hover:bg-cyan-500/10 shrink-0"
                    >
                      CREATOR10 (10% off)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM ORDER SUMMARY & CHECKOUT TRIGGER (Only when items exist and not order-completed) */}
        {items.length > 0 && !completedOrder && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950/95 space-y-3">
            {/* Financial breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-400">
                <span>Estimated Shipping</span>
                <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>Estimated Tax (8.25%)</span>
                <span className="text-white font-medium">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-black pt-2 border-t border-neutral-800 text-white">
                <span>Grand Total</span>
                <span className="text-base text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Button: Checkout or Place Order */}
            {isCheckingOut ? (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessingOrder}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingOrder ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Securing Order...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Pay ${grandTotal.toFixed(2)} & Complete Order
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Proceed to Instant Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
