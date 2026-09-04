export type Currency = 'BDT';

export type ProductType = 'ranks' | 'coins' | 'keys' | 'bundle';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductType;
  price: number;
  originalPrice?: number;
  currency: Currency;
  description: string;
  features: string[];
  image?: string;
  badge?: string;
  isFeatured: boolean;
  isAvailable: boolean;
  displayOrder: number;
  accentColor?: string;
  details?: string[];
}

export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  currency: Currency;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string | null;
  totalUsageLimit: number | null;
  timesUsed: number;
  perUserUsageLimit: number;
  isActive: boolean;
  isArchived: boolean;
  applicableCategories: string[];
  applicableProductIds: string[];
  excludedProductIds: string[];
  firstOrderOnly: boolean;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAYMENT_SUBMITTED'
  | 'VERIFYING'
  | 'PAID'
  | 'DELIVERED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  category: ProductType;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  buyer: {
    name: string;
    email: string;
    phone: string;
    discord?: string;
  };
  minecraft: {
    username: string;
    uuid: string;
    edition: 'Java' | 'Bedrock';
    verified: boolean;
  };
  items: OrderItem[];
  subtotal: number;
  couponCode: string | null;
  couponDiscount: number;
  finalTotal: number;
  currency: Currency;
  paymentMethod: 'bkash' | 'nagad';
  senderNumber: string;
  transactionRef: string;
  customerNote?: string;
  adminNote?: string;
  auditLogs: {
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }[];
}

export interface GameMode {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  image: string;
  status: 'ONLINE' | 'MAINTENANCE' | 'DEVELOPMENT';
  playerCount: number;
  isFeatured: boolean;
  displayOrder: number;
  features: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  minecraftUsername: string;
  role: string;
  department: 'Management' | 'Administration' | 'Moderation' | 'Helpers';
  bio: string;
  avatarUrl?: string;
  displayOrder: number;
  isActive: boolean;
  socials?: {
    discord?: string;
    youtube?: string;
  };
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  image?: string;
  description: string;
  category: string;
  website?: string;
  discord?: string;
  youtube?: string;
  isFeatured: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export type ReportCategory =
  | 'Cheating'
  | 'Harassment'
  | 'Exploiting'
  | 'Scamming'
  | 'Bug Abuse'
  | 'Other';

export type ReportStatus =
  | 'OPEN'
  | 'IN REVIEW'
  | 'WAITING FOR EVIDENCE'
  | 'RESOLVED'
  | 'REJECTED'
  | 'ACTIONED';

export interface PlayerReport {
  id: string;
  reportedPlayer: string;
  category: ReportCategory;
  description: string;
  evidenceUrl?: string;
  reporterEmail: string;
  reporterUsername: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  staffNotes?: string;
}

export interface ServerSettings {
  serverName: string;
  tagline: string;
  serverIp: string;
  bedrockIp: string;
  bedrockPort: number;
  javaPort: number;
  version: string;
  discordUrl: string;
  supportEmail: string;
  supportPhone: string;
  bkashNumber: string;
  nagadNumber: string;
  announcement: {
    enabled: boolean;
    text: string;
    badge: string;
    link?: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  communityCount: string;
  aboutStory: string;
  rules: {
    id: string;
    title: string;
    description: string;
    punishment: string;
  }[];
  faqs: {
    question: string;
    answer: string;
    category: string;
  }[];
}

export interface ServerStatusResponse {
  host: string;
  port: number;
  bedrockPort: number;
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  version: string;
  motd: string;
  retrievedAt: string;
  statusMessage?: string;
}

export interface PlayerLookupResponse {
  username: string;
  uuid: string;
  rawUuid: string;
  avatarUrl: string;
  bodyUrl: string;
  helmUrl: string;
  rank: string;
  edition: string;
  verified: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: {
    id: string;
    code: string;
    name: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    currency: Currency;
  };
  subtotal: number;
  discount: number;
  finalTotal: number;
  message?: string;
  error?: string;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'MODERATOR' | 'USER' | 'admin';

export interface User {
  id?: string;
  email: string;
  name: string;
  picture?: string;
  avatarUrl?: string;
  bio?: string;
  discord?: string;
  phone?: string;
  role: UserRole;
  minecraftUsername?: string;
  minecraftUuid?: string;
  minecraftEdition?: 'Java' | 'Bedrock';
  isMinecraftVerified?: boolean;
  avatarSource?: 'upload' | 'minecraft' | 'url';
  joinedAt?: string;
}
