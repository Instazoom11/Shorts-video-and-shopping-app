import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Ruler, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; message: string }>({
    checked: false,
    valid: false,
    message: ''
  });
  const [addedNotice, setAddedNotice] = useState(false);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus({
        checked: true,
        valid: true,
        message: 'Delivery by Friday · Free Express Shipping on this order!'
      });
    } else {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian Postal PIN code.'
      });
    }
  };

  const handleAddToBag = () => {
    onAddToCart(product, selectedSize);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-neutral-900 bg-white/80 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                {product.tag && (
                  <div className="absolute top-3 left-3 bg-neutral-900 text-white px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase">
                    {product.tag}
                  </div>
                )}
              </div>

              {/* Thumbnails preview strip */}
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                <div className="w-16 h-20 rounded-lg border-2 border-neutral-900 overflow-hidden shrink-0 cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-16 h-20 rounded-lg border border-neutral-200 overflow-hidden shrink-0 opacity-70 hover:opacity-100 cursor-pointer">
                  <img
                    src={product.image}
                    alt="Side profile"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="space-y-6">
              
              {/* Brand and Title */}
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">
                  {product.brand}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
                  {product.name}
                </h2>
                
                {/* Rating summary */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-xs font-bold">
                    <span>{product.rating}</span>
                    <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  </div>
                  <span className="text-xs text-neutral-500">
                    {product.reviewCount} Verified Customer Ratings
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <div className="flex items-baseline gap-3 tabular-nums">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-rose-600">
                    ({product.discountPercent}% OFF)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Inclusive of all taxes · Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} today
                </p>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold tracking-wider uppercase text-neutral-900">
                    Select Size
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                        selectedSize === size
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                          : 'border-neutral-300 text-neutral-700 hover:border-neutral-500 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Size Guide modal table */}
                {showSizeGuide && (
                  <div className="mt-3 p-3 bg-neutral-100 rounded-lg text-xs space-y-2 border border-neutral-200 animate-in fade-in duration-150">
                    <p className="font-bold text-neutral-900">Standard Indian Garment Dimensions (Inches):</p>
                    <div className="grid grid-cols-4 gap-2 text-center text-neutral-700 font-mono text-[11px]">
                      <div className="font-semibold bg-neutral-200 py-1 rounded">Size</div>
                      <div className="font-semibold bg-neutral-200 py-1 rounded">Chest</div>
                      <div className="font-semibold bg-neutral-200 py-1 rounded">Length</div>
                      <div className="font-semibold bg-neutral-200 py-1 rounded">Shoulder</div>
                      <div>S</div><div>38"</div><div>27.5"</div><div>17"</div>
                      <div>M</div><div>40"</div><div>28.5"</div><div>18"</div>
                      <div>L</div><div>42"</div><div>29.5"</div><div>19"</div>
                      <div>XL</div><div>44"</div><div>30.5"</div><div>20"</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Color Details */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-neutral-600">Color:</span>
                <span
                  className="w-4 h-4 rounded-full border border-neutral-300 inline-block shadow-inner"
                  style={{ backgroundColor: product.colorHex }}
                />
                <span className="font-bold text-neutral-900">{product.colorName}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToBag}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide transition-all shadow-md hover:shadow-rose-600/30"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`py-3.5 px-5 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    isWishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-neutral-300 text-neutral-800 hover:border-neutral-900'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-rose-600 text-rose-600' : ''
                    }`}
                  />
                  <span>{isWishlisted ? 'WISHLISTED' : 'WISHLIST'}</span>
                </button>
              </div>

              {/* Added Notice Feedback */}
              {addedNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added {product.name} (Size: {selectedSize}) to your bag!</span>
                </div>
              )}

              {/* Delivery & Pincode Checker */}
              <div className="border-t border-neutral-200 pt-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
                  <Truck className="w-4 h-4 text-neutral-600" />
                  <span>Delivery Options & Pincode Check</span>
                </div>

                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode (e.g. 560001)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Check
                  </button>
                </form>

                {pincodeStatus.checked && (
                  <p
                    className={`text-xs font-semibold ${
                      pincodeStatus.valid ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {pincodeStatus.message}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                    <span>100% Original Products</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                    <span>14-Day Hassle Free Returns</span>
                  </div>
                </div>
              </div>

              {/* Product Specifications */}
              <div className="border-t border-neutral-200 pt-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Product Details & Fabric
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-y-2 text-xs pt-1">
                  <div>
                    <span className="text-neutral-400">Fabric Composition:</span>
                    <p className="font-semibold text-neutral-800">{product.details.fabric}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Fit Specification:</span>
                    <p className="font-semibold text-neutral-800">{product.details.fit}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Wash Care:</span>
                    <p className="font-semibold text-neutral-800">{product.details.careInstructions}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Origin:</span>
                    <p className="font-semibold text-neutral-800">{product.details.origin}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
