import React from 'react';
import { ShieldCheck, RefreshCw, Truck, Heart } from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 3-Pillar Assurance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-neutral-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-800 rounded-xl text-rose-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Guarantee</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Directly curated from verified partner ateliers and authorized master craft workshops.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-800 rounded-xl text-rose-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">14-Day Free Exchange</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Hassle-free doorstep trial. Exchange sizes or return with instantaneous refund approvals.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-800 rounded-xl text-rose-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Express National Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Servicing 19,000+ pincodes across India with live GPS-tracked logistics partners.
              </p>
            </div>
          </div>
        </div>

        {/* Links Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          
          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-white">Online Shopping</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => onSelectCategory('MEN')} className="hover:text-white transition-colors">
                  Men's Fashion & Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('WOMEN')} className="hover:text-white transition-colors">
                  Women's Ethnic & Western Wear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('FOOTWEAR')} className="hover:text-white transition-colors">
                  Sneakers & Formal Shoes
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('ACCESSORIES')} className="hover:text-white transition-colors">
                  Bags, Wallets & Watches
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('KIDS')} className="hover:text-white transition-colors">
                  Kids & Toddler Essentials
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-white">Customer Policies</h5>
            <ul className="space-y-2 text-neutral-400">
              <li className="hover:text-white cursor-pointer">Track Orders</li>
              <li className="hover:text-white cursor-pointer">Shipping & Delivery Guidelines</li>
              <li className="hover:text-white cursor-pointer">Cancellation & Return Policy</li>
              <li className="hover:text-white cursor-pointer">Size Guide & Fit Assistance</li>
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-white">Popular Searches</h5>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Oversized T-Shirts · Selvedge Denim · Linen Shirts · Raw Silk Kurta Sets · Retro Chunky Sneakers · Leather Totes · Crop Tops · Cargo Joggers · Chronograph Watches
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-white">Brand Presence</h5>
            <p className="text-neutral-400 leading-relaxed text-xs">
              <strong className="text-white">Gpark Fashion Private Limited</strong><br />
              Atelier Tower, Sector 44, Bengaluru, Karnataka, 560103.
            </p>
            <p className="text-neutral-500 text-[11px] pt-2">
              Customer Support: support@gparkfashion.in · Mon - Sat (9 AM - 8 PM)
            </p>
          </div>

        </div>

        {/* Quiet Clean Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 Gpark Fashion. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Security Statement</span>
            <span>·</span>
            <span>Sitemap</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
