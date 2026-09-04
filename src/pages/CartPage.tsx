import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  X,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    finalTotal,
    couponCode,
    appliedCoupon,
    couponError,
    isValidatingCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState(couponCode || '');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    await applyCoupon(inputCode);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#080310] py-24">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Looks like you haven't added any ranks, coins, or keys to your cart yet.
          </p>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-semibold shadow-lg shadow-purple-950/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Iron Cloud Store</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Shopping Cart</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Review your selected packages ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-300 font-bold text-lg font-mono flex-shrink-0">
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {product.name}
                    </h3>
                    <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                      ৳{product.price} BDT each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 border border-zinc-800 rounded-lg bg-zinc-900 px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-mono font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-base font-bold text-white font-mono">
                      ৳{product.price * quantity}
                    </span>
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 rounded text-zinc-500 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                to="/store"
                className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue shopping for more ranks</span>
              </Link>
            </div>
          </div>

          {/* Cart Summary & Coupon Section */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Order Summary
              </h3>

              {/* Coupon Engine Input */}
              <div className="space-y-2">
                <label className="block text-xs text-zinc-400">Promotional Coupon</label>
                {couponCode && appliedCoupon?.valid ? (
                  <div className="p-3 rounded-lg bg-[#38b000]/10 border border-[#38b000]/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#38b000]" />
                      <div>
                        <div className="font-mono font-bold text-[#38b000]">{couponCode}</div>
                        <div className="text-[11px] text-zinc-300">
                          {appliedCoupon.coupon?.name} ({appliedCoupon.coupon?.discountType === 'percentage' ? `${appliedCoupon.coupon.discountValue}% off` : `৳${appliedCoupon.coupon?.discountValue} off`})
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="p-1 text-zinc-400 hover:text-red-400"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#7b2cbf]"
                    />
                    <button
                      type="submit"
                      disabled={isValidatingCoupon || !inputCode.trim()}
                      className="px-3.5 py-2 rounded-lg bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {isValidatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-red-400 font-medium">{couponError}</p>
                )}
                {appliedCoupon?.message && (
                  <p className="text-[11px] text-[#2dc653] font-medium">{appliedCoupon.message}</p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="border-t border-zinc-900 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Cart Subtotal</span>
                  <span className="text-white font-mono">৳{subtotal} BDT</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#38b000]">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-bold">-৳{discount} BDT</span>
                  </div>
                )}

                <div className="border-t border-zinc-900 pt-3 flex justify-between items-baseline text-white">
                  <span className="font-bold text-sm">Final Total</span>
                  <span className="text-2xl font-bold font-mono text-white">
                    ৳{finalTotal} <span className="text-xs text-emerald-400 font-normal">BDT</span>
                  </span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                type="button"
                id="cart-proceed-checkout"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7b2cbf] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#c77dff] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950/60 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Security info */}
              <div className="pt-2 border-t border-zinc-900 space-y-1.5 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payments via bKash & Nagad</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Direct Mojang username verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
