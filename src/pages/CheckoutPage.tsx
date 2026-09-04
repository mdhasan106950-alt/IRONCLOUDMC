import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { PlayerLookupResponse } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Gamepad2,
  Tag,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, finalTotal, couponCode, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerDiscord, setBuyerDiscord] = useState('');

  const [minecraftUsername, setMinecraftUsername] = useState(
    user?.minecraftUsername || ''
  );
  const [minecraftEdition, setMinecraftEdition] = useState<'Java' | 'Bedrock'>(
    user?.minecraftEdition || 'Java'
  );
  const [playerData, setPlayerData] = useState<PlayerLookupResponse | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const officialNumber = '01821925430';

  // Player lookup debounce
  useEffect(() => {
    if (!minecraftUsername.trim() || minecraftUsername.length < 3) {
      setPlayerData(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLookingUp(true);
      try {
        const data = await api.lookupPlayer(minecraftUsername);
        setPlayerData(data);
      } catch {
        setPlayerData(null);
      } finally {
        setIsLookingUp(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [minecraftUsername]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#080310] py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Cart is empty</h2>
        <p className="text-sm text-zinc-400 mb-6">Please add products before checking out.</p>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7b2cbf] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Store</span>
        </Link>
      </div>
    );
  }

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(officialNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!buyerName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!buyerEmail.trim() || !buyerEmail.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!buyerPhone.trim()) {
      setSubmitError('Please enter your phone number.');
      return;
    }
    if (!minecraftUsername.trim()) {
      setSubmitError('Please enter your Minecraft username.');
      return;
    }
    if (!senderNumber.trim()) {
      setSubmitError('Please enter the phone number you sent the payment from.');
      return;
    }
    if (!transactionRef.trim()) {
      setSubmitError('Please enter your bKash/Nagad Transaction ID (TrxID).');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        buyer: {
          name: buyerName.trim(),
          email: buyerEmail.trim(),
          phone: buyerPhone.trim(),
          discord: buyerDiscord.trim() || undefined,
        },
        minecraft: {
          username: minecraftUsername.trim(),
          uuid: playerData?.uuid || '',
          edition: minecraftEdition,
          verified: Boolean(playerData?.verified),
        },
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        couponCode: couponCode || null,
        paymentMethod,
        senderNumber: senderNumber.trim(),
        transactionRef: transactionRef.trim(),
        customerNote: customerNote.trim() || undefined,
      };

      const order = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit order. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080310] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <span>CHECKOUT STEP</span>
            <span>•</span>
            <span className="text-[#38b000]">SECURE TRANSACTIONS</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Complete Your Purchase</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review package delivery details, verify your Minecraft identity, and complete payment.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Buyer Information */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono tracking-wider">
                <User className="w-4 h-4 text-purple-400" />
                <span>1. Contact & Customer Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Hasan Mahmud"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Discord Tag (Optional)</label>
                  <input
                    type="text"
                    value={buyerDiscord}
                    onChange={(e) => setBuyerDiscord(e.target.value)}
                    placeholder="username#0000 or username"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Minecraft Account Details */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono tracking-wider">
                <Gamepad2 className="w-4 h-4 text-[#38b000]" />
                <span>2. In-Game Minecraft Account</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Minecraft Username *</label>
                  <input
                    type="text"
                    required
                    value={minecraftUsername}
                    onChange={(e) => setMinecraftUsername(e.target.value)}
                    placeholder="Exact In-Game Name"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Game Edition</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMinecraftEdition('Java')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                        minecraftEdition === 'Java'
                          ? 'bg-[#7b2cbf] text-white'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      Java Edition
                    </button>
                    <button
                      type="button"
                      onClick={() => setMinecraftEdition('Bedrock')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                        minecraftEdition === 'Bedrock'
                          ? 'bg-[#7b2cbf] text-white'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}
                    >
                      Bedrock Edition
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Mojang Avatar and Account Confirmation Card */}
              {minecraftUsername.trim().length >= 3 && (
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black border border-zinc-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {isLookingUp ? (
                        <div className="w-4 h-4 border border-purple-400 border-t-transparent animate-spin" />
                      ) : playerData?.helmUrl ? (
                        <img
                          src={playerData.helmUrl}
                          alt={playerData.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Gamepad2 className="w-5 h-5 text-zinc-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                        <span>{playerData?.username || minecraftUsername}</span>
                        {playerData?.verified && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[10px] font-sans font-semibold border border-emerald-800">
                            Verified Java Account
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-xs">
                        {playerData?.uuid ? `UUID: ${playerData.uuid}` : 'Ready for delivery'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#38b000] font-semibold">
                      Account Linked
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Payment Method & Instructions */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase font-mono tracking-wider">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>3. Payment Gateway (bKash & Nagad)</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Send Money (Personal)
                </span>
              </div>

              {/* Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'border-[#E2136E] bg-[#E2136E]/10 text-white shadow-lg shadow-[#E2136E]/10'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-base text-[#E2136E]">bKash</div>
                  <div className="text-xs text-zinc-300 mt-1">Send Money to Personal</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'nagad'
                      ? 'border-[#F7941D] bg-[#F7941D]/10 text-white shadow-lg shadow-[#F7941D]/10'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-base text-[#F7941D]">Nagad</div>
                  <div className="text-xs text-zinc-300 mt-1">Send Money to Personal</div>
                </button>
              </div>

              {/* Official Payment Number Box */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 uppercase font-mono">
                    Official {paymentMethod.toUpperCase()} Recipient Number:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#9d4edd] hover:text-white transition-colors"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 text-[#38b000]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'Copied Number!' : 'Copy Number'}</span>
                  </button>
                </div>

                <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-wider select-all">
                  {officialNumber}
                </div>

                <div className="p-3 rounded-lg bg-black/50 border border-zinc-800/80 space-y-1.5 text-xs text-zinc-300">
                  <div className="font-semibold text-white">Payment Steps:</div>
                  <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px]">
                    <li>Open your {paymentMethod.toUpperCase()} App and select <strong>Send Money</strong>.</li>
                    <li>Enter recipient number: <strong className="text-white font-mono">{officialNumber}</strong></li>
                    <li>Enter exact amount: <strong className="text-emerald-400 font-mono">৳{finalTotal} BDT</strong></li>
                    <li>Reference: <strong className="text-purple-300 font-mono">{minecraftUsername || 'YOUR_IGN'}</strong></li>
                    <li>Complete the transaction and copy the <strong>Transaction ID (TrxID)</strong>.</li>
                  </ol>
                </div>
              </div>

              {/* Transaction Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Your {paymentMethod.toUpperCase()} Sender Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value.toUpperCase())}
                    placeholder="e.g. BL8392019"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#7b2cbf]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Order Notes / Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Any special instructions for staff or delivery..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#7b2cbf]"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sticky top-28 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Order Review
              </h3>

              {/* Items list snapshot */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-xs py-1 border-b border-zinc-900"
                  >
                    <div>
                      <div className="font-semibold text-white">{product.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        Qty: {quantity} × ৳{product.price}
                      </div>
                    </div>
                    <div className="font-mono text-white font-bold">
                      ৳{product.price * quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-zinc-900 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">৳{subtotal} BDT</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#38b000]">
                    <span>Coupon ({couponCode})</span>
                    <span className="font-mono font-bold">-৳{discount} BDT</span>
                  </div>
                )}

                <div className="border-t border-zinc-900 pt-3 flex justify-between items-baseline text-white">
                  <span className="font-bold text-sm">Payable Total</span>
                  <span className="text-2xl font-bold font-mono text-white">
                    ৳{finalTotal} <span className="text-xs text-emerald-400 font-normal">BDT</span>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-order-button"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#7b2cbf] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#c77dff] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950/60 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Verifying & Submitting...' : 'Submit & Confirm Payment'}
              </button>

              <div className="text-[11px] text-zinc-400 text-center space-y-1">
                <p>Items will be credited in-game immediately following verification.</p>
                <p className="text-zinc-400">Need support? Contact 01821925430 on WhatsApp</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
