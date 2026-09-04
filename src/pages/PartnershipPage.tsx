import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import {
  HeartHandshake,
  Youtube,
  Globe,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Send,
} from 'lucide-react';

export const PartnershipPage: React.FC = () => {
  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: api.getPartners,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerCategory, setPartnerCategory] = useState('Content Creator');
  const [partnerLink, setPartnerLink] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerProposal, setPartnerProposal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const partnerTiers = [
    {
      title: 'Content Creators & Streamers',
      requirements: '500+ YouTube Subscribers or 1,000+ TikTok/Facebook Gaming followers with active Minecraft content.',
      benefits: ['Exclusive [Creator] In-Game Prefix', 'Free Rank and Crate Keys for giveaways', 'Featured in our Discord & Website', 'Priority event access'],
    },
    {
      title: 'Server & Clan Alliances',
      requirements: 'Established Discord communities (200+ members) or esports organizations interested in cross-events.',
      benefits: ['Cross-community tournament invitations', 'Dedicated clan channels in Discord', 'Custom event hosting on Iron Cloud MC', 'Shared promotional reach'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7b2cbf]/20 border border-[#7b2cbf]/30 text-purple-300 text-xs font-mono">
            <HeartHandshake className="w-3.5 h-3.5 text-[#38b000]" />
            <span>COMMUNITY ALLIANCES & COLLABORATIONS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Partnership Program
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            We partner with passionate Minecraft creators, clans, tournament organizers, and gaming communities to grow together.
          </p>
        </div>

        {/* Existing Partners Showcase */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Featured Network Partners</span>
          </h2>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-400 font-mono">
              Loading partner records...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partners?.map((partner) => (
                <div
                  key={partner.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 flex flex-col justify-between hover:border-[#7b2cbf] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-purple-950 text-purple-300 border border-purple-800/60">
                        {partner.category}
                      </span>
                      <div className="flex items-center gap-2 text-zinc-400">
                        {partner.youtube && (
                          <a href={partner.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
                            <Youtube className="w-4 h-4" />
                          </a>
                        )}
                        {partner.discord && (
                          <a href={partner.discord} target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2]">
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}
                        {partner.website && (
                          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {partner.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-[#38b000] font-semibold">Official Network Partner</span>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-purple-400 hover:text-white"
                      >
                        <span>Visit Partner</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Partnership Tiers & Requirements */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Programs & Creator Privileges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTiers.map((tier, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 space-y-4"
              >
                <h3 className="text-base font-bold text-white">{tier.title}</h3>
                <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
                  <span className="font-semibold text-amber-400 uppercase font-mono text-[10px] block mb-0.5">
                    Eligibility Requirement:
                  </span>
                  {tier.requirements}
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">
                    Partner Benefits:
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {tier.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#38b000] flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 sm:p-10 shadow-2xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Apply for Partnership</h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Submit your details below. Our management team will review your channel or community metrics and get back to you within 48 hours.
            </p>

            {formSubmitted ? (
              <div className="p-6 rounded-xl bg-[#38b000]/15 border border-[#38b000]/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#38b000] mx-auto" />
                <h4 className="text-base font-bold text-white">Application Successfully Received!</h4>
                <p className="text-xs text-zinc-300">
                  Thank you, <strong>{partnerName}</strong>. Our staff has received your partnership application and will contact you via {partnerEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Partner / Channel Name *</label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="e.g. BD Gaming Hub"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Partnership Category</label>
                    <select
                      value={partnerCategory}
                      onChange={(e) => setPartnerCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                    >
                      <option value="Content Creator">Content Creator (YouTube/TikTok)</option>
                      <option value="Community Alliance">Server & Clan Alliance</option>
                      <option value="Esports Tournament">Esports / Tournament Partner</option>
                      <option value="Infrastructure">Infrastructure / Hosting Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Channel / Discord Link *</label>
                    <input
                      type="url"
                      required
                      value={partnerLink}
                      onChange={(e) => setPartnerLink(e.target.value)}
                      placeholder="https://youtube.com/@channel or discord.gg/..."
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      placeholder="partner@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Proposal & Mutual Value *</label>
                  <textarea
                    rows={4}
                    required
                    value={partnerProposal}
                    onChange={(e) => setPartnerProposal(e.target.value)}
                    placeholder="Tell us about your audience demographics, past Minecraft content, and how you would like to collaborate with IRON CLOUD MC..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Partnership Proposal</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
