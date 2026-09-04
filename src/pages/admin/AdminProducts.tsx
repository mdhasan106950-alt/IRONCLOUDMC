import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Product, ProductType } from '../../types';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductType>('ranks');
  const [price, setPrice] = useState(100);
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => api.getProducts(),
  });

  const createMutation = useMutation({
    mutationFn: (newProd: Partial<Product>) => api.createProduct(newProd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setShowModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });

  const resetForm = () => {
    setName('');
    setCategory('ranks');
    setPrice(100);
    setOriginalPrice('');
    setBadge('');
    setDescription('');
    setFeaturesText('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      price: Number(price),
      originalPrice: originalPrice === '' ? undefined : Number(originalPrice),
      badge: badge.trim() || undefined,
      description: description.trim(),
      features: featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      isFeatured: true,
      isAvailable: true,
      currency: 'BDT',
      displayOrder: 0,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Store Catalog Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure ranks, coin packs, crate keys, and promotional bundles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-zinc-400 font-mono">
            Loading products...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="pb-2.5">Package</th>
                  <th className="pb-2.5">Category</th>
                  <th className="pb-2.5">Price (BDT)</th>
                  <th className="pb-2.5">Badge</th>
                  <th className="pb-2.5">Perks Count</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {products?.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/40">
                    <td className="py-3">
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-xs">{p.description}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-950 text-purple-300 border border-purple-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-white">
                      ৳{p.price}
                      {p.originalPrice && (
                        <span className="text-[10px] text-zinc-500 line-through ml-1.5 font-normal">
                          ৳{p.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {p.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-[#7b2cbf] text-white">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="py-3 text-zinc-300 font-mono">
                      {p.features.length} perks
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete package ${p.name}?`)) {
                            deleteMutation.mutate(p.id);
                          }
                        }}
                        className="p-1.5 rounded text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete product"
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

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                <span>Add Store Package</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Emperor Rank"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  >
                    <option value="ranks">Server Rank</option>
                    <option value="coins">Coins Pack</option>
                    <option value="keys">Crate Keys</option>
                    <option value="bundle">Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. POPULAR, BEST VALUE"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Original Price (Strike)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) =>
                      setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="e.g. 200"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Short Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of perks..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Features / Perks (One per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Prefix in chat & tab&#10;/fly permission in Survival&#10;5x Sethomes"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-lg bg-[#7b2cbf] hover:bg-[#9d4edd] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
