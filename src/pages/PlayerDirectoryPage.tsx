import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Gamepad2, ArrowRight } from 'lucide-react';

export const PlayerDirectoryPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/players/${encodeURIComponent(searchInput.trim())}`);
  };

  const samplePlayers = ['MR_DOOM_YT', 'senpai_hasan', 'sazim_admin', 'Notch', 'Technoblade'];

  return (
    <div className="min-h-screen bg-[#080310] py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7b2cbf]/20 border border-[#7b2cbf]/30 text-purple-300 text-xs font-mono">
            <Gamepad2 className="w-3.5 h-3.5 text-[#38b000]" />
            <span>PLAYER LOOKUP & SKIN EXPLORER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Player Directory
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Search any Minecraft In-Game Name to inspect skin renders, verify UUID, and view network activity.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Minecraft IGN..."
              className="w-full pl-9 pr-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#7b2cbf]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-6 border-t border-zinc-900">
          <span className="text-xs text-zinc-500 block mb-3">Popular or Staff Profiles:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {samplePlayers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => navigate(`/players/${p}`)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-[#7b2cbf] font-mono transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
