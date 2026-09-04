import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CopyIpButton } from '../components/shared/CopyIpButton';
import { ServerStatusBadge } from '../components/shared/ServerStatusBadge';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Shield,
  Sword,
  Crosshair,
  Boxes,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Flame,
  Award,
  Lock,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { addToCart } = useCart();

  const { data: status } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: api.getServerStatus,
  });

  const { data: gamemodes } = useQuery({
    queryKey: ['gamemodes'],
    queryFn: api.getGamemodes,
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const { data: settings } = useQuery({
    queryKey: ['serverSettings'],
    queryFn: api.getCMS,
  });

  const featuredProducts = products?.filter((p) => p.isFeatured).slice(0, 4) || [];

  return (
    <div className="relative min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-white/5">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Status Badge from theme */}
          <div className="mb-4">
            <ServerStatusBadge />
          </div>

          {/* Official Server Logo */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/25 via-fuchsia-600/20 to-emerald-500/20 blur-3xl rounded-full opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <img
              src="/logo.png"
              alt="Iron Cloud MC Official Logo"
              className="relative w-52 sm:w-64 md:w-72 lg:w-80 h-auto mx-auto object-contain drop-shadow-[0_12px_36px_rgba(0,0,0,0.85)] filter transition-transform duration-300 group-hover:scale-105 select-none"
            />
          </div>

          {/* Subtitle / Brand pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono font-medium tracking-widest uppercase mb-4">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>EST. 2019 • JAVA & BEDROCK NETWORK</span>
          </div>

          {/* Main Display Headline from Immersive UI theme */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase italic select-none">
            Iron Cloud <span className="text-purple-500 underline decoration-white/20 decoration-wavy">MC</span>
          </h1>

          <p className="mt-6 text-sm md:text-base text-slate-400 max-w-xl font-light leading-relaxed">
            {settings?.tagline ||
              'The next generation of competitive Minecraft survival. Fully customized enchantments, active community-driven economy, and lag-free servers.'}
          </p>

          <p className="mt-2 text-xs text-slate-500 max-w-lg">
            {settings?.heroSubtitle ||
              'A premier Bangladeshi & Global Minecraft server network offering Custom Survival, Factions, and competitive PvP arenas.'}
          </p>

          {/* Hero Interaction: Server IP Box & Explore Store button from Theme */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CopyIpButton variant="hero" />

            <Link
              to="/store"
              id="hero-explore-store-cta"
              className="border border-white/20 hover:bg-white/5 px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-white transition-all inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Explore Store</span>
            </Link>

            <Link
              to="/game-modes"
              className="border border-white/10 hover:bg-white/5 px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-all inline-flex items-center gap-2"
            >
              <Sword className="w-4 h-4 text-emerald-400" />
              <span>Game Modes</span>
            </Link>
          </div>

          {/* Server Specifications & Trust Metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-t border-white/5 pt-8">
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Version</div>
              <div className="text-sm font-semibold text-slate-300">1.8 - 1.21.x</div>
            </div>
            <div className="hidden sm:block border-r border-white/5 h-8" />
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uptime</div>
              <div className="text-sm font-semibold text-emerald-400">99.98%</div>
            </div>
            <div className="hidden sm:block border-r border-white/5 h-8" />
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Region</div>
              <div className="text-sm font-semibold text-slate-300">Global / BD</div>
            </div>
            <div className="hidden sm:block border-r border-white/5 h-8" />
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bedrock Port</div>
              <div className="text-sm font-semibold text-purple-400 font-mono">19132</div>
            </div>
          </div>
        </div>
      </section>

      {/* GAME MODES PREVIEW */}
      <section className="py-20 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                <span>Our Realms</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Featured Game Modes
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
                Crafted with care, balanced economies, and custom plugins tailored for fair competitive play.
              </p>
            </div>
            <Link
              to="/game-modes"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-white transition-colors"
            >
              <span>Explore all game modes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamemodes?.map((mode) => {
              const iconMap: Record<string, React.ReactNode> = {
                Shield: <Shield className="w-5 h-5 text-emerald-400" />,
                Sword: <Sword className="w-5 h-5 text-purple-400" />,
                Crosshair: <Crosshair className="w-5 h-5 text-slate-300" />,
                Boxes: <Boxes className="w-5 h-5 text-amber-400" />,
              };

              return (
                <div
                  key={mode.id}
                  className="group relative flex flex-col justify-between rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-purple-500/50 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-sm bg-white/5 border border-white/10 group-hover:border-purple-500/40 transition-colors">
                        {iconMap[mode.icon] || <Zap className="w-5 h-5 text-purple-400" />}
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider ${
                          mode.status === 'ONLINE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {mode.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors uppercase tracking-wide">
                      {mode.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {mode.shortDescription}
                    </p>

                    <ul className="mt-4 space-y-1.5 text-[11px] text-slate-300 border-t border-white/5 pt-3">
                      {mode.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/5">
                    <Link
                      to="/game-modes"
                      className="inline-flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors"
                    >
                      <span>Read Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED STORE PRODUCTS */}
      <section className="py-20 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                <span>Official Webstore</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Popular Ranks & Packages
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
                Instant delivery in-game. Payments securely handled via bKash and Nagad.
              </p>
            </div>
            <Link
              to="/store"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-white transition-colors"
            >
              <span>View Full Store Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group relative flex flex-col justify-between rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-purple-500/50 transition-all duration-200"
              >
                {prod.badge && (
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-sm bg-purple-600 text-white text-[10px] font-bold tracking-widest uppercase shadow-md">
                    {prod.badge}
                  </div>
                )}

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold mb-1">
                    {prod.category}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors uppercase tracking-wide">
                    {prod.name}
                  </h3>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white font-mono">
                      ৳{prod.price}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs text-slate-500 line-through font-mono">
                        ৳{prod.originalPrice}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      BDT
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>

                  <ul className="mt-4 space-y-1.5 text-xs text-slate-300 border-t border-white/5 pt-3">
                    {prod.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart(prod, 1)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-sm bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/store/products/${prod.slug}`}
                    className="p-2 rounded-sm border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white text-xs transition-colors"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE IRON CLOUD MC */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <span>Network Quality</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Engineered for Minecraft Players
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From our custom plugins to anti-cheat enforcement, experience a lag-free environment built to last.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Low Latency & High TPS</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hosted on dedicated NVMe hardware with optimized garbage collection and network routing for seamless sub-40ms latency across South Asia and worldwide routes.
              </p>
            </div>

            <div className="p-6 rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Anti-Cheat & Staff</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Zero tolerance for hacked clients, auto-clickers, and exploits. Our machine-learning anti-cheat and active moderation team maintain a fair, cheat-free environment.
              </p>
            </div>

            <div className="p-6 rounded-sm border border-white/10 bg-black/40 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">True Java & Bedrock Cross-Play</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Play seamlessly with your friends whether they are on PC Java Edition, Minecraft Bedrock, Mobile, or Console using port 19132.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
