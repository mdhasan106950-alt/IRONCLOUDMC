import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Order, Coupon, PlayerReport } from '../../types';
import {
  ShoppingBag,
  TicketPercent,
  ShieldAlert,
  Users,
  Server,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const { data: status } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: api.getServerStatus,
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ['adminOrders'],
    queryFn: () => api.getOrders(),
  });

  const { data: coupons } = useQuery<Coupon[]>({
    queryKey: ['adminCoupons'],
    queryFn: () => api.getCoupons(),
  });

  const { data: reports } = useQuery<PlayerReport[]>({
    queryKey: ['adminReports'],
    queryFn: () => api.getReports(),
  });

  const updateOrderStatus = useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      api.confirmOrder(orderId, 'Confirmed & delivered via Admin Command Center.'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      setPendingOrderId(null);
    },
    onError: (err: any) => {
      alert(`Failed to confirm order: ${err?.message || 'Unknown error'}`);
      setPendingOrderId(null);
    },
  });

  const totalRevenue = orders?.reduce((sum, o) => sum + (o.finalTotal || 0), 0) || 0;
  const activeCouponsCount = coupons?.filter((c) => c.isActive).length || 0;
  const pendingReportsCount = reports?.filter((r) => r.status === 'OPEN' || (r.status as string) === 'PENDING').length || 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Network Command Center
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Real-time metrics, payment audits, server telemetry, and player governance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Store Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ৳{totalRevenue} <span className="text-xs text-emerald-400 font-normal">BDT</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            Across {orders?.length || 0} customer orders
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Live Server Players</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span>{status?.players.online || 0}</span>
            <span className="text-xs text-zinc-400 font-normal">/ {status?.players.max || 100}</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status?.online ? 'bg-[#38b000]' : 'bg-red-500'}`} />
            <span>{status?.online ? 'Network Online' : 'Network Offline'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Active Promotion Codes</span>
            <TicketPercent className="w-4 h-4 text-[#9d4edd]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {activeCouponsCount}
          </div>
          <div className="text-[11px] text-purple-300 font-mono">
            <Link to="/admin/coupons" className="hover:underline">
              Manage coupons & discounts &rarr;
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pending Incident Reports</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {pendingReportsCount}
          </div>
          <div className="text-[11px] text-amber-400 font-mono">
            <Link to="/admin/reports" className="hover:underline">
              Review player violations &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Recent Store Orders</h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-[#9d4edd] hover:text-white flex items-center gap-1"
          >
            <span>View all orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
              <tr>
                <th className="pb-2.5">Order ID</th>
                <th className="pb-2.5">Player IGN</th>
                <th className="pb-2.5">Items</th>
                <th className="pb-2.5">Gateway & TrxID</th>
                <th className="pb-2.5">Total</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {orders?.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-900/40">
                  <td className="py-3 font-mono font-bold text-white">{ord.id}</td>
                  <td className="py-3">
                    <span className="font-mono text-[#38b000]">{ord.minecraft.username}</span>
                    <span className="text-[10px] text-zinc-400 block">{ord.minecraft.edition}</span>
                  </td>
                  <td className="py-3 text-zinc-300">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3 font-mono">
                    <span className="uppercase text-purple-300 font-semibold">{ord.paymentMethod}</span>
                    <span className="text-[10px] text-zinc-400 block font-mono">{ord.transactionRef}</span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">
                    ৳{ord.finalTotal}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        ord.status === 'DELIVERED' || ord.status === 'PAID'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {ord.status !== 'DELIVERED' ? (
                        <button
                          type="button"
                          id={`dashboard-confirm-${ord.id}`}
                          disabled={updateOrderStatus.isPending && pendingOrderId === ord.id}
                          onClick={() => {
                            setPendingOrderId(ord.id);
                            updateOrderStatus.mutate({ orderId: ord.id });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
                        >
                          {updateOrderStatus.isPending && pendingOrderId === ord.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Confirming...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Confirm Order</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[11px] font-mono font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Fulfilled</span>
                        </span>
                      )}

                      <Link
                        to={`/order-confirmation/${ord.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                        title="View order receipt"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
