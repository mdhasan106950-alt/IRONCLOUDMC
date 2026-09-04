import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Product, ProductType } from '../types';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Crown,
  Coins,
  Key,
  Package,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export const StorePage: React.FC = () => {
  const { category: routeCategory } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Active category from URL params or state
  const activeCategory = (routeCategory || searchParams.get('category') || 'all') as string;

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const categories: { id: string; name: string; icon: React.ReactNode }[] = [
    { id: 'all', name: 'All Packages', icon: <Package className="w-4 h-4" /> },
    { id: 'ranks', name: 'Server Ranks', icon: <Crown className="w-4 h-4" /> },
    { id: 'coins', name: 'Economy Coins', icon: <Coins className="w-4 h-4" /> },
    { id: 'keys', name: 'Crate Keys', icon: <Key className="w-4 h-4" /> },
    { id: 'bundle', name: 'Special Bundles', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const filteredProducts = products?.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }) || [];

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Header */}
        <div className="border-b border-white/5 pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>OFFICIAL WEBSTORE • INSTANT IN-GAME DELIVERY</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Iron Cloud MC"
                  className="w-10 sm:w-12 h-10 sm:h-12 object-contain drop-shadow-md flex-shrink-0"
                />
                <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  Iron Cloud Store
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Support the network and elevate your gameplay with permanent ranks, crate keys, economy coins, and starter bundles.
              </p>
            </div>

            {/* Quick Payment info badge */}
            <div className="flex items-center gap-3 p-3 rounded-sm bg-black/40 border border-white/10 backdrop-blur-sm text-xs text-slate-300">
              <CreditCard className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px] uppercase tracking-wider">Supported Payment Methods</div>
                <div className="text-[11px] text-slate-400 font-mono">bKash & Nagad (Official: 01821925430)</div>
              </div>
            </div>
          </div>

          {/* Search & Categories Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <Link
                    key={cat.id}
                    to={cat.id === 'all' ? '/store' : `/store/${cat.id}`}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-black/40 text-slate-400 hover:text-white hover:bg-white/5 border border-white/10'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages..."
                className="w-full pl-9 pr-3 py-1.5 rounded-sm bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-mono">Loading store packages from backend...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-black/30 rounded-sm border border-white/10 p-8">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">No packages found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedId === product.id;
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-purple-500/50 transition-all duration-200"
                >
                  {product.badge && (
                    <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-sm bg-purple-600 text-white text-[10px] font-bold tracking-widest uppercase shadow-md">
                      {product.badge}
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold mb-1">
                      {product.category}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors uppercase tracking-wide">
                      {product.name}
                    </h3>

                    {/* Pricing */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white font-mono">
                        ৳{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ৳{product.originalPrice}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                        BDT
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Features list */}
                    <ul className="mt-4 space-y-1.5 text-xs text-slate-300 border-t border-white/5 pt-3">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                    <button
                      type="button"
                      id={`add-to-cart-${product.id}`}
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-500 text-black'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
                    </button>
                    <Link
                      to={`/store/products/${product.slug}`}
                      className="p-2 rounded-sm border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white text-xs transition-colors"
                      title="View full specs"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
