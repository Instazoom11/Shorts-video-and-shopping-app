import React, { useState } from 'react';
import { UserCoinWallet } from '../types';
import { X, Sparkles, Gift, Check, ArrowRight, Zap, Trophy, Coins } from 'lucide-react';

interface HipiRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserCoinWallet;
  onClaimDaily: () => void;
  onRedeemCoupon: (code: string, discount: number, coinCost: number) => void;
}

export const HipiRewardsModal: React.FC<HipiRewardsModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onClaimDaily,
  onRedeemCoupon
}) => {
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaim = () => {
    onClaimDaily();
    setDailyClaimed(true);
  };

  const handleScratch = () => {
    if (scratchRevealed) return;
    setScratchRevealed(true);
    onClaimDaily();
  };

  const coupons = [
    { code: 'GEMS100', discount: 100, cost: 40, desc: '₹100 Instant Discount on ₹999+' },
    { code: 'GEMS250', discount: 250, cost: 80, desc: '₹250 Instant Discount on ₹1,999+' },
    { code: 'GEMS500', discount: 500, cost: 150, desc: '₹500 VIP Mega Discount on ₹2,999+' }
  ];

  const handleRedeem = (code: string, discount: number, cost: number) => {
    if (wallet.gems < cost) {
      alert(`You need ${cost} Hipi Gems to redeem this coupon! Watch more shorts to earn gems.`);
      return;
    }
    onRedeemCoupon(code, discount, cost);
    setRedeemedCode(code);
    setTimeout(() => setRedeemedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl z-10 max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Banner with Total Coins */}
        <div className="bg-gradient-to-br from-amber-500 via-rose-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-200">
              Hipi SuperCoins Wallet
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black tabular-nums tracking-tight">
              {wallet.gems}
            </span>
            <span className="text-base font-bold text-amber-200">Gems</span>
          </div>

          <p className="text-xs text-white/80 mt-1">
            Earn 10 Gems for every short video you watch! Use them for instant checkout discounts.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Daily Check-in Card */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Daily Login Reward</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Collect +25 Gems today
              </p>
            </div>

            <button
              onClick={handleClaim}
              disabled={dailyClaimed}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
                dailyClaimed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {dailyClaimed ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Claimed
                </span>
              ) : (
                'Claim +25'
              )}
            </button>
          </div>

          {/* Interactive Scratch Card */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Surprise Scratch Card</span>
            </h4>

            <div
              onClick={handleScratch}
              className={`relative h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                scratchRevealed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-gradient-to-r from-neutral-800 to-neutral-900 border-neutral-700 text-white hover:scale-[1.01]'
              }`}
            >
              {scratchRevealed ? (
                <div className="text-center animate-in zoom-in duration-300">
                  <span className="text-lg font-black text-emerald-700">
                    🎉 +25 Extra Gems Won!
                  </span>
                  <p className="text-[11px] text-emerald-600 mt-0.5">
                    Added to your wallet balance
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Gift className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-pulse" />
                  <span className="text-xs font-bold">Tap To Scratch & Reveal Reward</span>
                </div>
              )}
            </div>
          </div>

          {/* Redeem for Discount Coupons */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>Redeem Gems for Shopping Coupons</span>
            </h4>

            <div className="space-y-2.5">
              {coupons.map((c) => {
                const canAfford = wallet.gems >= c.cost;
                const isJustRedeemed = redeemedCode === c.code;

                return (
                  <div
                    key={c.code}
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-neutral-900">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          ₹{c.discount} OFF
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {c.desc}
                      </p>
                      <span className="text-[10px] font-semibold text-amber-600">
                        Cost: {c.cost} Gems
                      </span>
                    </div>

                    <button
                      onClick={() => handleRedeem(c.code, c.discount, c.cost)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        isJustRedeemed
                          ? 'bg-emerald-600 text-white'
                          : canAfford
                          ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs'
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      }`}
                    >
                      {isJustRedeemed ? 'Applied!' : 'Redeem'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Coin Activity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Recent Activity
            </h4>
            <div className="space-y-1.5 text-xs">
              {wallet.history.slice(0, 4).map((h) => (
                <div key={h.id} className="flex items-center justify-between py-1 text-neutral-600">
                  <span className="truncate max-w-[220px]">{h.title}</span>
                  <span
                    className={`font-bold tabular-nums ${
                      h.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {h.type === 'earn' ? `+${h.amount}` : `-${h.amount}`} Gems
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
