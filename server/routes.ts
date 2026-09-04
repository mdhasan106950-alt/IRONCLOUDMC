import { Router, Request, Response } from 'express';
import { db } from './db';
import { Coupon, Order, OrderItem, PlayerReport, Product, TeamMember } from './types';

export const apiRouter = Router();

// In-memory challenge store for Minecraft verification (short-lived, single-use)
const verificationChallenges: Map<
  string,
  { code: string; username: string; expiresAt: number; used: boolean }
> = new Map();

// Helper: Query real Minecraft Server play.ironcloudmc.fun status
apiRouter.get('/server/status', async (req: Request, res: Response) => {
  const settings = db.getSettings();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`https://api.mcstatus.io/v2/status/java/${settings.serverIp}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return res.json({
        host: settings.serverIp,
        port: settings.javaPort,
        bedrockPort: settings.bedrockPort,
        online: Boolean(data.online),
        players: data.players || { online: 0, max: 1000 },
        version: data.version?.name_clean || settings.version,
        motd: data.motd?.clean || settings.tagline,
        retrievedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    // Network or timeout error
  }

  // Honest fallback state if external service fails or server is offline
  return res.json({
    host: settings.serverIp,
    port: settings.javaPort,
    bedrockPort: settings.bedrockPort,
    online: false,
    players: { online: 0, max: 1000 },
    version: settings.version,
    motd: settings.tagline,
    retrievedAt: new Date().toISOString(),
    statusMessage: 'Offline or Maintenance',
  });
});

// ----------------------------------------------------
// AUTHENTICATION & USER PROFILE
// ----------------------------------------------------
const TEMPORARY_ADMIN_PASSWORDS = ['Admin@IronCloud2026', 'admin123', 'ironcloud123', 'admin2026'];

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const isAdminEmail = cleanEmail === 'admin@ironcloudmc.fun' || cleanEmail === 'piratessmp2@gmail.com';

  if (isAdminEmail) {
    const isPasswordValid = TEMPORARY_ADMIN_PASSWORDS.some(
      (p) => p.toLowerCase() === String(password).trim().toLowerCase()
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password. Use the temporary admin password: Admin@IronCloud2026',
      });
    }

    const existing = db.getUserByEmail(cleanEmail);
    const user = db.saveUser({
      email: cleanEmail,
      name: existing?.name || (cleanEmail.includes('pirate') ? 'Pirates SMP Admin' : 'Iron Cloud Administrator'),
      role: 'OWNER',
      minecraftUsername: existing?.minecraftUsername || 'MR_DOOM_YT',
      minecraftEdition: existing?.minecraftEdition || 'Java',
      isMinecraftVerified: true,
      avatarUrl: existing?.avatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
    }, 'ADMIN');

    return res.json({
      success: true,
      message: 'Logged in successfully as Administrator.',
      user,
      token: `admin-token-${Date.now()}`,
    });
  }

  // Regular user login (registers or authenticates)
  let existing = db.getUserByEmail(cleanEmail);
  if (!existing) {
    existing = db.saveUser({
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      role: 'USER',
      minecraftUsername: cleanEmail.split('@')[0],
      minecraftEdition: 'Java',
      isMinecraftVerified: false,
      avatarUrl: `https://minotar.net/avatar/${encodeURIComponent(cleanEmail.split('@')[0])}/128.png`,
    }, 'USER');
  }

  return res.json({
    success: true,
    message: 'Logged in successfully.',
    user: existing,
    token: `user-token-${Date.now()}`,
  });
});

apiRouter.get('/user/profile', (req: Request, res: Response) => {
  const email = req.query.email as string | undefined;
  const username = req.query.username as string | undefined;

  if (email) {
    const user = db.getUserByEmail(email);
    if (user) return res.json(user);
  }

  if (username) {
    const user = db.getUserByUsername(username);
    if (user) return res.json(user);
  }

  return res.status(404).json({ error: 'User profile not found.' });
});

apiRouter.put('/user/profile', (req: Request, res: Response) => {
  const profileData = req.body;
  if (!profileData || !profileData.email) {
    return res.status(400).json({ error: 'User email is required to update profile.' });
  }

  const cleanEmail = String(profileData.email).trim().toLowerCase();
  const updated = db.saveUser({
    ...profileData,
    email: cleanEmail,
  }, cleanEmail);

  return res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: updated,
  });
});

apiRouter.post('/upload/avatar', (req: Request, res: Response) => {
  const { email, avatar } = req.body;
  if (!email || !avatar) {
    return res.status(400).json({ error: 'Email and avatar data are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const updated = db.saveUser({
    email: cleanEmail,
    avatarUrl: avatar,
    picture: avatar,
    avatarSource: 'upload',
  }, cleanEmail);

  return res.json({
    success: true,
    message: 'Profile picture uploaded successfully.',
    avatarUrl: updated.avatarUrl,
    user: updated,
  });
});

// ----------------------------------------------------
// CMS & SETTINGS
// ----------------------------------------------------
apiRouter.get('/cms', (req: Request, res: Response) => {
  res.json(db.getSettings());
});

apiRouter.put('/admin/cms', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body, req.headers['x-admin-user'] as string || 'ADMIN');
  res.json(updated);
});

// ----------------------------------------------------
// GAME MODES
// ----------------------------------------------------
apiRouter.get('/gamemodes', (req: Request, res: Response) => {
  res.json(db.getGamemodes());
});

// ----------------------------------------------------
// PRODUCTS (STORE)
// ----------------------------------------------------
apiRouter.get('/products', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  let products = db.getProducts();
  if (category && category !== 'all') {
    products = products.filter((p) => p.category === category);
  }
  res.json(products);
});

apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

apiRouter.post('/admin/products', (req: Request, res: Response) => {
  const productData: Product = req.body;
  if (!productData.name || !productData.price || !productData.category) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }
  if (!productData.id) {
    productData.id = `prod-${Date.now()}`;
  }
  if (!productData.slug) {
    productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  productData.currency = 'BDT';
  const saved = db.saveProduct(productData, req.headers['x-admin-user'] as string || 'ADMIN');
  res.status(201).json(saved);
});

apiRouter.put('/admin/products/:id', (req: Request, res: Response) => {
  const existing = db.getProductBySlug(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const updated: Product = { ...existing, ...req.body, id: existing.id };
  const saved = db.saveProduct(updated, req.headers['x-admin-user'] as string || 'ADMIN');
  res.json(saved);
});

apiRouter.delete('/admin/products/:id', (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id, req.headers['x-admin-user'] as string || 'ADMIN');
  if (!deleted) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

// ----------------------------------------------------
// COUPON ENGINE (Zero hardcoded coupons in frontend!)
// ----------------------------------------------------
apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, items, userEmail } = req.body as {
    code: string;
    items: { productId: string; quantity: number }[];
    userEmail?: string;
  };

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, error: 'Coupon code is required' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ valid: false, error: 'Cart items are required for coupon validation' });
  }

  const coupon = db.getCouponByCode(code);
  if (!coupon) {
    return res.status(404).json({ valid: false, error: 'Invalid coupon code. Please check spelling.' });
  }

  if (!coupon.isActive || coupon.isArchived) {
    return res.status(400).json({ valid: false, error: 'This coupon is no longer active.' });
  }

  const now = new Date();
  if (coupon.startDate && new Date(coupon.startDate) > now) {
    return res.status(400).json({ valid: false, error: 'This coupon promotion has not started yet.' });
  }

  if (coupon.endDate && new Date(coupon.endDate) < now) {
    return res.status(400).json({ valid: false, error: 'This coupon code has expired.' });
  }

  if (coupon.totalUsageLimit !== null && coupon.timesUsed >= coupon.totalUsageLimit) {
    return res.status(400).json({ valid: false, error: 'This coupon has reached its total usage limit.' });
  }

  // Recalculate subtotal authoritatively from database product prices
  let subtotal = 0;
  let eligibleAmount = 0;
  const dbProducts = db.getProducts();

  for (const item of items) {
    const prod = dbProducts.find((p) => p.id === item.productId || p.slug === item.productId);
    if (!prod) {
      return res.status(400).json({ valid: false, error: `Product '${item.productId}' not found in store.` });
    }
    const itemSubtotal = prod.price * item.quantity;
    subtotal += itemSubtotal;

    // Check if item is eligible for this coupon
    const categoryMatch =
      coupon.applicableCategories.includes('all') ||
      coupon.applicableCategories.includes(prod.category);
    const productMatch =
      coupon.applicableProductIds.length === 0 ||
      coupon.applicableProductIds.includes(prod.id);
    const notExcluded = !coupon.excludedProductIds.includes(prod.id);

    if (categoryMatch && productMatch && notExcluded) {
      eligibleAmount += itemSubtotal;
    }
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return res.status(400).json({
      valid: false,
      error: `Minimum order amount of ৳${coupon.minOrderAmount} is required for this coupon (Current subtotal: ৳${subtotal}).`,
    });
  }

  if (eligibleAmount <= 0) {
    return res.status(400).json({
      valid: false,
      error: 'None of the items in your cart qualify for this coupon.',
    });
  }

  // Calculate discount based on eligible amount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((eligibleAmount * coupon.discountValue) / 100);
  } else {
    discount = Math.min(coupon.discountValue, eligibleAmount);
  }

  if (coupon.maxDiscountAmount !== null && discount > coupon.maxDiscountAmount) {
    discount = coupon.maxDiscountAmount;
  }

  const finalTotal = Math.max(0, subtotal - discount);

  return res.json({
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      currency: coupon.currency,
    },
    subtotal,
    discount,
    finalTotal,
    message: `Coupon '${coupon.code}' applied! You saved ৳${discount}.`,
  });
});

// Admin Coupon Management
apiRouter.get('/admin/coupons', (req: Request, res: Response) => {
  const includeArchived = req.query.includeArchived === 'true';
  const coupons = db.getCoupons(includeArchived);
  res.json(coupons);
});

apiRouter.post('/admin/coupons', (req: Request, res: Response) => {
  const {
    code,
    name,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    startDate,
    endDate,
    totalUsageLimit,
    perUserUsageLimit,
    isActive,
    applicableCategories,
    applicableProductIds,
    excludedProductIds,
    firstOrderOnly,
  } = req.body;

  if (!code || !name || !discountType || discountValue === undefined) {
    return res.status(400).json({ error: 'Code, name, discountType, and discountValue are required' });
  }

  const existing = db.getCouponByCode(code);
  if (existing) {
    return res.status(409).json({ error: `Coupon code '${code.toUpperCase()}' already exists` });
  }

  const newCoupon: Coupon = {
    id: `coupon-${Date.now()}`,
    code: code.trim().toUpperCase(),
    name: name.trim(),
    description: description || '',
    discountType: discountType as 'percentage' | 'fixed',
    discountValue: Number(discountValue),
    currency: 'BDT',
    minOrderAmount: Number(minOrderAmount) || 0,
    maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
    startDate: startDate || new Date().toISOString(),
    endDate: endDate || null,
    totalUsageLimit: totalUsageLimit ? Number(totalUsageLimit) : null,
    timesUsed: 0,
    perUserUsageLimit: Number(perUserUsageLimit) || 1,
    isActive: isActive !== false,
    isArchived: false,
    applicableCategories: Array.isArray(applicableCategories) && applicableCategories.length > 0
      ? applicableCategories
      : ['all'],
    applicableProductIds: Array.isArray(applicableProductIds) ? applicableProductIds : [],
    excludedProductIds: Array.isArray(excludedProductIds) ? excludedProductIds : [],
    firstOrderOnly: Boolean(firstOrderOnly),
    createdAt: new Date().toISOString(),
  };

  const saved = db.saveCoupon(newCoupon, req.headers['x-admin-user'] as string || 'ADMIN');
  res.status(201).json(saved);
});

apiRouter.put('/admin/coupons/:id', (req: Request, res: Response) => {
  const coupons = db.getCoupons(true);
  const existing = coupons.find((c) => c.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Coupon not found' });
  }

  const updated: Coupon = {
    ...existing,
    ...req.body,
    id: existing.id,
    code: req.body.code ? req.body.code.trim().toUpperCase() : existing.code,
  };

  const saved = db.saveCoupon(updated, req.headers['x-admin-user'] as string || 'ADMIN');
  res.json(saved);
});

apiRouter.delete('/admin/coupons/:id', (req: Request, res: Response) => {
  const deleted = db.deleteCoupon(req.params.id, req.headers['x-admin-user'] as string || 'ADMIN');
  if (!deleted) {
    return res.status(404).json({ error: 'Coupon not found' });
  }
  res.json({ success: true, message: 'Coupon deleted' });
});

// ----------------------------------------------------
// ORDERS & CHECKOUT (Authoritative backend calculation)
// ----------------------------------------------------
apiRouter.post('/orders', (req: Request, res: Response) => {
  const {
    buyer,
    minecraft,
    items,
    couponCode,
    paymentMethod,
    senderNumber,
    transactionRef,
    customerNote,
  } = req.body;

  if (!buyer?.name || !buyer?.email || !buyer?.phone) {
    return res.status(400).json({ error: 'Buyer name, email, and phone number are required.' });
  }

  if (!minecraft?.username) {
    return res.status(400).json({ error: 'Minecraft username is required.' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart must contain at least one item.' });
  }

  if (!paymentMethod || !['bkash', 'nagad'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Valid payment method (bKash or Nagad) is required.' });
  }

  if (!senderNumber || !transactionRef) {
    return res.status(400).json({ error: 'Sender number and transaction ID (TrxID) are required.' });
  }

  // 1. Authoritatively retrieve products and calculate snapshot subtotal
  const dbProducts = db.getProducts();
  const orderItems: OrderItem[] = [];
  let subtotal = 0;
  let eligibleDiscountAmount = 0;

  let couponObj: Coupon | undefined;
  if (couponCode) {
    couponObj = db.getCouponByCode(couponCode);
  }

  for (const item of items) {
    const prod = dbProducts.find((p) => p.id === item.productId || p.slug === item.productId);
    if (!prod) {
      return res.status(400).json({ error: `Product '${item.productId}' does not exist or is no longer available.` });
    }
    if (!prod.isAvailable) {
      return res.status(400).json({ error: `Product '${prod.name}' is currently unavailable.` });
    }

    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const lineSubtotal = prod.price * qty;
    subtotal += lineSubtotal;

    orderItems.push({
      productId: prod.id,
      slug: prod.slug,
      name: prod.name,
      category: prod.category,
      price: prod.price,
      quantity: qty,
      subtotal: lineSubtotal,
    });

    if (couponObj && couponObj.isActive && !couponObj.isArchived) {
      const categoryMatch =
        couponObj.applicableCategories.includes('all') ||
        couponObj.applicableCategories.includes(prod.category);
      const productMatch =
        couponObj.applicableProductIds.length === 0 ||
        couponObj.applicableProductIds.includes(prod.id);
      const notExcluded = !couponObj.excludedProductIds.includes(prod.id);

      if (categoryMatch && productMatch && notExcluded) {
        eligibleDiscountAmount += lineSubtotal;
      }
    }
  }

  // 2. Authoritative Coupon discount recalculation
  let discount = 0;
  let validatedCouponCode: string | null = null;

  if (couponObj && couponObj.isActive && !couponObj.isArchived) {
    const now = new Date();
    const isStarted = !couponObj.startDate || new Date(couponObj.startDate) <= now;
    const notExpired = !couponObj.endDate || new Date(couponObj.endDate) >= now;
    const underLimit = couponObj.totalUsageLimit === null || couponObj.timesUsed < couponObj.totalUsageLimit;
    const minOrderMet = !couponObj.minOrderAmount || subtotal >= couponObj.minOrderAmount;

    if (isStarted && notExpired && underLimit && minOrderMet && eligibleDiscountAmount > 0) {
      if (couponObj.discountType === 'percentage') {
        discount = Math.round((eligibleDiscountAmount * couponObj.discountValue) / 100);
      } else {
        discount = Math.min(couponObj.discountValue, eligibleDiscountAmount);
      }
      if (couponObj.maxDiscountAmount !== null && discount > couponObj.maxDiscountAmount) {
        discount = couponObj.maxDiscountAmount;
      }
      validatedCouponCode = couponObj.code;

      // Increment coupon usage
      couponObj.timesUsed += 1;
      db.saveCoupon(couponObj, 'SYSTEM_ORDER_APPLY');
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);
  const orderId = `IC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowIso = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    createdAt: nowIso,
    updatedAt: nowIso,
    status: 'PAYMENT_SUBMITTED', // Order submitted + payment info submitted, pending staff / automated check
    buyer: {
      name: buyer.name.trim(),
      email: buyer.email.trim(),
      phone: buyer.phone.trim(),
      discord: buyer.discord?.trim() || undefined,
    },
    minecraft: {
      username: minecraft.username.trim(),
      uuid: minecraft.uuid || '',
      edition: minecraft.edition === 'Bedrock' ? 'Bedrock' : 'Java',
      verified: Boolean(minecraft.verified),
    },
    items: orderItems,
    subtotal,
    couponCode: validatedCouponCode,
    couponDiscount: discount,
    finalTotal,
    currency: 'BDT',
    paymentMethod,
    senderNumber: senderNumber.trim(),
    transactionRef: transactionRef.trim(),
    customerNote: customerNote?.trim(),
    auditLogs: [
      {
        timestamp: nowIso,
        action: 'ORDER_SUBMITTED',
        actor: buyer.email.trim(),
        details: `Order created for ৳${finalTotal} via ${paymentMethod.toUpperCase()} (Trx: ${transactionRef.trim()})`,
      },
    ],
  };

  const savedOrder = db.saveOrder(newOrder);
  return res.status(201).json(savedOrder);
});

apiRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

apiRouter.get('/orders', (req: Request, res: Response) => {
  const email = req.query.email as string | undefined;
  const username = req.query.username as string | undefined;
  let orders = db.getOrders();

  if (email) {
    orders = orders.filter((o) => o.buyer.email.toLowerCase() === email.toLowerCase());
  } else if (username) {
    orders = orders.filter((o) => o.minecraft.username.toLowerCase() === username.toLowerCase());
  }

  res.json(orders);
});

apiRouter.patch('/admin/orders/:id/status', (req: Request, res: Response) => {
  let { status, adminNote } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Order status is required' });
  }

  // Normalize common admin confirmation aliases
  const upperStatus = String(status).trim().toUpperCase();
  if (upperStatus === 'CONFIRMED' || upperStatus === 'CONFIRM' || upperStatus === 'APPROVE') {
    status = 'DELIVERED';
  } else {
    status = upperStatus;
  }

  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: `Order '${req.params.id}' not found` });
  }

  const validStatuses = [
    'PENDING',
    'PAYMENT_SUBMITTED',
    'VERIFYING',
    'PAID',
    'DELIVERED',
    'FAILED',
    'REFUNDED',
    'CANCELLED',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid order status '${status}'` });
  }

  const prevStatus = order.status;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (adminNote) order.adminNote = adminNote;

  const actor = (req.headers['x-admin-user'] as string) || 'ADMIN';
  order.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `STATUS_CHANGED_TO_${status}`,
    actor,
    details: adminNote || `Status updated from ${prevStatus} to ${status}`,
  });

  const updated = db.saveOrder(order, actor);
  res.json(updated);
});

// Dedicated Confirm Order endpoint
apiRouter.post('/admin/orders/:id/confirm', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: `Order '${req.params.id}' not found` });
  }

  const actor = (req.headers['x-admin-user'] as string) || 'ADMIN';
  const adminNote = req.body?.adminNote || 'Payment confirmed by staff & delivered to player in-game.';
  
  order.status = 'DELIVERED';
  order.updatedAt = new Date().toISOString();
  order.adminNote = adminNote;
  order.auditLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'ORDER_CONFIRMED_AND_DELIVERED',
    actor,
    details: adminNote,
  });

  const updated = db.saveOrder(order, actor);
  res.json({ success: true, order: updated });
});

// ----------------------------------------------------
// PLAYERS & MOJANG LOOKUP
// ----------------------------------------------------
apiRouter.get('/players/lookup/:username', async (req: Request, res: Response) => {
  const username = req.params.username.trim();
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const mojangRes = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`);
    if (mojangRes.ok) {
      const mojangData = await mojangRes.json();
      const uuid = mojangData.id;
      const formattedUuid = uuid.replace(
        /([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/,
        '$1-$2-$3-$4-$5'
      );

      // Find player rank from completed orders
      const orders = db.getOrders().filter(
        (o) =>
          o.minecraft.username.toLowerCase() === username.toLowerCase() &&
          ['PAID', 'DELIVERED'].includes(o.status)
      );

      const ranksHeld = orders
        .flatMap((o) => o.items)
        .filter((item) => item.category === 'ranks')
        .map((item) => item.name);

      const highestRank = ranksHeld.length > 0 ? ranksHeld[ranksHeld.length - 1] : 'Member';

      return res.json({
        username: mojangData.name,
        uuid: formattedUuid,
        rawUuid: uuid,
        avatarUrl: `https://crafatar.com/avatars/${uuid}?overlay`,
        bodyUrl: `https://crafatar.com/renders/body/${uuid}?overlay`,
        helmUrl: `https://minotar.net/helm/${mojangData.name}/128.png`,
        rank: highestRank,
        edition: 'Java',
        verified: true,
      });
    }
  } catch (err) {
    // Mojang lookup failed or bedrock user
  }

  // Fallback for Bedrock or offline username
  return res.json({
    username,
    uuid: `bedrock-${username.toLowerCase()}`,
    rawUuid: '',
    avatarUrl: `https://minotar.net/avatar/${encodeURIComponent(username)}/128.png`,
    bodyUrl: `https://minotar.net/armor/body/${encodeURIComponent(username)}/200.png`,
    helmUrl: `https://minotar.net/helm/${encodeURIComponent(username)}/128.png`,
    rank: 'Member',
    edition: 'Bedrock / Unlinked',
    verified: false,
  });
});

// Minecraft Verification Challenge Generation
apiRouter.post('/minecraft/challenge', (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cleanUser = username.trim().toLowerCase();
  const code = `IC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  verificationChallenges.set(cleanUser, {
    code,
    username,
    expiresAt,
    used: false,
  });

  res.json({
    username,
    challengeCode: code,
    expiresInSeconds: 600,
    instruction: `Connect to play.ironcloudmc.fun and type: /verify ${code}`,
  });
});

// ----------------------------------------------------
// REPORTS SYSTEM
// ----------------------------------------------------
apiRouter.get('/reports', (req: Request, res: Response) => {
  const userEmail = req.query.email as string | undefined;
  const username = req.query.username as string | undefined;
  let reports = db.getReports();

  if (userEmail) {
    reports = reports.filter((r) => r.reporterEmail.toLowerCase() === userEmail.toLowerCase());
  } else if (username) {
    reports = reports.filter((r) => r.reporterUsername.toLowerCase() === username.toLowerCase());
  }

  // Hide private staff notes from public player views
  const safeReports = reports.map((r) => ({
    id: r.id,
    reportedPlayer: r.reportedPlayer,
    category: r.category,
    description: r.description,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));

  res.json(safeReports);
});

apiRouter.post('/reports', (req: Request, res: Response) => {
  const { reportedPlayer, category, description, evidenceUrl, reporterEmail, reporterUsername } = req.body;

  if (!reportedPlayer || !category || !description) {
    return res.status(400).json({ error: 'Reported player, category, and description are required.' });
  }

  const newReport: PlayerReport = {
    id: `rep-${Date.now()}`,
    reportedPlayer: reportedPlayer.trim(),
    category,
    description: description.trim(),
    evidenceUrl: evidenceUrl?.trim(),
    reporterEmail: reporterEmail?.trim() || 'anonymous@ironcloudmc.fun',
    reporterUsername: reporterUsername?.trim() || 'Anonymous',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const saved = db.saveReport(newReport);
  res.status(201).json(saved);
});

apiRouter.get('/admin/reports', (req: Request, res: Response) => {
  res.json(db.getReports());
});

apiRouter.patch('/admin/reports/:id/status', (req: Request, res: Response) => {
  const { status, staffNotes } = req.body;
  const reports = db.getReports();
  const report = reports.find((r) => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  report.status = status;
  report.updatedAt = new Date().toISOString();
  if (staffNotes !== undefined) report.staffNotes = staffNotes;

  const actor = (req.headers['x-admin-user'] as string) || 'ADMIN';
  const updated = db.saveReport(report, actor);
  res.json(updated);
});

// ----------------------------------------------------
// TEAM MANAGEMENT
// ----------------------------------------------------
apiRouter.get('/team', (req: Request, res: Response) => {
  res.json(db.getTeam());
});

apiRouter.post('/admin/team', (req: Request, res: Response) => {
  const member: TeamMember = req.body;
  if (!member.name || !member.role || !member.department) {
    return res.status(400).json({ error: 'Name, role, and department are required' });
  }
  if (!member.id) member.id = `team-${Date.now()}`;
  member.isActive = member.isActive !== false;
  const saved = db.saveTeamMember(member, req.headers['x-admin-user'] as string || 'ADMIN');
  res.status(201).json(saved);
});

apiRouter.put('/admin/team/:id', (req: Request, res: Response) => {
  const existing = db.getTeam().find((t) => t.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  const updated: TeamMember = { ...existing, ...req.body, id: existing.id };
  const saved = db.saveTeamMember(updated, req.headers['x-admin-user'] as string || 'ADMIN');
  res.json(saved);
});

apiRouter.delete('/admin/team/:id', (req: Request, res: Response) => {
  const deleted = db.deleteTeamMember(req.params.id, req.headers['x-admin-user'] as string || 'ADMIN');
  if (!deleted) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  res.json({ success: true, message: 'Team member deleted' });
});

// ----------------------------------------------------
// PARTNERSHIP
// ----------------------------------------------------
apiRouter.get('/partnership', (req: Request, res: Response) => {
  const partners = db.getPartners().filter((p) => p.isPublished);
  res.json(partners);
});

apiRouter.get('/admin/partners', (req: Request, res: Response) => {
  res.json(db.getPartners());
});

apiRouter.post('/admin/partners', (req: Request, res: Response) => {
  const p = req.body;
  if (!p.name || !p.description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  if (!p.id) p.id = `partner-${Date.now()}`;
  const saved = db.savePartner(p, req.headers['x-admin-user'] as string || 'ADMIN');
  res.status(201).json(saved);
});

// ----------------------------------------------------
// ADMIN DASHBOARD METRICS & AUDIT LOGS
// ----------------------------------------------------
apiRouter.get('/admin/metrics', (req: Request, res: Response) => {
  const orders = db.getOrders();
  const coupons = db.getCoupons();
  const reports = db.getReports();

  const totalRevenue = orders
    .filter((o) => ['PAID', 'DELIVERED'].includes(o.status))
    .reduce((acc, o) => acc + o.finalTotal, 0);

  const pendingVerificationOrders = orders.filter((o) =>
    ['PAYMENT_SUBMITTED', 'VERIFYING'].includes(o.status)
  ).length;

  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const activeCouponsCount = coupons.filter((c) => c.isActive && !c.isArchived).length;
  const openReportsCount = reports.filter((r) => ['OPEN', 'IN REVIEW'].includes(r.status)).length;

  res.json({
    totalOrders: orders.length,
    totalRevenue,
    pendingVerificationOrders,
    deliveredOrders,
    activeCouponsCount,
    openReportsCount,
  });
});

apiRouter.get('/admin/audit-logs', (req: Request, res: Response) => {
  res.json(db.getAuditLogs());
});
