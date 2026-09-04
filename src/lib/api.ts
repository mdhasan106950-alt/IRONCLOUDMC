import {
  Coupon,
  CouponValidationResult,
  GameMode,
  Order,
  Partner,
  PlayerLookupResponse,
  PlayerReport,
  Product,
  ServerSettings,
  ServerStatusResponse,
  TeamMember,
} from '../types';

export const api = {
  // Server Status
  getServerStatus: async (): Promise<ServerStatusResponse> => {
    const res = await fetch('/api/server/status');
    if (!res.ok) throw new Error('Failed to fetch server status');
    return res.json();
  },

  // CMS
  getCMS: async (): Promise<ServerSettings> => {
    const res = await fetch('/api/cms');
    if (!res.ok) throw new Error('Failed to fetch CMS data');
    return res.json();
  },

  updateCMS: async (data: Partial<ServerSettings>, adminUser = 'ADMIN'): Promise<ServerSettings> => {
    const res = await fetch('/api/admin/cms', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-user': adminUser,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update CMS');
    return res.json();
  },

  // Game Modes
  getGamemodes: async (): Promise<GameMode[]> => {
    const res = await fetch('/api/gamemodes');
    if (!res.ok) throw new Error('Failed to fetch game modes');
    return res.json();
  },

  // Products
  getProducts: async (category?: string): Promise<Product[]> => {
    const url = category && category !== 'all' ? `/api/products?category=${category}` : '/api/products';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  createProduct: async (product: Partial<Product>, adminUser = 'ADMIN'): Promise<Product> => {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-user': adminUser },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  saveProduct: async (product: Partial<Product>, adminUser = 'ADMIN'): Promise<Product> => {
    const isNew = !product.id;
    const url = isNew ? '/api/admin/products' : `/api/admin/products/${product.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-user': adminUser },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save product');
    }
    return res.json();
  },

  deleteProduct: async (id: string, adminUser = 'ADMIN'): Promise<void> => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-user': adminUser },
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // Coupons
  getCoupons: async (includeArchived = false): Promise<Coupon[]> => {
    const res = await fetch(`/api/admin/coupons?includeArchived=${includeArchived}`);
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return res.json();
  },

  // Coupons
  validateCoupon: async (
    code: string,
    items: { productId: string; quantity: number }[],
    userEmail?: string
  ): Promise<CouponValidationResult> => {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, items, userEmail }),
    });
    return res.json();
  },

  getAdminCoupons: async (includeArchived = false): Promise<Coupon[]> => {
    const res = await fetch(`/api/admin/coupons?includeArchived=${includeArchived}`);
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return res.json();
  },

  createCoupon: async (couponData: Partial<Coupon>, adminUser = 'ADMIN'): Promise<Coupon> => {
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-user': adminUser },
      body: JSON.stringify(couponData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create coupon');
    }
    return res.json();
  },

  updateCoupon: async (id: string, couponData: Partial<Coupon>, adminUser = 'ADMIN'): Promise<Coupon> => {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-user': adminUser },
      body: JSON.stringify(couponData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update coupon');
    }
    return res.json();
  },

  deleteCoupon: async (id: string, adminUser = 'ADMIN'): Promise<void> => {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-user': adminUser },
    });
    if (!res.ok) throw new Error('Failed to delete coupon');
  },

  // Orders
  createOrder: async (orderPayload: {
    buyer: { name: string; email: string; phone: string; discord?: string };
    minecraft: { username: string; uuid?: string; edition: 'Java' | 'Bedrock'; verified?: boolean };
    items: { productId: string; quantity: number }[];
    couponCode?: string | null;
    paymentMethod: 'bkash' | 'nagad';
    senderNumber: string;
    transactionRef: string;
    customerNote?: string;
  }): Promise<Order> => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit order');
    }
    return res.json();
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  getOrders: async (params?: { email?: string; username?: string }): Promise<Order[]> => {
    const query = new URLSearchParams();
    if (params?.email) query.set('email', params.email);
    if (params?.username) query.set('username', params.username);
    const res = await fetch(`/api/orders?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  updateOrderStatus: async (
    orderId: string,
    status: Order['status'],
    adminNote?: string,
    adminUser = 'ADMIN'
  ): Promise<Order> => {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-user': adminUser },
      body: JSON.stringify({ status, adminNote }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update order status');
    }
    return res.json();
  },

  confirmOrder: async (orderId: string, adminNote?: string, adminUser = 'ADMIN'): Promise<Order> => {
    const res = await fetch(`/api/admin/orders/${orderId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-user': adminUser },
      body: JSON.stringify({ adminNote }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to confirm order');
    }
    const data = await res.json();
    return data.order || data;
  },

  // Players
  lookupPlayer: async (username: string): Promise<PlayerLookupResponse> => {
    const res = await fetch(`/api/players/lookup/${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error('Failed to lookup player');
    return res.json();
  },

  requestMinecraftChallenge: async (username: string): Promise<{ challengeCode: string; expiresInSeconds: number; instruction: string }> => {
    const res = await fetch('/api/minecraft/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) throw new Error('Failed to generate challenge');
    return res.json();
  },

  generateChallenge: async (username: string): Promise<{ challengeCode: string; expiresInSeconds: number; instruction: string }> => {
    return api.requestMinecraftChallenge(username);
  },

  // Team
  getTeam: async (): Promise<TeamMember[]> => {
    const res = await fetch('/api/team');
    if (!res.ok) throw new Error('Failed to fetch team members');
    return res.json();
  },

  saveTeamMember: async (member: Partial<TeamMember>, adminUser = 'ADMIN'): Promise<TeamMember> => {
    const isNew = !member.id;
    const url = isNew ? '/api/admin/team' : `/api/admin/team/${member.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-user': adminUser },
      body: JSON.stringify(member),
    });
    if (!res.ok) throw new Error('Failed to save team member');
    return res.json();
  },

  deleteTeamMember: async (id: string, adminUser = 'ADMIN'): Promise<void> => {
    const res = await fetch(`/api/admin/team/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-user': adminUser },
    });
    if (!res.ok) throw new Error('Failed to delete team member');
  },

  // Partners
  getPartners: async (): Promise<Partner[]> => {
    const res = await fetch('/api/partnership');
    if (!res.ok) throw new Error('Failed to fetch partners');
    return res.json();
  },

  // Reports
  getReports: async (params?: { email?: string; username?: string }): Promise<PlayerReport[]> => {
    const query = new URLSearchParams();
    if (params?.email) query.set('email', params.email);
    if (params?.username) query.set('username', params.username);
    const res = await fetch(`/api/reports?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  submitReport: async (data: {
    reportedPlayer?: string;
    targetUsername?: string;
    category?: string;
    reason?: string;
    realm?: string;
    description: string;
    evidenceUrl?: string;
    reporterEmail?: string;
    reporterUsername?: string;
    reporterName?: string;
    reporterContact?: string;
  }): Promise<PlayerReport> => {
    const payload = {
      reportedPlayer: data.reportedPlayer || data.targetUsername || 'Unknown',
      category: data.category || data.reason || 'General Violation',
      description: data.realm ? `[Realm: ${data.realm}] ${data.description}` : data.description,
      evidenceUrl: data.evidenceUrl,
      reporterEmail: data.reporterEmail || data.reporterContact || 'anonymous@ironcloudmc.fun',
      reporterUsername: data.reporterUsername || data.reporterName || 'Anonymous',
    };
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json();
  },

  getAdminReports: async (): Promise<PlayerReport[]> => {
    const res = await fetch('/api/admin/reports');
    if (!res.ok) throw new Error('Failed to fetch admin reports');
    return res.json();
  },

  updateReportStatus: async (
    id: string,
    status: string,
    staffNotes?: string,
    adminUser = 'ADMIN'
  ): Promise<PlayerReport> => {
    const res = await fetch(`/api/admin/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-user': adminUser },
      body: JSON.stringify({ status, staffNotes }),
    });
    if (!res.ok) throw new Error('Failed to update report');
    return res.json();
  },

  // Admin Metrics & Audits
  getAdminMetrics: async () => {
    const res = await fetch('/api/admin/metrics');
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },

  getAuditLogs: async () => {
    const res = await fetch('/api/admin/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  // Auth & Profile
  loginWithCredentials: async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data;
  },

  getProfile: async (params: { email?: string; username?: string }) => {
    const query = new URLSearchParams();
    if (params.email) query.set('email', params.email);
    if (params.username) query.set('username', params.username);
    const res = await fetch(`/api/user/profile?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  updateProfile: async (profile: Record<string, any>) => {
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  },

  uploadAvatar: async (email: string, avatar: string) => {
    const res = await fetch('/api/upload/avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, avatar }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload avatar');
    return data;
  },
};
