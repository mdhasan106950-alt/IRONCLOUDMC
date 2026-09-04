import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { CopyIpButton } from '../components/shared/CopyIpButton';
import {
  ShieldCheck,
  Award,
  Zap,
  Users,
  Server,
  Heart,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { data: settings } = useQuery({
    queryKey: ['serverSettings'],
    queryFn: api.getCMS,
  });

  const milestones = [
    {
      year: '2019',
      title: 'Humble Beginnings',
      description: 'Founded by HASAN as a private survival sanctuary for friends, focused on cooperative building and exploration.',
    },
    {
      year: '2021',
      title: 'Public Community Launch',
      description: 'Expanded hardware and opened public gates to Bangladesh and international players, launching the original Iron Factions.',
    },
    {
      year: '2023',
      title: 'Geyser Cross-Play Integration',
      description: 'Introduced true Bedrock and Java cross-play support, allowing mobile and console players to join the same world.',
    },
    {
      year: '2025 - 2026',
      title: 'The Modern Era',
      description: 'Over 10,000 community members, dedicated NVMe infrastructure, custom economy balancing, and automated bKash/Nagad webstore.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7b2cbf]/20 border border-[#7b2cbf]/30 text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#38b000]" />
            <span>OUR HISTORY & MISSION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            About Iron Cloud MC
          </h1>
          <p className="text-base text-zinc-300 leading-relaxed font-light">
            Founded on the pillars of friendship, permanence, and fair gameplay since 2019.
          </p>
        </div>

        {/* Origin Story Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">The Founding Story</h2>
              <span className="text-xs font-mono text-zinc-400">Created by HASAN & Friends</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {settings?.aboutStory ||
              'IronCloudMC was founded in 2019 by HASAN as a private world for a close group of friends. What started as a simple idea — a place to create and have fun together — has grown into one of the most welcoming Minecraft communities in South Asia and beyond.'}
          </p>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            The name reflects our foundational spirit: <strong>Iron</strong> stands for strength, durability, and permanence.
            <strong> Cloud</strong> reflects our limitless creative aspirations and sky-high adventures. From our earliest spawn outpost to the vast kingdoms built today, every adventurer has etched their legacy into our history.
          </p>

          <div className="pt-4 border-t border-zinc-900 flex flex-wrap items-center gap-4">
            <CopyIpButton variant="compact" />
            <span className="text-xs text-zinc-400 font-mono">Server Address: play.ironcloudmc.fun</span>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#38b000]">Chronicle</span>
            <h2 className="text-2xl font-bold text-white mt-1">Our Journey Through the Years</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/70 space-y-2 hover:border-[#7b2cbf] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-[#9d4edd]">{m.year}</span>
                  <Clock className="w-4 h-4 text-zinc-500" />
                </div>
                <h3 className="text-base font-bold text-white">{m.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical & Hardware Specs */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            <span>Infrastructure & Architecture</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-xs text-zinc-400 uppercase font-mono">Hardware</div>
              <div className="text-base font-bold text-white mt-1">Enterprise NVMe SSDs</div>
              <p className="text-[11px] text-zinc-400 mt-1">Zero chunk-loading lag with ultra-fast disk throughput.</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-xs text-zinc-400 uppercase font-mono">Network</div>
              <div className="text-base font-bold text-[#38b000] mt-1">DDoS Protected 1Gbps</div>
              <p className="text-[11px] text-zinc-400 mt-1">Direct peering across South Asia for minimal round-trip ping.</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="text-xs text-zinc-400 uppercase font-mono">Cross-Play</div>
              <div className="text-base font-bold text-amber-400 mt-1">GeyserMC + Floodgate</div>
              <p className="text-[11px] text-zinc-400 mt-1">Native Bedrock mobile & console compatibility on port 19132.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
