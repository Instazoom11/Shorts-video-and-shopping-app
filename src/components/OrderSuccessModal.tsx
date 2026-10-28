import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, PackageCheck, Truck, MapPin, X, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  useEffect(() => {
    if (isOpen && order) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const trackingSteps = [
    { title: 'Order Placed', time: 'Just now', completed: true },
    { title: 'Packed at Gpark Hub', time: 'Tomorrow 9:00 AM', completed: false },
    { title: 'In Transit / Shipped', time: 'Thursday', completed: false },
    { title: 'Out for Delivery', time: order.estimatedDelivery, completed: false }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Header State */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
              Order Confirmed!
            </h2>
            <p className="text-xs text-neutral-500">
              Order ID: <span className="font-mono font-bold text-neutral-800">{order.id}</span>
            </p>
            <p className="text-xs text-neutral-600">
              We've dispatched confirmation and tracking updates to your mobile number.
            </p>
          </div>

          {/* Tracking Timeline */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900">
              <Truck className="w-4 h-4 text-rose-600" />
              <span>Live Shipment Status</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
              {trackingSteps.map((step, idx) => (
                <div key={step.title} className="relative">
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 ${
                      step.completed
                        ? 'bg-rose-600 border-white shadow-sm'
                        : 'bg-neutral-200 border-white'
                    }`}
                  />
                  <div className="text-xs">
                    <p className={`font-bold ${step.completed ? 'text-neutral-900' : 'text-neutral-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-neutral-400">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items Preview */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Purchased Items ({order.items.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg border border-neutral-100"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Size: {item.selectedSize} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>Delivery Address</span>
              </div>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                <span className="font-semibold text-neutral-900">{order.address.fullName}</span><br />
                {order.address.addressLine}, {order.address.city}, {order.address.state} - {order.address.pincode}<br />
                Phone: {order.address.mobile}
              </p>
            </div>

            <div>
              <span className="font-bold text-neutral-800 mb-1 block">
                Payment & Amount
              </span>
              <p className="text-neutral-600 text-[11px] space-y-0.5">
                <span>Method: <strong className="text-neutral-900">{order.paymentMethod}</strong></span><br />
                <span>Total Paid: <strong className="text-neutral-900 text-xs">₹{order.total.toLocaleString('en-IN')}</strong></span>
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={onClose}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue Shopping on Gpark</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
