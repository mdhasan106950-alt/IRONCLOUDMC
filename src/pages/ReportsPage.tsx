import React, { useState } from 'react';
import { api } from '../lib/api';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Send,
  Link as LinkIcon,
  User,
  Gamepad2,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [targetUsername, setTargetUsername] = useState('');
  const [reason, setReason] = useState('Hacking / Cheating');
  const [realm, setRealm] = useState('Survival');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!targetUsername.trim()) {
      setErrorMsg('Please specify the reported player username.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please describe the incident in detail.');
      return;
    }

    setIsSubmitting(true);
    try {
      const report = await api.submitReport({
        targetUsername: targetUsername.trim(),
        reason,
        realm,
        description: description.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
        reporterName: reporterName.trim() || undefined,
        reporterContact: reporterContact.trim() || undefined,
      });

      setSubmittedReportId(report.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>PLAYER INCIDENT DESK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Report a Player
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed font-light">
            Help us maintain a clean, fair gaming atmosphere. Staff investigate all verified evidence including auto-clickers, fly hacks, scamming, and chat harassment.
          </p>
        </div>

        {submittedReportId ? (
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950/90 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#38b000]/20 border border-[#38b000]/40 flex items-center justify-center mx-auto text-[#38b000]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Report Successfully Submitted</h2>
            <p className="text-xs text-zinc-300 max-w-md mx-auto">
              Your report against <strong className="text-white font-mono">{targetUsername}</strong> has been logged under ID{' '}
              <span className="text-purple-400 font-mono font-bold">{submittedReportId}</span>. Staff will review the incident logs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmittedReportId(null);
                setTargetUsername('');
                setDescription('');
                setEvidenceUrl('');
              }}
              className="px-5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold hover:bg-zinc-800"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 space-y-6 shadow-xl"
          >
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Reported Player Minecraft IGN *
                </label>
                <input
                  type="text"
                  required
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                  placeholder="e.g. Cheater123"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#7b2cbf]"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Incident Realm</label>
                <select
                  value={realm}
                  onChange={(e) => setRealm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                >
                  <option value="Custom Survival">Custom Survival</option>
                  <option value="Iron Factions">Iron Factions</option>
                  <option value="PvP Duels">PvP Duels Arena</option>
                  <option value="Skyblock Realms">Skyblock Realms</option>
                  <option value="Lobby / Hub">Main Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Violation Category *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                >
                  <option value="Hacking / Cheating">Hacking / Cheating (Killaura, Fly, Speed, Reach)</option>
                  <option value="Toxicity / Harassment">Toxicity, Slurs or Harassment in Chat</option>
                  <option value="Bug Abuse / Duplication">Bug Abuse / Duplication Exploits</option>
                  <option value="Scamming / Real Money Trading">Scamming or Unauthorized RMT</option>
                  <option value="Advertising / Spam">Advertising Other Servers / Link Spam</option>
                  <option value="Other">Other Rule Infraction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Evidence URL (YouTube/Imgur/Twitch)</label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://youtu.be/... or imgur.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Incident Explanation *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what occurred, timestamps in video, and any witness names..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Your Name / IGN (Optional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Your Minecraft username"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Your Discord / Contact (Optional)</label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Discord username for updates"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting Report...' : 'File Official Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
