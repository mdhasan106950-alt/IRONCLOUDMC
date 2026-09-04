import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Gamepad2,
  Lock,
  Mail,
  Key,
  ArrowRight,
  UserCheck,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    isAdmin,
    loginWithCredentials,
    loginWithGoogle,
    demoStaffLogin,
    updateMinecraftAccount,
    logout,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Character linking state for authenticated users
  const [ign, setIgn] = useState(user?.minecraftUsername || '');
  const [edition, setEdition] = useState<'Java' | 'Bedrock'>(
    user?.minecraftEdition || 'Java'
  );
  const [isLinking, setIsLinking] = useState(false);

  // Redirect target
  const from = (location.state as any)?.from?.pathname || (isAdmin ? '/admin' : '/profile');

  // Handle Credentials Login
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await loginWithCredentials(email.trim(), password);
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill temporary admin credentials
  const fillAdminCredentials = () => {
    setEmail('admin@ironcloudmc.fun');
    setPassword('Admin@IronCloud2026');
    setErrorMsg(null);
  };

  const handleStaffQuickLogin = () => {
    demoStaffLogin();
    navigate('/admin', { replace: true });
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      setErrorMsg('Google sign in encountered an issue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMinecraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ign.trim()) return;
    setIsLinking(true);
    try {
      await updateMinecraftAccount(ign.trim(), edition);
      setSuccessMsg('Minecraft character linked successfully!');
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 800);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center relative">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 flex items-center justify-center mx-auto">
            <img
              src="/logo.png"
              alt="Iron Cloud MC"
              className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(168,85,247,0.4)]"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Iron Cloud Account Portal
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to manage your profile, customize your avatar, view orders, and access staff tools.
          </p>
        </div>

        {/* Temporary Admin Credentials Callout */}
        <div className="rounded-sm border border-purple-500/30 bg-purple-950/20 backdrop-blur-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Temporary Admin Login</span>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Auto-Fill Form
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1 text-[11px] font-mono bg-black/40 p-2.5 rounded-sm border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="text-white font-semibold selection:bg-purple-600">admin@ironcloudmc.fun</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Password:</span>
              <span className="text-emerald-400 font-semibold selection:bg-purple-600">Admin@IronCloud2026</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            *Also accepts your Gmail <code className="text-slate-200">piratessmp2@gmail.com</code> with password <code className="text-emerald-400">Admin@IronCloud2026</code>.
          </p>
        </div>

        {/* Main Portal Container */}
        <div className="rounded-sm border border-white/10 bg-black/40 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl">
          {user ? (
            /* Logged In State: Account Hub & Character Link */
            <div className="space-y-5">
              <div className="p-4 rounded-sm bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-sm bg-purple-900/50 border border-purple-500/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {user.picture || user.avatarUrl ? (
                      <img
                        src={user.picture || user.avatarUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-purple-300" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{user.name}</span>
                      <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono uppercase bg-purple-600 text-white font-bold">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-2 rounded-sm text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all text-center"
                >
                  <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span>My Profile</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold uppercase tracking-wider text-amber-300 transition-all text-center"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </div>

              {/* Link Minecraft Character Form */}
              <form onSubmit={handleSaveMinecraft} className="space-y-4 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Link Minecraft In-Game Name (IGN)
                  </label>
                  <input
                    type="text"
                    required
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    placeholder="e.g. MR_DOOM_YT"
                    className="w-full px-3 py-2 rounded-sm bg-black/50 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Used to deliver ranks, keys, and coins purchased on the webstore.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Minecraft Edition
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEdition('Java')}
                      className={`py-2 px-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        edition === 'Java'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      Java Edition
                    </button>
                    <button
                      type="button"
                      onClick={() => setEdition('Bedrock')}
                      className={`py-2 px-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        edition === 'Bedrock'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      Bedrock Edition
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLinking}
                  className="w-full py-2.5 rounded-sm bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>{isLinking ? 'Linking...' : 'Update Linked Character'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* Not Logged In State: Email & Password Login */
            <div className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-sm bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ironcloudmc.fun"
                      className="w-full pl-9 pr-3 py-2 rounded-sm bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={fillAdminCredentials}
                      className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold"
                    >
                      Use Admin Password
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-sm bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-sm bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-950/50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoading ? 'Signing In...' : 'Sign In with Email'}</span>
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-slate-500">
                  Alternative Access
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* 1-Click Quick Staff Administrator Access */}
              <button
                type="button"
                onClick={handleStaffQuickLogin}
                className="w-full py-2.5 px-4 rounded-sm bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>1-Click Admin Access (Instant)</span>
              </button>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
