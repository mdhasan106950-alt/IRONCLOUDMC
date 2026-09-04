import React from 'react';
import { Link } from 'react-router-dom';
import { CopyIpButton } from '../shared/CopyIpButton';
import { ServerStatusBadge } from '../shared/ServerStatusBadge';
import {
  MessageSquare,
  Mail,
  Phone,
  ShieldCheck,
  Heart,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-md text-slate-400">
      {/* Top Banner / Call to Action in footer */}
      <div className="border-b border-white/5 bg-gradient-to-r from-purple-900/10 via-black/40 to-emerald-900/10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <span>Ready to embark?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Join Thousands of Adventurers Today
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Compatible with Minecraft Java Edition (1.8 - 1.21.8) and Bedrock Edition.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <CopyIpButton variant="hero" />
            <a
              href="https://discord.gg/Jr2XBcYDSH"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-white/20 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Join Discord</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Iron Cloud MC"
                  className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]"
                />
              </div>
              <span className="font-bold text-base tracking-widest text-slate-100 uppercase">
                IRON CLOUD <span className="text-purple-500">MC</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm border-l-2 border-purple-500 pl-3">
              Experience Minecraft like never before. Founded in 2019, IRON CLOUD MC is a premier
              survival, factions, and competitive network built for players who crave competition and community.
            </p>

            <div className="pt-2">
              <ServerStatusBadge />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Explore Network
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/game-modes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Game Modes</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>About Our History</span>
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Staff & Team</span>
                </Link>
              </li>
              <li>
                <Link to="/partnership" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Partnership Program</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Official Store
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/store" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>All Packages</span>
                </Link>
              </li>
              <li>
                <Link to="/store/ranks" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Server Ranks</span>
                </Link>
              </li>
              <li>
                <Link to="/store/coins" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Economy Coins</span>
                </Link>
              </li>
              <li>
                <Link to="/store/keys" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Crate Keys</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Shopping Cart</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Help & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/rules" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Server Rules</span>
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>FAQ & Help Desk</span>
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                  <span>Player Reports</span>
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>bKash / Nagad: 01821925430</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>ironcloudmc@gmail.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Live Network Ticker from Design */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Latest News</span>
              <span className="text-[11px] text-white font-medium">Update v1.4.2: The Iron Forge is live!</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Current Season</span>
              <span className="text-[11px] text-purple-400 font-medium">Season 4: Metallic Overdrive</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 opacity-50">
              <div className="w-2 h-2 bg-slate-400 rounded-full" />
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              &copy; {new Date().getFullYear()} Iron Cloud MC. Professional Network.
            </p>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-4 text-[10px] text-slate-600 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Not an official Minecraft service. We are not approved by or associated with Mojang or Microsoft.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/rules" className="hover:text-slate-400 transition-colors">
              Terms & Rules
            </Link>
            <span>•</span>
            <Link to="/support" className="hover:text-slate-400 transition-colors">
              Payment Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
