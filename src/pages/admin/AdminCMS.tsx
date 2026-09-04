import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ServerSettings } from '../../types';
import { FileEdit, CheckCircle2, Save, Sparkles } from 'lucide-react';

export const AdminCMS: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: cms, isLoading } = useQuery<ServerSettings>({
    queryKey: ['serverSettings'],
    queryFn: () => api.getCMS(),
  });

  const [announcementText, setAnnouncementText] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('');
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [tagline, setTagline] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [aboutStory, setAboutStory] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (cms) {
      setAnnouncementText(cms.announcement?.text || '');
      setAnnouncementLink(cms.announcement?.link || '');
      setAnnouncementActive(Boolean(cms.announcement?.enabled));
      setTagline(cms.tagline || '');
      setHeroSubtitle(cms.heroSubtitle || '');
      setAboutStory(cms.aboutStory || '');
    }
  }, [cms]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<ServerSettings>) => api.updateCMS(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverSettings'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      announcement: {
        enabled: announcementActive,
        text: announcementText,
        badge: 'NOTICE',
        link: announcementLink || undefined,
      },
      tagline,
      heroSubtitle,
      aboutStory,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Announcement & CMS Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Control public site announcements, hero branding, and network copy.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-[#38b000]/15 border border-[#38b000]/30 text-xs text-[#38b000] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Site settings saved and active in real-time!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Announcement Banner Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Top Announcement Bar</span>
            </h2>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="rounded border-zinc-700 text-[#7b2cbf] focus:ring-0"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Announcement Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. ⚡ WELCOME SEASON 2026: Use code WELCOME10 for 10% off!"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Target Link (Optional)</label>
              <input
                type="text"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                placeholder="/store or https://discord.gg/..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
              />
            </div>
          </div>
        </div>

        {/* Hero & Brand Copy */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Hero & Brand Messaging</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Experience Minecraft Like Never Before."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="A premier Bangladeshi & Global Minecraft server network..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">About Story</label>
              <textarea
                rows={4}
                value={aboutStory}
                onChange={(e) => setAboutStory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-3 rounded-xl bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/60"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
