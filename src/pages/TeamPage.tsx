import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { TeamMember } from '../types';
import {
  Users,
  Shield,
  Crown,
  Code,
  HeartHandshake,
  MessageSquare,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { data: team, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: api.getTeam,
  });

  const [activeDept, setActiveDept] = useState<string>('All');

  const departments = ['All', 'Management', 'Administration', 'Moderation', 'Helpers'];

  const filteredTeam = team?.filter((m) => {
    if (activeDept === 'All') return true;
    return m.department === activeDept;
  }) || [];

  const getDeptIcon = (dept: string) => {
    switch (dept) {
      case 'Management':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'Administration':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'Moderation':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      default:
        return <HeartHandshake className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7b2cbf]/20 border border-[#7b2cbf]/30 text-purple-300 text-xs font-mono">
            <Users className="w-3.5 h-3.5 text-[#38b000]" />
            <span>THE PEOPLE BEHIND THE NETWORK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Our Staff & Team
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
            Meet the passionate administrators, developers, moderators, and helpers dedicated to keeping Iron Cloud MC safe, competitive, and enjoyable.
          </p>

          {/* Department Filter Tabs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeDept === dept
                    ? 'bg-[#7b2cbf] text-white shadow-md shadow-purple-950/60'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-400 font-mono">Loading staff roster...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 p-6 hover:border-[#7b2cbf] hover:shadow-[0_0_20px_rgba(123,44,191,0.2)] transition-all duration-200"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-md">
                      <img
                        src={`https://minotar.net/helm/${encodeURIComponent(member.minecraftUsername)}/128.png`}
                        alt={member.name}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-purple-300 font-semibold">
                        {getDeptIcon(member.department)}
                        <span>{member.department}</span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-purple-300 transition-colors">
                        {member.name}
                      </h3>
                      <div className="text-xs text-[#38b000] font-mono font-semibold">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[50px]">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>IGN: {member.minecraftUsername}</span>
                  {member.socials?.discord && (
                    <span className="text-[11px] text-purple-400 truncate max-w-[120px]" title={member.socials.discord}>
                      {member.socials.discord}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join Staff Banner */}
        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#240046]/30 via-zinc-950 to-[#10002b]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Interested in Joining the Staff Team?</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
              We are frequently scouting mature, dedicated community helpers and moderators. Apply through our official community Discord.
            </p>
          </div>
          <a
            href="https://discord.gg/Jr2XBcYDSH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold transition-colors shadow-lg flex-shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Staff Applications on Discord</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
