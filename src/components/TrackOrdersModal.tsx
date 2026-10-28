import React from 'react';
import { X, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Order } from '../types';

interface TrackOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const TrackOrdersModal: React.FC<TrackOrdersModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base font-bold text-neutral-900">
              MY ORDERS & SHIPMENTS ({orders.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-900">No orders placed yet</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Your past purchases and live shipment tracking will show up here.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="border border-neutral-200 rounded-xl p-4 space-y-4 bg-white hover:border-neutral-300 transition-colors"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Order ID
                    </span>
                    <span className="font-mono font-bold text-sm text-neutral-900">
                      {order.id}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Placed On
                    </span>
                    <span className="text-xs text-neutral-700">
                      {order.date}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{order.status}</span>
                  </div>
                </div>

                {/* Tracking Progress */}
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200/80 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-rose-600" />
                    <span className="font-semibold text-neutral-800">
                      Estimated Delivery by: <strong className="text-rose-600">{order.estimatedDelivery}</strong>
                    </span>
                  </div>
                  <span className="text-neutral-500 text-[11px]">
                    To: {order.address.city} ({order.address.pincode})
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Size: {item.selectedSize} · Qty: {item.quantity} · Brand: {item.product.brand}
                        </p>
                      </div>
                      <span className="text-xs font-bold tabular-nums text-neutral-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Paid */}
                <div className="flex justify-between items-center pt-2 border-t border-neutral-100 text-xs">
                  <span className="text-neutral-500">
                    Payment Method: <strong className="text-neutral-800">{order.paymentMethod}</strong>
                  </span>
                  <div className="text-right font-extrabold text-sm text-neutral-900">
                    Total: ₹{order.total.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
