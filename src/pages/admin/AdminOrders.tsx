import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  User,
  CreditCard,
  Search,
  Filter,
  ExternalLink,
  Loader2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['adminOrders'],
    queryFn: () => api.getOrders(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus, adminNote }: { orderId: string; newStatus: OrderStatus; adminNote?: string }) =>
      api.updateOrderStatus(orderId, newStatus, adminNote),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      setActionSuccessMessage(`Order #${updated.id} status successfully updated to ${updated.status}!`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
      setPendingOrderId(null);
    },
    onError: (err: any) => {
      alert(`Failed to update order: ${err?.message || 'Unknown error'}`);
      setPendingOrderId(null);
    },
  });

  const confirmOrderMutation = useMutation({
    mutationFn: ({ orderId, adminNote }: { orderId: string; adminNote?: string }) =>
      api.confirmOrder(orderId, adminNote),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      setActionSuccessMessage(`Order #${updated.id} confirmed and marked as DELIVERED!`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
      setPendingOrderId(null);
    },
    onError: (err: any) => {
      alert(`Failed to confirm order: ${err?.message || 'Unknown error'}`);
      setPendingOrderId(null);
    },
  });

  const handleQuickConfirm = (orderId: string, username: string) => {
    setPendingOrderId(orderId);
    confirmOrderMutation.mutate({
      orderId,
      adminNote: `Payment verified by staff. Rank/package granted in-game to ${username}.`,
    });
  };

  const handleQuickStatus = (orderId: string, newStatus: OrderStatus) => {
    setPendingOrderId(orderId);
    updateStatusMutation.mutate({
      orderId,
      newStatus,
    });
  };

  const filteredOrders = orders?.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.minecraft.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.senderNumber.includes(searchQuery);

    return matchesStatus && matchesSearch;
  }) || [];

  const statuses: { id: string; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'PAYMENT_SUBMITTED', label: 'Payment Submitted' },
    { id: 'VERIFYING', label: 'Verifying' },
    { id: 'PAID', label: 'Paid' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            DELIVERED
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            PAID
          </span>
        );
      case 'VERIFYING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            VERIFYING
          </span>
        );
      case 'PAYMENT_SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold animate-pulse">
            <CreditCard className="w-3 h-3" />
            PAYMENT SUBMITTED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-[11px] font-bold">
            <XCircle className="w-3 h-3" />
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Order Auditing & Fulfillment
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Audit bKash and Nagad payment submissions, click <span className="text-emerald-400 font-semibold">Confirm Order</span> to deliver ranks instantly, or adjust status as needed.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between gap-3 text-emerald-200 text-xs font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-400 hover:text-white font-mono text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {statuses.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s.id
                  ? 'bg-[#7b2cbf] text-white shadow-[0_0_12px_rgba(123,44,191,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TrxID, IGN, Email..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#7b2cbf]"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-zinc-400 font-mono flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#7b2cbf]" />
            <span>Loading order records from server...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-zinc-950/40 rounded-2xl border border-zinc-800 text-xs text-zinc-400 space-y-2">
            <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="font-semibold text-zinc-300">No orders found matching your criteria.</p>
            <p className="text-zinc-500">Switch status filters or search terms above.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isDelivered = order.status === 'DELIVERED';
            const isProcessingThisOrder =
              (confirmOrderMutation.isPending || updateStatusMutation.isPending) &&
              pendingOrderId === order.id;

            return (
              <div
                key={order.id}
                className={`rounded-2xl border bg-zinc-950/90 p-6 space-y-5 transition-all ${
                  isDelivered
                    ? 'border-zinc-800/80 hover:border-zinc-700'
                    : 'border-[#7b2cbf]/30 shadow-[0_0_20px_rgba(123,44,191,0.06)] hover:border-[#7b2cbf]/60'
                }`}
              >
                {/* Header Row: Order ID, Date, Status, Quick Confirmation Button */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-white text-base tracking-tight">
                      {order.id}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Primary Order Actions & Confirmation Button */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* The Primary Order Confirmation Button */}
                    {!isDelivered ? (
                      <button
                        type="button"
                        id={`confirm-order-btn-${order.id}`}
                        disabled={isProcessingThisOrder}
                        onClick={() => handleQuickConfirm(order.id, order.minecraft.username)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xs shadow-[0_0_16px_rgba(16,185,129,0.35)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                      >
                        {isProcessingThisOrder ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Confirming & Delivering...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Order</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs font-mono font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fulfilled</span>
                      </div>
                    )}

                    {/* Secondary Status Dropdown for granular override */}
                    <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/80 rounded-xl px-2.5 py-1">
                      <span className="text-[11px] text-zinc-400">Set:</span>
                      <select
                        value={order.status}
                        disabled={isProcessingThisOrder}
                        onChange={(e) =>
                          handleQuickStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
                      >
                        <option value="PAYMENT_SUBMITTED" className="bg-zinc-900">PAYMENT_SUBMITTED</option>
                        <option value="VERIFYING" className="bg-zinc-900">VERIFYING</option>
                        <option value="PAID" className="bg-zinc-900">PAID</option>
                        <option value="DELIVERED" className="bg-zinc-900">DELIVERED</option>
                        <option value="CANCELLED" className="bg-zinc-900">CANCELLED</option>
                      </select>
                    </div>

                    {/* View Customer Receipt Link */}
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono transition-colors"
                      title="View public order confirmation receipt"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                    </Link>
                  </div>
                </div>

                {/* Order Columns: Minecraft/Customer, Payment/TrxID, Items/Totals */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Minecraft & Buyer */}
                  <div className="space-y-1.5 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/60">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                      Minecraft & Customer Info
                    </div>
                    <div className="font-mono font-bold text-[#38b000] text-sm">
                      IGN: {order.minecraft.username}
                      <span className="ml-1.5 text-[11px] font-normal text-zinc-400">
                        ({order.minecraft.edition} Edition)
                      </span>
                    </div>
                    <div className="text-zinc-200 font-medium">{order.buyer.name}</div>
                    <div className="text-zinc-400 font-mono text-[11px]">{order.buyer.email}</div>
                    <div className="text-zinc-400 font-mono text-[11px]">Phone: {order.buyer.phone}</div>
                    {order.buyer.discord && (
                      <div className="text-indigo-400 text-[11px]">Discord: {order.buyer.discord}</div>
                    )}
                  </div>

                  {/* Gateway & Payment */}
                  <div className="space-y-1.5 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/60 font-mono">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold font-sans">
                      Payment Gateway & Verification
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.paymentMethod === 'bkash'
                          ? 'bg-[#e2136e]/20 text-[#e2136e] border border-[#e2136e]/30'
                          : 'bg-[#f7941d]/20 text-[#f7941d] border border-[#f7941d]/30'
                      }`}>
                        {order.paymentMethod}
                      </span>
                      <span className="text-zinc-300 text-xs">Sender: {order.senderNumber}</span>
                    </div>
                    <div className="text-emerald-400 font-bold text-xs bg-emerald-950/40 p-2 rounded border border-emerald-800/50">
                      TrxID: <span className="text-white select-all">{order.transactionRef}</span>
                    </div>
                    {order.customerNote && (
                      <div className="text-[11px] text-amber-400 font-sans italic">
                        "{order.customerNote}"
                      </div>
                    )}
                    {order.adminNote && (
                      <div className="text-[11px] text-zinc-400 font-sans border-t border-zinc-800/80 pt-1">
                        Staff Note: {order.adminNote}
                      </div>
                    )}
                  </div>

                  {/* Items & Total */}
                  <div className="space-y-1.5 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800/60">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                      Items & Payable Total
                    </div>
                    <div className="space-y-1 text-zinc-200">
                      {order.items.map((i) => (
                        <div key={i.productId} className="flex justify-between items-center text-xs">
                          <span>{i.quantity}x {i.name}</span>
                          <span className="font-mono text-zinc-400">৳{i.price}</span>
                        </div>
                      ))}
                    </div>
                    {order.couponCode && (
                      <div className="flex justify-between items-center text-[11px] text-[#38b000] border-t border-zinc-800 pt-1">
                        <span>Coupon ({order.couponCode})</span>
                        <span className="font-mono">-৳{order.couponDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-mono font-bold text-white border-t border-zinc-800 pt-1.5">
                      <span>Total:</span>
                      <span className="text-emerald-400">৳{order.finalTotal} BDT</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
