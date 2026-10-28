import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProductTag, CartItem, VideoItem } from '../types';

interface ToastState {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  productImage?: string;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  isFreeShipping: boolean;
  tax: number;
  grandTotal: number;
  appliedPromoCode: string | null;
  isCartOpen: boolean;
  toast: ToastState | null;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: ProductTag,
    video: VideoItem,
    options?: { size?: string; color?: string; quantity?: number }
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  undoRemove: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  dismissToast: () => void;
  checkoutSuccess: (orderId: string) => void;
}

const CART_STORAGE_KEY = 'tikpulse_cart_v1';
const PROMO_STORAGE_KEY = 'tikpulse_cart_promo_v1';
const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING = 4.99;
const TAX_RATE = 0.0825; // 8.25%

const PROMO_CODES: Record<string, { discountPercent: number; freeShipping?: boolean; description: string }> = {
  TIKPULSE20: { discountPercent: 20, description: '20% Off Storewide' },
  CREATOR10: { discountPercent: 10, description: '10% Creator Support' },
  FREESHIP: { discountPercent: 0, freeShipping: true, description: 'Free Express Shipping' },
  WELCOME15: { discountPercent: 15, description: '15% New Customer Welcome' },
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial cart from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
    return [];
  });

  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [lastRemovedItem, setLastRemovedItem] = useState<{ item: CartItem; index: number } | null>(null);

  // Sync cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  // Sync promo code to localStorage
  useEffect(() => {
    try {
      if (appliedPromoCode) {
        localStorage.setItem(PROMO_STORAGE_KEY, appliedPromoCode);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save promo code', e);
    }
  }, [appliedPromoCode]);

  const showToast = useCallback((
    message: string,
    actionLabel?: string,
    onAction?: () => void,
    productImage?: string
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToast({ id, message, actionLabel, onAction, productImage });

    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4500);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addItem = useCallback((
    product: ProductTag,
    video: VideoItem,
    options?: { size?: string; color?: string; quantity?: number }
  ) => {
    const qty = options?.quantity || 1;
    const selectedSize = options?.size || product.variants?.sizes?.[0];
    const selectedColor = options?.color || product.variants?.colors?.[0]?.name;
    const cartItemId = `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === cartItemId);
      if (existingIdx !== -1) {
        // Increment quantity
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qty,
        };
        return updated;
      }

      // Add new cart item
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        title: product.title,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        selectedSize,
        selectedColor,
        quantity: qty,
        addedFromVideoId: video.id,
        addedFromVideoTitle: video.description.slice(0, 45) + (video.description.length > 45 ? '...' : ''),
        addedFromCreatorHandle: video.author.handle,
        addedFromCreatorName: video.author.name,
        addedFromVideoThumbnail: video.thumbnail || video.author.avatar,
        addedAt: Date.now(),
      };

      return [newItem, ...prev];
    });

    showToast(
      `Added "${product.title}" to bag`,
      'View Bag',
      () => setIsCartOpen(true),
      product.image
    );
  }, [showToast]);

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === cartItemId);
      if (idx !== -1) {
        const removed = prev[idx];
        setLastRemovedItem({ item: removed, index: idx });
        showToast(`Removed "${removed.title}"`, 'Undo', () => undoRemove());
        return prev.filter((i) => i.id !== cartItemId);
      }
      return prev;
    });
  }, [showToast]);

  const undoRemove = useCallback(() => {
    if (!lastRemovedItem) return;
    setItems((prev) => {
      const updated = [...prev];
      updated.splice(lastRemovedItem.index, 0, lastRemovedItem.item);
      return updated;
    });
    setLastRemovedItem(null);
    showToast(`Restored "${lastRemovedItem.item.title}"`);
  }, [lastRemovedItem, showToast]);

  const clearCart = useCallback(() => {
    if (items.length === 0) return;
    setItems([]);
    showToast('Shopping bag cleared');
  }, [items.length, showToast]);

  const applyPromoCode = useCallback((code: string) => {
    const formatted = code.trim().toUpperCase();
    if (PROMO_CODES[formatted]) {
      setAppliedPromoCode(formatted);
      return {
        success: true,
        message: `Applied ${PROMO_CODES[formatted].description}!`,
      };
    }
    return {
      success: false,
      message: 'Invalid promo code. Try TIKPULSE20 or CREATOR10',
    };
  }, []);

  const removePromoCode = useCallback(() => {
    setAppliedPromoCode(null);
  }, []);

  const checkoutSuccess = useCallback((orderId: string) => {
    setItems([]);
    showToast(`Order #${orderId} confirmed! Check your email.`, 'View Bag', () => setIsCartOpen(true));
  }, [showToast]);

  // Derived financial calculations
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const activePromo = appliedPromoCode ? PROMO_CODES[appliedPromoCode] : null;
  const discountPercent = activePromo?.discountPercent || 0;
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));

  const isFreeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ||
    activePromo?.freeShipping === true ||
    items.length === 0;

  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Number((taxableAmount * TAX_RATE).toFixed(2));
  const grandTotal = Number((taxableAmount + shippingFee + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        discountPercent,
        discountAmount,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        isFreeShipping,
        tax,
        grandTotal,
        appliedPromoCode,
        isCartOpen,
        toast,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        undoRemove,
        applyPromoCode,
        removePromoCode,
        dismissToast,
        checkoutSuccess,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
