import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Users, Wifi, WifiOff } from 'lucide-react';

interface ServerStatusBadgeProps {
  className?: string;
  showDetails?: boolean;
}

export const ServerStatusBadge: React.FC<ServerStatusBadgeProps> = ({
  className = '',
  showDetails = true,
}) => {
  const { data: status, isLoading, isError } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: api.getServerStatus,
    refetchInterval: 30000, // refresh every 30s
    staleTime: 15000,
  });

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-slate-400 ${className}`}>
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Pinging Network...</span>
      </div>
    );
  }

  const isOnline = status?.online ?? false;
  const onlinePlayers = status?.players?.online ?? 0;

  return (
    <div
      id="live-server-status-badge"
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md border transition-all ${
        isOnline
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-zinc-900/60 border-white/10 text-slate-400'
      } ${className}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'
        }`}
      />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {isOnline
          ? `${onlinePlayers > 0 ? `${onlinePlayers.toLocaleString()} Players Online` : 'Server Online'}`
          : 'Server Offline'}
      </span>
    </div>
  );
};
