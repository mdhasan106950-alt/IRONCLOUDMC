import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import {
  ShieldAlert,
  AlertTriangle,
  Gavel,
  FileCheck,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export const RulesPage: React.FC = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['serverSettings'],
    queryFn: api.getCMS,
  });

  const rules = settings?.rules || [];

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono">
            <Gavel className="w-3.5 h-3.5 text-red-400" />
            <span>COMMUNITY GOVERNANCE & ENFORCEMENT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Server Rules & Policies
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed font-light">
            By connecting to play.ironcloudmc.fun or joining our community Discord, you agree to abide by the following official network regulations.
          </p>
        </div>

        {/* Rules List */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-zinc-400 font-mono">
            Loading rules...
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule, idx) => (
              <div
                key={rule.id}
                className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 hover:border-zinc-700 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-purple-400 flex-shrink-0">
                      #{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{rule.title}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-red-950/50 text-red-400 border border-red-900/50 flex-shrink-0">
                    Strictly Enforced
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed pl-10">
                  {rule.description}
                </p>

                <div className="pl-10 pt-2 flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                  <span className="text-red-400 font-semibold">Standard Punishment:</span>
                  <span>{rule.punishment}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appeals & Support Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Need to Appeal a Ban or Mute?</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              If you believe a punishment was executed mistakenly, you may submit a formal appeal with video or chat evidence through our ticket desk.
            </p>
          </div>
          <a
            href="https://discord.gg/Jr2XBcYDSH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex-shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Appeal Ticket</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );
};
