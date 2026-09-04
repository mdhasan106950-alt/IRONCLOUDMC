import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Coupon } from '../../types';
import {
  TicketPercent,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Tag,
  AlertCircle,
  FlaskConical,
} from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New coupon form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [maxUses, setMaxUses] = useState<number | ''>('');
  const [category, setCategory] = useState<'all' | 'ranks' | 'coins' | 'keys' | 'bundle'>('all');
  const [formError, setFormError] = useState<string | null>(null);

  // Live tester state
  const [testCode, setTestCode] = useState('');
  const [testAmount, setTestAmount] = useState(500);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const { data: coupons, isLoading } = useQuery<Coupon[]>({
    queryKey: ['adminCoupons'],
    queryFn: () => api.getCoupons(),
  });

  const createMutation = useMutation({
    mutationFn: (newCoupon: Partial<Coupon>) => api.createCoupon(newCoupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      setShowCreateModal(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to create coupon.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Coupon> }) =>
      api.updateCoupon(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
    },
  });

  const resetForm = () => {
    setCode('');
    setName('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrderAmount(0);
    setMaxUses('');
    setCategory('all');
    setFormError(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!code.trim()) {
      setFormError('Coupon code is required.');
      return;
    }
    if (discountValue <= 0) {
      setFormError('Discount value must be greater than 0.');
      return;
    }

    createMutation.mutate({
      code: code.trim().toUpperCase(),
      name: name.trim() || `${code.trim().toUpperCase()} Discount`,
      description: description.trim() || `Saves ${discountValue}${discountType === 'percentage' ? '%' : ' BDT'} on purchases`,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      totalUsageLimit: maxUses === '' ? null : Number(maxUses),
      isActive: true,
      applicableCategories: category === 'all' ? [] : [category],
    });
  };

  const handleTestCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCode.trim()) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      // simulate test with mock item
      const res = await api.validateCoupon(testCode.trim().toUpperCase(), [
        {
          productId: 'prod-rank-king',
          quantity: 1,
        },
      ]);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ valid: false, message: err.message || 'Validation failed' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>PROMOTIONAL ENGINE</span>
            <span>•</span>
            <span className="text-[#38b000]">BACKEND AUTHORITATIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Coupons & Promo Codes
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create and manage promotional discount codes. All changes take effect across the entire webstore immediately without frontend redeployment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-purple-950/60"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Live Coupon Tester Tool Card */}
      <div className="rounded-2xl border border-purple-950/60 bg-gradient-to-r from-purple-950/20 via-zinc-950 to-zinc-950 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <FlaskConical className="w-4 h-4 text-purple-400" />
          <span>Live Coupon Validation Simulator</span>
        </div>
        <p className="text-xs text-zinc-400 max-w-2xl">
          Instantly test if any existing or freshly created coupon evaluates accurately against backend validation rules without placing a real order.
        </p>

        <form onSubmit={handleTestCoupon} className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value.toUpperCase())}
            placeholder="Enter Code (e.g. WELCOME10)"
            className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#7b2cbf] w-52"
          />

          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Order Value: ৳</span>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(Number(e.target.value))}
              className="w-24 px-2 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isTesting || !testCode.trim()}
            className="px-4 py-2 rounded-lg bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isTesting ? 'Validating...' : 'Test Backend Calculation'}
          </button>
        </form>

        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              testResult.valid
                ? 'bg-[#38b000]/10 border-[#38b000]/30 text-[#38b000]'
                : 'bg-red-950/20 border-red-800/40 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {testResult.valid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{testResult.message}</span>
            </div>
            {testResult.valid && (
              <div className="font-mono font-bold text-white">
                Discount: -৳{testResult.discount} BDT (Final: ৳{testResult.finalTotal} BDT)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Active & Configured Coupons ({coupons?.length || 0})</h2>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-zinc-400 font-mono">
            Loading coupon registry...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="pb-2.5">Code & Name</th>
                  <th className="pb-2.5">Discount</th>
                  <th className="pb-2.5">Min Order</th>
                  <th className="pb-2.5">Uses / Max</th>
                  <th className="pb-2.5">Applies To</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {coupons?.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-900/40">
                    <td className="py-3.5">
                      <div className="font-mono font-bold text-[#38b000] text-sm">{c.code}</div>
                      <div className="text-[11px] text-zinc-400">{c.name}</div>
                    </td>
                    <td className="py-3.5 font-mono font-semibold text-white">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue} BDT`}
                    </td>
                    <td className="py-3.5 font-mono text-zinc-300">
                      {c.minOrderAmount ? `৳${c.minOrderAmount}` : 'None'}
                    </td>
                    <td className="py-3.5 font-mono text-zinc-300">
                      {c.timesUsed} / {c.totalUsageLimit ?? '∞'}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-900 text-purple-300 border border-zinc-800">
                        {c.applicableCategories && c.applicableCategories.length > 0
                          ? c.applicableCategories.join(', ')
                          : 'All Packages'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateMutation.mutate({
                            id: c.id,
                            updates: { isActive: !c.isActive },
                          })
                        }
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-colors ${
                          c.isActive
                            ? 'bg-[#38b000]/20 text-[#38b000] border border-[#38b000]/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-[#38b000]/20 hover:text-[#38b000]'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete coupon ${c.code}?`)) {
                            deleteMutation.mutate(c.id);
                          }
                        }}
                        className="p-1.5 rounded text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TicketPercent className="w-5 h-5 text-purple-400" />
                <span>Create New Coupon Code</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FLASH20"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Coupon Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Weekend Flash Sale"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳ BDT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Value ({discountType === 'percentage' ? '%' : '৳ BDT'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Min Order Total (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Max Uses (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Leave blank for unlimited"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Category Restriction</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                >
                  <option value="all">All Store Categories</option>
                  <option value="ranks">Ranks Only</option>
                  <option value="coins">Coins Only</option>
                  <option value="keys">Crate Keys Only</option>
                  <option value="bundle">Bundles Only</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-lg bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {createMutation.isPending ? 'Publishing...' : 'Publish Live Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
