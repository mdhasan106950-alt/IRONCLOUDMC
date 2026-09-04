import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  FileText,
  Terminal,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { data: settings } = useQuery({
    queryKey: ['serverSettings'],
    queryFn: api.getCMS,
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = settings?.faqs || [];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const commands = [
    { cmd: '/help', desc: 'Displays basic server guide and menu navigation' },
    { cmd: '/sethome [name]', desc: 'Set a teleport home location (limits vary by rank)' },
    { cmd: '/home [name]', desc: 'Teleport back to your saved home' },
    { cmd: '/spawn', desc: 'Return safely to the primary realm hub' },
    { cmd: '/fly', desc: 'Toggle flight mode (Hero rank and above)' },
    { cmd: '/crates', desc: 'Open the crate keys roll menu at spawn' },
    { cmd: '/balance (/bal)', desc: 'Check your current economy coin balance' },
    { cmd: '/pay [player] [amt]', desc: 'Send in-game coins securely to another player' },
    { cmd: '/rules', desc: 'Review official network gameplay regulations' },
    { cmd: '/verify [code]', desc: 'Verify your web identity challenge code' },
  ];

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7b2cbf]/20 border border-[#7b2cbf]/30 text-purple-300 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-[#38b000]" />
            <span>PLAYER ASSISTANCE & HELP DESK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Support & FAQs
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Need help with store deliveries, server connection, or gameplay mechanics? We are here around the clock.
          </p>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3 hover:border-[#5865F2] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Discord Ticket Desk</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Open a private support ticket with our administrative staff. Average response time: under 15 minutes.
            </p>
            <div className="pt-2">
              <a
                href="https://discord.gg/Jr2XBcYDSH"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5865F2] hover:text-white"
              >
                <span>Join Discord & Open Ticket</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3 hover:border-emerald-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Payment Inquiries</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Direct assistance for bKash & Nagad payments and store order verification.
            </p>
            <div className="pt-2">
              <div className="text-xs font-mono font-bold text-white">
                01821925430 (WhatsApp)
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-3 hover:border-purple-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Official Email</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              For business inquiries, server partnerships, or sensitive appeals.
            </p>
            <div className="pt-2">
              <a
                href="mailto:ironcloudmc@gmail.com"
                className="text-xs font-mono text-purple-300 hover:text-white"
              >
                ironcloudmc@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#38b000]">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Common Questions & Answers
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-900 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Server Command Guide */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              <span>Essential In-Game Commands</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">Survival & Network</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commands.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3 text-xs"
              >
                <code className="px-2 py-0.5 rounded bg-black border border-zinc-700 text-purple-300 font-mono text-[11px] font-semibold flex-shrink-0">
                  {c.cmd}
                </code>
                <span className="text-zinc-300 text-[11px] mt-0.5">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Report Player CTA */}
        <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Witnessed a Rule Breaker or Cheater?</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Submit an official incident report directly to staff.</p>
            </div>
          </div>
          <Link
            to="/reports"
            className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-colors"
          >
            File Player Report
          </Link>
        </div>
      </div>
    </div>
  );
};
