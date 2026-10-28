import React, { useState } from 'react';
import { X, MapPin, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DeliveryAddress, CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCouponCode?: string;
  couponDiscount?: number;
  onConfirmOrder: (address: DeliveryAddress, paymentMethod: 'UPI' | 'Card' | 'COD' | 'NetBanking') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCouponCode,
  couponDiscount = 0,
  onConfirmOrder
}) => {
  if (!isOpen) return null;

  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: 'Rahul Sharma',
    mobile: '9876543210',
    pincode: '560001',
    addressLine: 'Flat 402, Prestige Park Heights, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    addressType: 'Home'
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 1499 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmOrder(address, paymentMethod);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              CHECKOUT & DELIVERY
            </h2>
            <p className="text-xs text-neutral-500">
              Gpark Express Fulfillment · 100% Secure Transaction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>1. Shipping Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  10-Digit Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={address.mobile}
                  onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Street Address & Flat / House No.
                </label>
                <input
                  type="text"
                  required
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Options */}
          <div className="space-y-3 border-t border-neutral-200 pt-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span>2. Select Payment Method</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'UPI', label: 'UPI / QR', sub: 'Instant' },
                { id: 'Card', label: 'Debit / Card', sub: 'Visa, RuPay' },
                { id: 'NetBanking', label: 'Net Banking', sub: 'All Banks' },
                { id: 'COD', label: 'Cash on Delivery', sub: 'Pay on arrival' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === opt.id
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{opt.label}</span>
                    {paymentMethod === opt.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] block ${
                      paymentMethod === opt.id ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>

            {paymentMethod === 'UPI' && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                <label className="text-[11px] font-semibold text-neutral-700 block">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@oksbi"
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                />
                <p className="text-[10px] text-neutral-500">
                  A payment request prompt will be dispatched to your UPI app.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Final Breakdown */}
          <div className="border-t border-neutral-200 pt-4 p-4 bg-neutral-50 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Items Total ({cartItems.length} items)</span>
              <span className="tabular-nums font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Discount ({appliedCouponCode})</span>
                <span className="tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Charges</span>
              <span className="text-emerald-700 font-bold">
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between font-extrabold text-sm text-neutral-900">
              <span>Amount Payable</span>
              <span className="text-base text-rose-600 tabular-nums">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted · 100% Purchase Protection</span>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 px-6 rounded-xl text-sm tracking-wide transition-all shadow-lg hover:shadow-rose-600/30 disabled:opacity-50"
          >
            {isSubmitting ? 'PROCESSING SECURE ORDER...' : `PAY & PLACE ORDER · ₹${finalTotal.toLocaleString('en-IN')}`}
          </button>
        </form>
      </div>
    </div>
  );
};
