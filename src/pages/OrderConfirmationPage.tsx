import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Copy,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Printer,
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.getOrderById(id!),
    enabled: Boolean(id),
    refetchInterval: 10000, // auto check status updates
  });

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7b2cbf', '#38b000', '#9d4edd', '#ffd700'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080310] py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-zinc-400 font-mono">Retrieving order confirmation...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#080310] py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">Could not find an order matching identifier {id}.</p>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7b2cbf] text-white text-xs font-semibold"
        >
          <span>Return to Store</span>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
      case 'PAID':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered & Active</span>
          </span>
        );
      case 'PAYMENT_SUBMITTED':
      case 'VERIFYING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Payment Submitted (Verifying)</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono bg-zinc-800 text-zinc-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#38b000]/20 border border-[#38b000]/40 flex items-center justify-center mx-auto mb-4 text-[#38b000]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-zinc-300 mt-2 max-w-lg mx-auto">
            Your payment submission has been received. Our automated dispatch system is verifying your transaction details.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {getStatusBadge(order.status)}
            <span className="text-xs font-mono text-zinc-400">
              Order ID: <strong className="text-white font-mono">{order.id}</strong>
            </span>
          </div>
        </div>

        {/* Order Receipt Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
            <div>
              <div className="text-zinc-400 uppercase font-mono text-[10px]">Order Date</div>
              <div className="font-semibold text-white mt-0.5">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-zinc-400 uppercase font-mono text-[10px]">Minecraft Player</div>
              <div className="font-semibold text-[#38b000] font-mono mt-0.5">
                {order.minecraft.username} ({order.minecraft.edition})
              </div>
            </div>
            <div>
              <div className="text-zinc-400 uppercase font-mono text-[10px]">Payment Method</div>
              <div className="font-semibold text-white mt-0.5 uppercase">
                {order.paymentMethod} ({order.senderNumber})
              </div>
            </div>
            <div>
              <div className="text-zinc-400 uppercase font-mono text-[10px]">Transaction ID</div>
              <div className="font-semibold text-purple-300 font-mono mt-0.5">
                {order.transactionRef}
              </div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
              Purchased Items
            </h3>
            <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs bg-zinc-900/40">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-purple-400">{item.category}</span>
                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                    <div className="text-zinc-400 mt-0.5 font-mono">
                      Quantity: {item.quantity} × ৳{item.price}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-white font-mono">
                      ৳{item.subtotal} BDT
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations Summary */}
          <div className="border-t border-zinc-900 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">৳{order.subtotal} BDT</span>
            </div>

            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-[#38b000]">
                <span>Coupon Applied ({order.couponCode})</span>
                <span className="font-mono font-bold">-৳{order.couponDiscount} BDT</span>
              </div>
            )}

            <div className="border-t border-zinc-900 pt-3 flex justify-between items-baseline text-white">
              <span className="font-bold text-sm">Amount Paid</span>
              <span className="text-2xl font-bold font-mono text-white">
                ৳{order.finalTotal} <span className="text-xs text-emerald-400 font-normal">BDT</span>
              </span>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-800/30 space-y-3 text-xs text-zinc-300">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>How to Receive Your In-Game Items</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-zinc-300 text-[11px]">
              <li>Launch Minecraft and connect to <strong className="text-white font-mono">play.ironcloudmc.fun</strong> with username <strong className="text-[#38b000] font-mono">{order.minecraft.username}</strong>.</li>
              <li>Wait 1-5 minutes for payment verification to complete.</li>
              <li>Your rank tag and perks will be automatically applied to your character in tab & chat.</li>
              <li>For keys or coins, claim them with <strong className="text-purple-300 font-mono">/crates</strong> or <strong className="text-purple-300 font-mono">/balance</strong>.</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>

            <div className="flex items-center gap-3">
              <Link
                to="/store"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-colors"
              >
                <span>Store Catalog</span>
              </Link>
              <Link
                to="/profile/orders"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-semibold transition-colors"
              >
                <span>Track in Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
