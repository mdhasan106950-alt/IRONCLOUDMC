import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { compressImageToAvatar } from '../lib/imageUtils';
import {
  Gamepad2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  KeyRound,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Copy,
  Check,
  Upload,
  Camera,
  Edit3,
  User as UserIcon,
  Sparkles,
  Save,
  X,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Phone,
  Calendar,
} from 'lucide-react';

export const PlayerProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user, isAdmin, uploadProfilePicture, updateProfile, updateMinecraftAccount } = useAuth();

  const [challengeCode, setChallengeCode] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editDiscord, setEditDiscord] = useState(user?.discord || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editIgn, setEditIgn] = useState(user?.minecraftUsername || 'MR_DOOM_YT');
  const [editEdition, setEditEdition] = useState<'Java' | 'Bedrock'>(user?.minecraftEdition || 'Java');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const queryUsername = username || user?.minecraftUsername || 'MR_DOOM_YT';
  const isOwnerViewingOwnProfile = !username || (user && user.minecraftUsername?.toLowerCase() === queryUsername.toLowerCase());

  // Minecraft player lookup
  const { data: playerData, refetch: refetchPlayer } = useQuery({
    queryKey: ['playerProfile', queryUsername],
    queryFn: () => api.lookupPlayer(queryUsername),
    enabled: Boolean(queryUsername),
  });

  // Orders
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => api.getOrders(),
  });

  const playerOrders = orders?.filter(
    (o) =>
      o.minecraft.username.toLowerCase() === queryUsername.toLowerCase() ||
      (user && o.buyer.email === user.email)
  ) || [];

  const handleGenerateChallenge = async () => {
    try {
      const res = await api.generateChallenge(queryUsername);
      setChallengeCode(res.challengeCode);
    } catch {
      setChallengeCode(`IC-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleCopyCmd = () => {
    if (!challengeCode) return;
    navigator.clipboard.writeText(`/verify ${challengeCode}`);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  // Avatar file upload handler with client-side compression
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    // Limit to 10MB input file
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file exceeds the 10MB limit.');
      return;
    }

    setIsUploadingAvatar(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Compress to high quality ~20KB thumbnail
      const compressedBase64 = await compressImageToAvatar(file, 256, 0.82);
      await uploadProfilePicture(compressedBase64);
      setUploadSuccess('Profile picture updated and saved!');
      setTimeout(() => setUploadSuccess(null), 3500);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process and upload profile picture.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Reset to Minecraft skin avatar
  const handleResetToSkinAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const skinUrl = `https://minotar.net/helm/${encodeURIComponent(queryUsername)}/180.png`;
      await updateProfile({
        avatarUrl: skinUrl,
        picture: skinUrl,
        avatarSource: 'minecraft',
      });
      setUploadSuccess('Avatar reset to your Minecraft skin head.');
      setTimeout(() => setUploadSuccess(null), 3000);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setUploadError(null);
    try {
      await updateProfile({
        name: editName,
        bio: editBio,
        discord: editDiscord,
        phone: editPhone,
        minecraftUsername: editIgn.trim(),
        minecraftEdition: editEdition,
      });

      if (editIgn.trim() !== user?.minecraftUsername || editEdition !== user?.minecraftEdition) {
        await updateMinecraftAccount(editIgn.trim(), editEdition);
        refetchPlayer();
      }

      setUploadSuccess('Profile details successfully updated!');
      setIsEditingProfile(false);
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Display avatar logic
  const currentAvatar =
    isOwnerViewingOwnProfile && user?.avatarUrl
      ? user.avatarUrl
      : `https://minotar.net/helm/${encodeURIComponent(queryUsername)}/180.png`;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Status Alerts */}
        {uploadSuccess && (
          <div className="p-4 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadSuccess(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {uploadError && (
          <div className="p-4 rounded-sm bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-red-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Profile Card with Avatar Upload Integration */}
        <div className="rounded-sm border border-white/10 bg-black/40 backdrop-blur-md p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar Column with Upload Capability */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="relative group">
                <div className="w-32 h-32 rounded-sm bg-black/60 border-2 border-purple-500/40 p-1 overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.25)] flex items-center justify-center">
                  <img
                    src={currentAvatar}
                    alt={queryUsername}
                    className="w-full h-full object-cover rounded-sm filter drop-shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://minotar.net/avatar/${encodeURIComponent(queryUsername)}/128.png`;
                    }}
                  />
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-purple-300 font-bold">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Overlay Button (visible on hover or focus for user) */}
                {isOwnerViewingOwnProfile && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Custom Profile Picture"
                    className="absolute inset-0 bg-black/60 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-purple-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Change Picture</span>
                  </button>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                />
              </div>

              {/* Avatar Action Controls */}
              {isOwnerViewingOwnProfile && (
                <div className="flex flex-col gap-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="px-3 py-1.5 rounded-sm bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picture</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToSkinAvatar}
                    disabled={isUploadingAvatar}
                    className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-mono tracking-wider transition-all cursor-pointer border border-white/10"
                  >
                    Use Skin Head
                  </button>
                </div>
              )}
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 text-center md:text-left space-y-3 w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-800/60 font-semibold">
                  Player Identity
                </span>

                {user?.role && (
                  <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{user.role}</span>
                  </span>
                )}

                {playerData?.verified && (
                  <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Verified Mojang Character</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    {queryUsername}
                  </h1>
                  {user?.name && user.name !== queryUsername && (
                    <div className="text-xs text-slate-300 font-medium">{user.name}</div>
                  )}
                </div>

                {isOwnerViewingOwnProfile && !isEditingProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(user?.name || '');
                      setEditBio(user?.bio || '');
                      setEditDiscord(user?.discord || '');
                      setEditPhone(user?.phone || '');
                      setEditIgn(user?.minecraftUsername || 'MR_DOOM_YT');
                      setEditEdition(user?.minecraftEdition || 'Java');
                      setIsEditingProfile(true);
                    }}
                    className="px-3 py-1.5 rounded-sm border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/50 text-purple-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile Details</span>
                  </button>
                )}
              </div>

              {/* Bio & Details Display */}
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {user?.bio ||
                  'No bio provided yet. Click "Edit Profile Details" to add your introduction and Discord contact.'}
              </p>

              {/* Meta information tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
                <div className="p-2.5 rounded-sm bg-white/5 border border-white/5 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="text-slate-400 text-[10px] block">MINECRAFT EDITION</span>
                    <span className="text-white font-semibold">
                      {user?.minecraftEdition || 'Java Edition'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-sm bg-white/5 border border-white/5 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="text-slate-400 text-[10px] block">DISCORD</span>
                    <span className="text-white font-semibold">
                      {user?.discord || 'Not linked'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-sm bg-white/5 border border-white/5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="truncate">
                    <span className="text-slate-400 text-[10px] block">JOINED NETWORK</span>
                    <span className="text-white font-semibold">
                      {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '2024'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Challenge Verification Tool */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {challengeCode ? (
                  <div className="flex items-center gap-2 p-2 rounded-sm bg-black/60 border border-purple-500/40 text-xs">
                    <span className="text-slate-400">Run in-game:</span>
                    <code className="text-emerald-400 font-mono font-bold">/verify {challengeCode}</code>
                    <button
                      type="button"
                      onClick={handleCopyCmd}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                      title="Copy verification command"
                    >
                      {copiedCmd ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateChallenge}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-semibold cursor-pointer transition-all"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Generate Verification Challenge</span>
                  </button>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Open Admin Panel</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Inline Profile Editing Drawer/Card */}
          {isEditingProfile && (
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Edit Profile Information
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 rounded-sm bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Minecraft In-Game Name (IGN)
                  </label>
                  <input
                    type="text"
                    required
                    value={editIgn}
                    onChange={(e) => setEditIgn(e.target.value)}
                    placeholder="e.g. MR_DOOM_YT"
                    className="w-full px-3 py-2 rounded-sm bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Discord Tag
                  </label>
                  <input
                    type="text"
                    value={editDiscord}
                    onChange={(e) => setEditDiscord(e.target.value)}
                    placeholder="e.g. username#0001"
                    className="w-full px-3 py-2 rounded-sm bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Edition
                  </label>
                  <select
                    value={editEdition}
                    onChange={(e) => setEditEdition(e.target.value as 'Java' | 'Bedrock')}
                    className="w-full px-3 py-2 rounded-sm bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  >
                    <option value="Java">Java Edition</option>
                    <option value="Bedrock">Bedrock Edition</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    About / Bio
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Tell other players about yourself..."
                    className="w-full px-3 py-2 rounded-sm bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-sm bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* 3D Skin Render & In-Game Character Showcase */}
        <div className="rounded-sm border border-white/10 bg-black/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-32 rounded-sm bg-black/50 border border-white/10 flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
              <img
                src={`https://minotar.net/armor/body/${encodeURIComponent(queryUsername)}/180.png`}
                alt={queryUsername}
                className="h-full object-contain filter drop-shadow-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-purple-400 font-mono uppercase font-bold tracking-wider">
                Active In-Game Skin
              </div>
              <h3 className="text-lg font-bold text-white font-mono">{queryUsername}</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Connected with Mojang skin archives. Any cosmetic purchases (ranks, particles, and keys) are automatically routed to this character when on the server.
              </p>
            </div>
          </div>

          <Link
            to="/store"
            className="px-4 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 transition-all flex-shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-purple-400" />
            <span>Visit Server Store</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Order History for this player */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Purchase & Delivery History</span>
            </h2>
            <Link
              to="/store"
              className="text-xs font-semibold text-purple-400 hover:text-white"
            >
              Browse Store Packages
            </Link>
          </div>

          {playerOrders.length === 0 ? (
            <div className="p-8 rounded-sm border border-white/10 bg-black/20 text-center text-xs text-slate-400 space-y-2">
              <p>No recent purchases recorded for {queryUsername}.</p>
              <p className="text-[11px] text-slate-500">
                Purchases made in the store using this Minecraft username or your account email will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {playerOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-sm border border-white/10 bg-black/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-purple-500/30"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{ord.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase font-bold border ${
                          ord.status === 'DELIVERED' || ord.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : ord.status === 'PENDING' || ord.status === 'PAYMENT_SUBMITTED' || ord.status === 'VERIFYING'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-purple-950 text-purple-300 border-purple-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Submitted on {new Date(ord.createdAt).toLocaleDateString()} via {ord.paymentMethod.toUpperCase()} (Ref: {ord.transactionRef})
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                    <span className="text-base font-bold text-white font-mono">
                      ৳{ord.finalTotal} BDT
                    </span>
                    <Link
                      to={`/order-confirmation/${ord.id}`}
                      className="text-xs text-purple-400 hover:text-white mt-1 inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Receipt Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
