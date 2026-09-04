import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { PlayerReport } from '../../types';
import { ShieldAlert, ExternalLink, Trash2 } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery<PlayerReport[]>({
    queryKey: ['adminReports'],
    queryFn: () => api.getReports(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      api.updateReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Player Incident Reports
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review community reports regarding hack clients, exploitation, or toxicity.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-zinc-400 font-mono">
            Loading incident logs...
          </div>
        ) : reports?.length === 0 ? (
          <div className="p-12 text-center bg-zinc-950/40 rounded-2xl border border-zinc-800 text-xs text-zinc-400">
            No incident reports registered.
          </div>
        ) : (
          reports?.map((rep) => (
            <div
              key={rep.id}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-red-400 text-sm">{rep.id}</span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(rep.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Status:</span>
                  <select
                    value={rep.status}
                    onChange={(e) =>
                      updateMutation.mutate({ id: rep.id, status: e.target.value })
                    }
                    className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-white focus:outline-none"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="DISMISSED">DISMISSED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Target Player</div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">
                    {rep.reportedPlayer}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Violation</div>
                  <div className="font-bold text-amber-400 mt-0.5">{rep.category}</div>
                  {rep.evidenceUrl && (
                    <a
                      href={rep.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-400 hover:text-white mt-1"
                    >
                      <span>Open Evidence</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Reporter</div>
                  <div className="text-zinc-300 mt-0.5">{rep.reporterUsername || 'Anonymous'}</div>
                  <div className="text-zinc-400">{rep.reporterEmail || 'No email provided'}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 text-xs text-zinc-300">
                <span className="font-semibold text-zinc-400 block mb-1">Details:</span>
                {rep.description}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
