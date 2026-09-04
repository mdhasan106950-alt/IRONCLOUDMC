import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  CreditCard,
  Crown,
  ChevronRight,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.getProductBySlug(slug!),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080310] py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-zinc-400 font-mono">Loading package specifications...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#080310] py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Package Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">The requested store package does not exist or has been removed.</p>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7b2cbf] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/store" className="hover:text-white transition-colors">Store</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/store/${product.category}`} className="hover:text-white uppercase transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#7b2cbf]/30 text-purple-300 border border-[#7b2cbf]/40">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#38b000]/20 text-[#38b000] border border-[#38b000]/30">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">{product.description}</p>

              {/* Price Display */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-baseline justify-between mb-8">
                <div>
                  <div className="text-[11px] text-zinc-400 uppercase font-mono">Price</div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-bold text-white font-mono">৳{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-zinc-500 line-through font-mono">৳{product.originalPrice}</span>
                    )}
                    <span className="text-xs text-emerald-400 font-mono font-semibold">BDT</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-zinc-400 uppercase font-mono">Delivery</div>
                  <div className="text-xs text-[#38b000] font-semibold mt-0.5 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Instant In-Game</span>
                  </div>
                </div>
              </div>

              {/* Perks / Features */}
              <div>
                <h3 className="text-sm font-semibold text-white uppercase font-mono tracking-wider mb-3">
                  Included Perks & Privileges
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#38b000] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details & Guarantees */}
              {product.details && product.details.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-900">
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase font-mono tracking-wider mb-2">
                    Package Terms & Conditions
                  </h3>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Action Card Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sticky top-28 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Purchase Package
              </h3>

              {/* Quantity selector */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-zinc-900 flex justify-between items-baseline">
                <span className="text-xs text-zinc-400">Total Price:</span>
                <span className="text-2xl font-bold text-white font-mono">
                  ৳{product.price * quantity} BDT
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    added
                      ? 'bg-[#38b000] text-black'
                      : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7b2cbf] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#c77dff] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950/60 cursor-pointer"
                >
                  Instant Checkout
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 border-t border-zinc-900 space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2 text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-[#38b000]" />
                  <span>100% Secure Transaction</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>bKash & Nagad Accepted</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Lifetime Rank Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
