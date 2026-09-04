import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Megaphone, X, ArrowRight } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { data: settings } = useQuery({
    queryKey: ['serverSettings'],
    queryFn: api.getCMS,
    staleTime: 60000,
  });

  if (dismissed || !settings?.announcement?.enabled || !settings?.announcement?.text) {
    return null;
  }

  const { badge, text, link } = settings.announcement;

  return (
    <div
      id="top-announcement-banner"
      className="relative z-50 bg-black/40 border-b border-white/5 backdrop-blur-sm text-xs py-2 px-4 text-slate-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex-shrink-0 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-purple-600/20 border border-purple-500/30 text-purple-300 tracking-wider font-mono">
            {badge || 'ANNOUNCEMENT'}
          </span>
          <p className="truncate text-slate-300 font-medium">
            {text}
          </p>
          {link && (
            <Link
              to={link}
              className="flex-shrink-0 inline-flex items-center gap-1 text-purple-400 hover:text-white font-semibold transition-colors underline ml-1"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
