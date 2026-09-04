import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  TicketPercent,
  ShoppingBag,
  Package,
  ShieldAlert,
  FileEdit,
  ArrowLeft,
  LogOut,
  Shield,
  Server,
  Lock,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, demoStaffLogin } = useAuth();
  const navigate = useNavigate();

  const isAuthorized = Boolean(
    user && (user.role === 'OWNER' || user.role === 'ADMIN' || (user.role as string).toLowerCase() === 'admin')
  );

  // If user is not admin, provide convenient staff unlock button and credentials
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080310] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl border border-zinc-800 bg-zinc-950/90 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center mx-auto text-purple-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Staff Authentication Required</h2>
            <p className="text-xs text-zinc-400 leading-relaxed mt-1">
              The Admin Panel controls live coupons, store orders, player incident reports, and announcement settings.
            </p>
          </div>

          {/* Temporary Admin Credentials Box */}
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-left space-y-1.5 text-xs font-mono">
            <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Temporary Admin Credentials</div>
            <div className="text-slate-300 flex items-center justify-between">
              <span>Email:</span>
              <span className="text-white font-semibold">admin@ironcloudmc.fun</span>
            </div>
            <div className="text-slate-300 flex items-center justify-between">
              <span>Password:</span>
              <span className="text-emerald-400 font-semibold">Admin@IronCloud2026</span>
            </div>
          </div>

          <div className="pt-1 space-y-2.5">
            <button
              type="button"
              onClick={() => demoStaffLogin()}
              className="w-full py-3 px-4 rounded-xl bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-purple-950/50"
            >
              Quick Sign In as Staff Administrator
            </button>
            <div className="flex items-center justify-center gap-4 pt-1 text-xs">
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Go to Login Page
              </Link>
              <span className="text-zinc-600">•</span>
              <Link
                to="/"
                className="text-zinc-500 hover:text-white"
              >
                Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { to: '/admin/coupons', label: 'Coupons & Promos', icon: <TicketPercent className="w-4 h-4" /> },
    { to: '/admin/orders', label: 'Customer Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { to: '/admin/products', label: 'Store Catalog', icon: <Package className="w-4 h-4" /> },
    { to: '/admin/reports', label: 'Player Reports', icon: <ShieldAlert className="w-4 h-4" /> },
    { to: '/admin/cms', label: 'CMS & Announcements', icon: <FileEdit className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#06020d] text-zinc-200 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-950/90 border-b md:border-b-0 md:border-r border-zinc-800/90 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Iron Cloud MC"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight font-mono">
                  IRON CLOUD MC
                </div>
                <div className="text-[10px] text-purple-400 font-mono">ADMIN CONTROL</div>
              </div>
            </div>
            <Link
              to="/"
              className="p-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#7b2cbf] text-white shadow-md shadow-purple-950/60'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-900/60 flex items-center justify-center text-xs font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="truncate max-w-[110px]">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-emerald-400 font-mono">Staff Online</div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
