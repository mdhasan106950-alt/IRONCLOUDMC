import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CopyIpButton } from '../components/shared/CopyIpButton';
import {
  Shield,
  Sword,
  Crosshair,
  Boxes,
  CheckCircle2,
  Users,
  Compass,
  Sparkles,
  Zap,
} from 'lucide-react';

export const GameModesPage: React.FC = () => {
  const { data: gamemodes, isLoading } = useQuery({
    queryKey: ['gamemodes'],
    queryFn: api.getGamemodes,
  });

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-800 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7b2cbf]/20 border border-[#7b2cbf]/30 text-purple-300 text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5 text-[#38b000]" />
            <span>PLAYABLE REALMS & MECHANICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Game Modes
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            Every realm on Iron Cloud MC is configured with custom balancing, anti-cheat protection, and dedicated economy systems. Choose your journey below.
          </p>
          <div className="mt-6">
            <CopyIpButton variant="hero" />
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-400 font-mono">Loading realms...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {gamemodes?.map((mode, index) => {
              const icons: Record<string, React.ReactNode> = {
                Shield: <Shield className="w-8 h-8 text-[#38b000]" />,
                Sword: <Sword className="w-8 h-8 text-[#ff9a9e]" />,
                Crosshair: <Crosshair className="w-8 h-8 text-[#9d4edd]" />,
                Boxes: <Boxes className="w-8 h-8 text-amber-400" />,
              };

              return (
                <div
                  key={mode.id}
                  id={`mode-${mode.slug}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/80 overflow-hidden shadow-xl p-6 sm:p-8 hover:border-[#7b2cbf]/60 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex-shrink-0">
                        {icons[mode.icon] || <Zap className="w-8 h-8 text-purple-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-white">{mode.name}</h2>
                          <span
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold ${
                              mode.status === 'ONLINE'
                                ? 'bg-[#38b000]/20 text-[#38b000] border border-[#38b000]/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {mode.status}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300 mt-2 leading-relaxed max-w-2xl">
                          {mode.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 min-w-[200px]">
                      <div className="text-[11px] font-mono uppercase text-zinc-400">Realm Status</div>
                      <div className="text-base font-bold text-white mt-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#38b000]" />
                        <span>Ready to Join</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 font-mono">
                        Command: <code className="text-purple-300">/server {mode.slug}</code>
                      </div>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="mt-8 pt-6 border-t border-zinc-900">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold mb-4">
                      Key Gameplay Mechanics & Features
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {mode.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#38b000] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
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
