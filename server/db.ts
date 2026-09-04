import fs from 'fs';
import path from 'path';
import {
  Product,
  Coupon,
  Order,
  GameMode,
  TeamMember,
  Partner,
  PlayerReport,
  ServerSettings,
  AuditLog,
  UserProfile,
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ironcloud-db.json');

export interface DatabaseSchema {
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  gamemodes: GameMode[];
  team: TeamMember[];
  partners: Partner[];
  reports: PlayerReport[];
  settings: ServerSettings;
  auditLogs: AuditLog[];
  users: UserProfile[];
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@ironcloudmc.fun',
    name: 'Iron Cloud Administrator',
    role: 'OWNER',
    minecraftUsername: 'MR_DOOM_YT',
    minecraftUuid: 'd8b27dfc-4570-4f51-b844-0c58a5e84dfa',
    minecraftEdition: 'Java',
    isMinecraftVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
    picture: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
    bio: 'Founder and Lead Administrator of Iron Cloud MC Network.',
    discord: 'ironcloud#0001',
    phone: '01821925430',
    joinedAt: '2024-01-01T00:00:00.000Z',
    avatarSource: 'upload',
  },
  {
    id: 'usr-admin-2',
    email: 'piratessmp2@gmail.com',
    name: 'Pirates SMP Admin',
    role: 'OWNER',
    minecraftUsername: 'MR_DOOM_YT',
    minecraftEdition: 'Java',
    isMinecraftVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
    picture: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
    bio: 'Network Owner and Server Lead for Iron Cloud MC.',
    discord: 'pirates#0001',
    phone: '01821925430',
    joinedAt: '2024-01-01T00:00:00.000Z',
    avatarSource: 'upload',
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  // Ranks
  {
    id: 'rank-hero',
    slug: 'rank-hero',
    name: 'Hero Rank',
    category: 'ranks',
    price: 150,
    originalPrice: 200,
    currency: 'BDT',
    description: 'The premier starter rank with essential flight and utility perks.',
    features: [
      'Custom [Hero] Prefix in Chat & Tab',
      'Access to /fly in Survival & Lobby',
      'Set up to 5 Homes (/sethome)',
      'Exclusive [Hero] Tag & Cyan Glow',
      'Colorful Chat Formatting (&3, &b)',
      'Priority Queue join when server is full',
    ],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 1,
    accentColor: '#00f2fe',
    badge: 'Popular Entry',
    details: [
      'Permanent rank duration — never expires.',
      'Instant delivery to your linked Minecraft account.',
      'Includes 1x Free Hero Crate Key bonus upon purchase.',
    ],
  },
  {
    id: 'rank-lion',
    slug: 'rank-lion',
    name: 'Lion Rank',
    category: 'ranks',
    price: 300,
    originalPrice: 400,
    currency: 'BDT',
    description: 'Show your courage with enhanced homes, /feed, and golden prestige.',
    features: [
      'All Hero Perks included',
      'Set up to 10 Homes (/sethome)',
      'Access to /feed command (30m cooldown)',
      'Exclusive [Lion] Golden Tag & Icon',
      'Priority 24/7 Discord Support role',
      'Access to Lion kit with diamond armor',
    ],
    isFeatured: true,
    isAvailable: true,
    displayOrder: 2,
    accentColor: '#ff9a9e',
    badge: 'Best Value',
    details: [
      'Permanent rank duration.',
      'Instant automated command dispatch.',
      'Includes 2x Rare Crate Keys.',
    ],
  },
  {
    id: 'rank-king',
    slug: 'rank-king',
    name: 'King Rank',
    category: 'ranks',
    price: 500,
    originalPrice: 650,
    currency: 'BDT',
    description: 'Rule the realm with virtual Ender Chest access and custom nicknames.',
    features: [
      'All Lion & Hero Perks included',
      'Set up to 15 Homes (/sethome)',
      'Access to /enderchest (/ec) anywhere',
      'Access to /nick for custom nickname',
      'Access to /workbench (/craft) command',
      'Royal Purple Crown Particle Trail',
    ],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 3,
    accentColor: '#a8edea',
    badge: 'Royal Tier',
    details: [
      'Permanent rank duration.',
      'Includes 3x Epic Crate Keys.',
      'Exclusive access to the King VIP Lounge on Discord.',
    ],
  },
  {
    id: 'rank-legend',
    slug: 'rank-legend',
    name: 'Legend Rank',
    category: 'ranks',
    price: 1000,
    originalPrice: 1300,
    currency: 'BDT',
    description: 'The pinnacle of power on Iron Cloud MC. Ultimate utilities, /repair, and status.',
    features: [
      'All King, Lion & Hero Perks included',
      'Set up to 25 Homes (/sethome)',
      'Access to /repair command (unlimited tool repair)',
      'Access to /heal command in non-combat zones',
      'Custom Legend Flame Cloak aura',
      'Access to private Legend Discord channel & staff meetings',
      'Max priority queue — instant join 100% of the time',
    ],
    isFeatured: true,
    isAvailable: true,
    displayOrder: 4,
    accentColor: '#ffecd2',
    badge: 'Supreme Tier',
    details: [
      'Permanent rank duration.',
      'Includes 5x Legendary Crate Keys + 50,000 Bonus Coins.',
      'Custom animated cape & title recognition across all game modes.',
    ],
  },

  // Coins
  {
    id: 'coins-bronze',
    slug: 'coins-bronze',
    name: 'Bronze Coin Package',
    category: 'coins',
    price: 50,
    currency: 'BDT',
    description: '5,000 In-Game Coins. Perfect for beginners entering the economy.',
    features: ['5,000 Coins', 'Instant delivery', 'Spend in auction house & shop', 'Starter balance boost'],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 10,
    accentColor: '#cd7f32',
  },
  {
    id: 'coins-silver',
    slug: 'coins-silver',
    name: 'Silver Coin Package',
    category: 'coins',
    price: 120,
    currency: 'BDT',
    description: '15,000 Coins + 5% Bonus (15,750 Total). Popular choice for active traders.',
    features: ['15,000 Coins', '+5% Bonus (750 extra)', 'Instant delivery', 'Popular package'],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 11,
    accentColor: '#c0c0c0',
  },
  {
    id: 'coins-gold',
    slug: 'coins-gold',
    name: 'Gold Coin Package',
    category: 'coins',
    price: 200,
    currency: 'BDT',
    description: '30,000 Coins + 10% Bonus (33,000 Total). Best seller for mid-game players.',
    features: ['30,000 Coins', '+10% Bonus (3,000 extra)', 'Instant delivery', 'Best Seller'],
    isFeatured: true,
    isAvailable: true,
    displayOrder: 12,
    accentColor: '#ffd700',
    badge: 'Best Seller',
  },
  {
    id: 'coins-diamond',
    slug: 'coins-diamond',
    name: 'Diamond Coin Package',
    category: 'coins',
    price: 300,
    currency: 'BDT',
    description: '50,000 Coins + 15% Bonus (57,500 Total). High roller wealth package.',
    features: ['50,000 Coins', '+15% Bonus (7,500 extra)', 'Instant delivery', 'High value package'],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 13,
    accentColor: '#89cff0',
  },
  {
    id: 'coins-emerald',
    slug: 'coins-emerald',
    name: 'Emerald Coin Package',
    category: 'coins',
    price: 500,
    currency: 'BDT',
    description: '100,000 Coins + 20% Bonus (120,000 Total). Dominate the server marketplace.',
    features: ['100,000 Coins', '+20% Bonus (20,000 extra)', 'Instant delivery', 'Ultimate wealth pack'],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 14,
    accentColor: '#50c878',
  },
  {
    id: 'coins-legendary',
    slug: 'coins-legendary',
    name: 'Legendary Coin Package',
    category: 'coins',
    price: 1000,
    currency: 'BDT',
    description: '250,000 Coins + 30% Bonus (325,000 Total). Maximum bulk bonus for empire builders.',
    features: ['250,000 Coins', '+30% Bonus (75,000 extra)', 'Instant delivery', 'VIP Economy status'],
    isFeatured: true,
    isAvailable: true,
    displayOrder: 15,
    accentColor: '#ffa500',
    badge: '30% Bonus',
  },

  // Keys
  {
    id: 'keys-common',
    slug: 'keys-common',
    name: 'Common Crate Keys (x5)',
    category: 'keys',
    price: 100,
    currency: 'BDT',
    description: '5 Common Crate Keys. Chance for rare enchanted books, ores, and tools.',
    features: ['5x Common Crate Keys', 'Instant in-game delivery', 'Useful early resources', 'Roll at /crates'],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 20,
    accentColor: '#a9a9a9',
  },
  {
    id: 'keys-rare',
    slug: 'keys-rare',
    name: 'Rare Crate Keys (x5)',
    category: 'keys',
    price: 250,
    currency: 'BDT',
    description: '5 Rare Crate Keys. Enhanced chances for netherite tools and spawner shards.',
    features: ['5x Rare Crate Keys', 'Higher chance for epic loot', 'Instant delivery', 'Roll at /crates'],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 21,
    accentColor: '#007bff',
  },
  {
    id: 'keys-epic',
    slug: 'keys-epic',
    name: 'Epic Crate Keys (x5)',
    category: 'keys',
    price: 500,
    currency: 'BDT',
    description: '5 Epic Crate Keys. Exclusive enchants, god armor pieces, and rare cosmetics.',
    features: ['5x Epic Crate Keys', 'Chance for legendary tier items', 'Instant delivery', 'Roll at /crates'],
    isFeatured: true,
    isAvailable: true,
    displayOrder: 22,
    accentColor: '#6f42c1',
    badge: 'High Win Rate',
  },
  {
    id: 'keys-legendary',
    slug: 'keys-legendary',
    name: 'Legendary Crate Keys (x3)',
    category: 'keys',
    price: 750,
    currency: 'BDT',
    description: '3 Legendary Crate Keys. Guaranteed epic or higher, high chance for Elytra & God Swords.',
    features: ['3x Legendary Crate Keys', 'Guaranteed Epic or Legendary reward', 'Instant delivery', 'Roll at /crates'],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 23,
    accentColor: '#ffc107',
  },
  {
    id: 'keys-mythical',
    slug: 'keys-mythical',
    name: 'Mythical Crate Keys (x3)',
    category: 'keys',
    price: 1200,
    currency: 'BDT',
    description: '3 Mythical Crate Keys. Guaranteed legendary loot and exclusive mythical cosmetics.',
    features: ['3x Mythical Crate Keys', 'Guaranteed legendary item', 'Exclusive particle wings', 'Roll at /crates'],
    isFeatured: false,
    isAvailable: true,
    displayOrder: 24,
    accentColor: '#e83e8c',
    badge: 'Mythical',
  },
  {
    id: 'keys-ultimate-bundle',
    slug: 'keys-ultimate-bundle',
    name: 'Ultimate Key Bundle',
    category: 'keys',
    price: 2500,
    originalPrice: 3200,
    currency: 'BDT',
    description: '10 Keys of every single crate type (50 Keys total). Best value crate package.',
    features: ['10x Common, 10x Rare, 10x Epic, 10x Legendary, 10x Mythical Keys', '50 Total Keys', 'Huge savings', 'Instant delivery'],
    isFeatured: true,
    isAvailable: true,
    displayOrder: 25,
    accentColor: '#20c997',
    badge: 'Best Value Bundle',
  },

  // Bundles
  {
    id: 'bundle-starter',
    slug: 'bundle-starter',
    name: 'Iron Cloud Starter Bundle',
    category: 'bundle',
    price: 399,
    originalPrice: 520,
    currency: 'BDT',
    description: 'Kickstart your adventure with Hero Rank, 10,000 Coins, and 5 Rare Crate Keys.',
    features: ['Hero Rank Permanent', '10,000 Coins', '5x Rare Crate Keys', 'Save ৳121 compared to individual purchase'],
    isFeatured: true,
    isAvailable: true,
    displayOrder: 30,
    accentColor: '#a855f7',
    badge: 'New Player Choice',
  },
  {
    id: 'bundle-emperor',
    slug: 'bundle-emperor',
    name: 'Emperor Legend Bundle',
    category: 'bundle',
    price: 3499,
    originalPrice: 4200,
    currency: 'BDT',
    description: 'The supreme bundle: Legend Rank, 100,000 Coins, and the Ultimate 50-Key Bundle.',
    features: ['Legend Rank Permanent', '100,000 Coins', 'Ultimate 50-Key Bundle', 'Exclusive Emperor Discord Tag', 'Save ৳701'],
    isFeatured: true,
    isAvailable: true,
    displayOrder: 31,
    accentColor: '#fbbf24',
    badge: 'Supreme Bundle',
  },
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coupon-welcome10',
    code: 'WELCOME10',
    name: 'Welcome Adventurer',
    description: '10% discount on all orders for new players.',
    discountType: 'percentage',
    discountValue: 10,
    currency: 'BDT',
    minOrderAmount: 100,
    maxDiscountAmount: 300,
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: null,
    totalUsageLimit: 500,
    timesUsed: 42,
    perUserUsageLimit: 1,
    isActive: true,
    isArchived: false,
    applicableCategories: ['all'],
    applicableProductIds: [],
    excludedProductIds: [],
    firstOrderOnly: false,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'coupon-iron20',
    code: 'IRON20',
    name: 'Iron Clan Discount',
    description: '20% off on all rank upgrades.',
    discountType: 'percentage',
    discountValue: 20,
    currency: 'BDT',
    minOrderAmount: 200,
    maxDiscountAmount: 400,
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: null,
    totalUsageLimit: 200,
    timesUsed: 68,
    perUserUsageLimit: 1,
    isActive: true,
    isArchived: false,
    applicableCategories: ['ranks', 'bundle'],
    applicableProductIds: [],
    excludedProductIds: [],
    firstOrderOnly: false,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'coupon-summer50',
    code: 'SUMMER50',
    name: 'Summer Fest Cash Discount',
    description: 'Flat ৳ 50 off on orders of ৳ 250 or more.',
    discountType: 'fixed',
    discountValue: 50,
    currency: 'BDT',
    minOrderAmount: 250,
    maxDiscountAmount: null,
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: null,
    totalUsageLimit: 300,
    timesUsed: 89,
    perUserUsageLimit: 2,
    isActive: true,
    isArchived: false,
    applicableCategories: ['all'],
    applicableProductIds: [],
    excludedProductIds: [],
    firstOrderOnly: false,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'coupon-vip25',
    code: 'VIP25',
    name: 'VIP Member Special',
    description: '25% discount on keys and coins.',
    discountType: 'percentage',
    discountValue: 25,
    currency: 'BDT',
    minOrderAmount: 300,
    maxDiscountAmount: 500,
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: null,
    totalUsageLimit: 150,
    timesUsed: 31,
    perUserUsageLimit: 1,
    isActive: true,
    isArchived: false,
    applicableCategories: ['keys', 'coins'],
    applicableProductIds: [],
    excludedProductIds: [],
    firstOrderOnly: false,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'coupon-discord15',
    code: 'DISCORD15',
    name: 'Discord Community Perk',
    description: '15% discount for verified Discord server members.',
    discountType: 'percentage',
    discountValue: 15,
    currency: 'BDT',
    minOrderAmount: 150,
    maxDiscountAmount: 250,
    startDate: '2025-01-01T00:00:00.000Z',
    endDate: null,
    totalUsageLimit: 400,
    timesUsed: 114,
    perUserUsageLimit: 2,
    isActive: true,
    isArchived: false,
    applicableCategories: ['all'],
    applicableProductIds: [],
    excludedProductIds: [],
    firstOrderOnly: false,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
];

const DEFAULT_GAMEMODES: GameMode[] = [
  {
    id: 'mode-survival',
    slug: 'survival',
    name: 'Custom Survival',
    description:
      'Classic survival enhanced with player economy, custom enchantments, claims, blood moons, and community kingdoms. Explore endless biomes with balanced progression.',
    shortDescription: 'Classic survival with custom mobs, player claims, and rich economy.',
    icon: 'Shield',
    image: '/images/background.jpg',
    status: 'ONLINE',
    playerCount: 0,
    isFeatured: true,
    displayOrder: 1,
    features: [
      'Land claiming with GriefPrevention',
      'Player-driven chest shops and auction house',
      'Over 50+ custom balanced enchantments',
      'Daily quests, seasonal events, and dungeons',
      'Keep inventory enabled in non-PvP zones',
    ],
  },
  {
    id: 'mode-factions',
    slug: 'factions',
    name: 'Iron Factions',
    description:
      'Form ruthless alliances, build impenetrable obsidian fortresses with water protection, design TNT cannons, and conquer enemy territory in brutal faction warfare.',
    shortDescription: 'Hardcore faction raiding, base building, and territorial warfare.',
    icon: 'Sword',
    image: '/images/background.jpg',
    status: 'ONLINE',
    playerCount: 0,
    isFeatured: true,
    displayOrder: 2,
    features: [
      'Custom TNT cannon physics & sand stackers',
      'Spawners with custom mob drop economy',
      'Grace periods & scheduled raid outposts',
      'Faction power, shields, and strike rosters',
      'Weekly payouts for top leaderboard factions',
    ],
  },
  {
    id: 'mode-pvp-arena',
    slug: 'pvp-arena',
    name: 'PvP Duels & Arena',
    description:
      'Test your sword, bow, crystal, and potion skills in custom competitive arenas. Ranked ELO ladder, 1v1 duels, FFA kolosseum, and custom kit loadouts.',
    shortDescription: 'Competitive 1v1 duels, FFA arena, and ELO matchmaking.',
    icon: 'Crosshair',
    image: '/images/background.jpg',
    status: 'ONLINE',
    playerCount: 0,
    isFeatured: true,
    displayOrder: 3,
    features: [
      '1.8 style and modern 1.21 combat kit options',
      'Automated tournaments with coin prizes',
      'Instant queue matchmaking & spectate mode',
      'Leaderboards for K/D ratio, streaks, and ELO',
      'Practice bots with configurable AI difficulty',
    ],
  },
  {
    id: 'mode-skyblock',
    slug: 'skyblock',
    name: 'Skyblock Realms',
    description:
      'Spawn on an isolated island in the clouds with limited supplies. Expand your empire, automate farms with minions, grind custom slayer bosses, and reach the #1 island rank.',
    shortDescription: 'Start in the clouds and build the ultimate floating empire.',
    icon: 'Boxes',
    image: '/images/background.jpg',
    status: 'DEVELOPMENT',
    playerCount: 0,
    isFeatured: false,
    displayOrder: 4,
    features: [
      'Co-op islands with friend permission controls',
      'Automated minion workers and ore generators',
      'Custom dungeon islands & slayer bosses',
      'Island level calculations and prestige perks',
    ],
  },
];

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'team-mrdoom',
    name: 'MR DOOM YT',
    minecraftUsername: 'MR_DOOM_YT',
    role: 'Owner',
    department: 'Management',
    bio: 'Founder and owner of IRON CLOUD MC. Oversees all server operations, infrastructure, strategic direction, and community vision.',
    displayOrder: 1,
    isActive: true,
    socials: {
      youtube: 'https://youtube.com',
      discord: 'MR_DOOM_YT#0001',
    },
  },
  {
    id: 'team-senpai-hasan',
    name: 'senpai-hasan',
    minecraftUsername: 'senpai_hasan',
    role: 'Lead Developer',
    department: 'Management',
    bio: 'Main architect and developer responsible for custom plugins, backend APIs, server maintenance, performance optimization, and technical operations.',
    displayOrder: 2,
    isActive: true,
    socials: {
      discord: 'senpai_hasan',
    },
  },
  {
    id: 'team-zerox',
    name: 'zerox (alvi)',
    minecraftUsername: 'zerox_dev',
    role: 'Developer',
    department: 'Management',
    bio: 'Core developer assisting with plugin integrations, gameplay mechanics, database sync, and server anti-cheat configuration.',
    displayOrder: 3,
    isActive: true,
    socials: {
      discord: 'zerox',
    },
  },
  {
    id: 'team-abir',
    name: 'abir (ziron)',
    minecraftUsername: 'ziron_abir',
    role: 'Administrator',
    department: 'Administration',
    bio: 'Senior administrator handling player management, high-priority support disputes, rule enforcement, and community governance.',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'team-sazim',
    name: 'SAZIM',
    minecraftUsername: 'SAZIM_MC',
    role: 'Administrator',
    department: 'Administration',
    bio: 'Senior administrator managing staff schedules, server events, economy balance oversight, and player satisfaction.',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'team-vaymo',
    name: 'VAYMO',
    minecraftUsername: 'VAYMO',
    role: 'Moderator',
    department: 'Moderation',
    bio: 'Active moderator maintaining server order, reviewing player reports, monitoring chat, and upholding community safety.',
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'team-sayan',
    name: 'SAYAN',
    minecraftUsername: 'SAYAN_MC',
    role: 'Moderator',
    department: 'Moderation',
    bio: 'Active moderator assisting players in game and on Discord, resolving player conflicts, and investigating suspicious gameplay.',
    displayOrder: 7,
    isActive: true,
  },
  {
    id: 'team-mahim',
    name: 'MAHIM',
    minecraftUsername: 'MAHIM_BD',
    role: 'Moderator',
    department: 'Moderation',
    bio: 'Dedicated moderator handling ticket queues, verifying appeals, and organizing community in-game gatherings.',
    displayOrder: 8,
    isActive: true,
  },
  {
    id: 'team-helpers',
    name: 'Helper Volunteer Team',
    minecraftUsername: 'IronCloudHelper',
    role: 'Helpers',
    department: 'Helpers',
    bio: 'Dedicated team of volunteer helpers welcoming new players, answering gameplay questions, and guiding beginners.',
    displayOrder: 9,
    isActive: true,
  },
];

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'partner-1',
    name: 'Bangla Minecraft Creators Guild',
    logo: '/images/logo.png',
    description: 'Premier regional gaming alliance creating high quality Minecraft content and multiplayer tournaments.',
    category: 'Content Alliance',
    website: 'https://ironcloudmc.fun',
    discord: 'https://discord.gg/Jr2XBcYDSH',
    youtube: 'https://youtube.com',
    isFeatured: true,
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'partner-2',
    name: 'Apex Node Hosting Partners',
    logo: '/images/logo.png',
    description: 'High-performance cloud infrastructure partner delivering sub-30ms latency across South Asia and global routes.',
    category: 'Infrastructure',
    website: 'https://ironcloudmc.fun',
    isFeatured: true,
    displayOrder: 2,
    isPublished: true,
  },
];

const DEFAULT_SETTINGS: ServerSettings = {
  serverName: 'IRON CLOUD MC',
  tagline: 'Experience Minecraft Like Never Before.',
  serverIp: 'play.ironcloudmc.fun',
  bedrockIp: 'play.ironcloudmc.fun',
  bedrockPort: 19132,
  javaPort: 25565,
  version: '1.8 - 1.21.8',
  discordUrl: 'https://discord.gg/Jr2XBcYDSH',
  supportEmail: 'ironcloudmc@gmail.com',
  supportPhone: '01821925430',
  bkashNumber: '01821925430',
  nagadNumber: '01821925430',
  announcement: {
    enabled: true,
    text: '🚀 SEASON UPDATE: Join play.ironcloudmc.fun now! Use code WELCOME10 for 10% off store ranks!',
    badge: 'NEW UPDATE',
    link: '/store/ranks',
  },
  heroTitle: 'IRON CLOUD MC',
  heroSubtitle: 'The Ultimate Minecraft Survival & PvP Network Since 2019',
  communityCount: '10,000+',
  aboutStory:
    'IronCloudMC was founded in 2019 by HASAN as a private world for a close group of friends. What started as a simple idea — a place to create and have fun together — has grown into one of the most welcoming Minecraft communities. The name reflects our spirit: Iron for strength and permanence, and Cloud for our limitless creativity. From our original spawn town to the sprawling kingdoms of today, every player has left their mark on our server history.',
  rules: [
    {
      id: 'rule-1',
      title: 'No Cheating / Unfair Advantages',
      description: 'Hacked clients, X-ray texture packs, auto-clickers, baritone, macros, or modified game clients that provide an unfair advantage are strictly forbidden.',
      punishment: 'Permanent Ban without appeal',
    },
    {
      id: 'rule-2',
      title: 'Respect All Community Members',
      description: 'No hate speech, harassment, discrimination, toxic behavior, threats, doxxing, or derogatory language in public or private chat.',
      punishment: 'Mute (1h - 7d) or Temporary Ban',
    },
    {
      id: 'rule-3',
      title: 'No Exploiting or Bug Abuse',
      description: 'Any duplication glitches, boundary exploits, or unintended server bugs must be reported immediately to staff via /reports or Discord.',
      punishment: 'Inventory Wipe and 30-day Ban',
    },
    {
      id: 'rule-4',
      title: 'No Advertising or Self-Promotion',
      description: 'Posting other Minecraft server IPs, unauthorized Discord invite links, or commercial advertising is prohibited.',
      punishment: 'Permanent Mute or IP Ban',
    },
    {
      id: 'rule-5',
      title: 'Safe Trading & Anti-Scam Policy',
      description: 'Scamming in player trades or real-world trading of unauthorized items outside the official store is strictly forbidden.',
      punishment: 'Permanent Ban & Trade Freeze',
    },
    {
      id: 'rule-6',
      title: 'Staff Impersonation & Disrespect',
      description: 'Do not impersonate staff members or deliberately waste staff assistance with false emergency tickets.',
      punishment: 'Temporary Ban',
    },
  ],
  faqs: [
    {
      category: 'Joining',
      question: 'How do I connect to IRON CLOUD MC?',
      answer: 'Launch Minecraft Java Edition (version 1.8 to 1.21.8), go to Multiplayer -> Add Server, enter server address `play.ironcloudmc.fun`, and click Join! Bedrock players can connect using IP `play.ironcloudmc.fun` on port `19132`.',
    },
    {
      category: 'Store & Payments',
      question: 'How do I pay using bKash or Nagad?',
      answer: 'Select your rank or package in our Store, proceed to checkout, choose bKash or Nagad, send money to our official number 01821925430 with your Order Reference, and enter your Sender Number and Transaction ID (TrxID). Once submitted, our automated delivery system verifies your payment and delivers your items in-game within minutes!',
    },
    {
      category: 'Store & Payments',
      question: 'Do ranks expire?',
      answer: 'No! All ranks purchased on IRON CLOUD MC are permanent lifetime ranks and will never expire.',
    },
    {
      category: 'Support',
      question: 'I paid but did not receive my rank yet. What should I do?',
      answer: 'Please ensure you were logged into Minecraft at least once so your username is registered. If your payment is not credited after 15 minutes, reach out to our team immediately on Discord (discord.gg/Jr2XBcYDSH) or email ironcloudmc@gmail.com with your Order ID.',
    },
    {
      category: 'Gameplay',
      question: 'Can Bedrock Edition (Mobile/Console/Windows) players play with Java players?',
      answer: 'Yes! IRON CLOUD MC has full GeyserMC cross-play support enabled, allowing Java and Bedrock players to play together in the same worlds.',
    },
  ],
};

export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-IC-882194',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: 'PAYMENT_SUBMITTED',
    buyer: {
      name: 'Tanvir Ahmed',
      email: 'tanvir.craft@gmail.com',
      phone: '01712345678',
      discord: 'tanvir_mc#9921',
    },
    minecraft: {
      username: 'IronSlayer_BD',
      uuid: 'c06f8906-4c3e-4d07-bc1a-55263a4afd73',
      edition: 'Java',
      verified: true,
    },
    items: [
      {
        productId: 'prod-rank-vip-plus',
        slug: 'vip-plus',
        name: 'VIP+ Rank [Lifetime]',
        category: 'ranks',
        price: 350,
        quantity: 1,
        subtotal: 350,
      },
    ],
    subtotal: 350,
    couponCode: 'LAUNCH50',
    couponDiscount: 50,
    finalTotal: 300,
    currency: 'BDT',
    paymentMethod: 'bkash',
    senderNumber: '01712345678',
    transactionRef: '9J2K8L1M4P',
    customerNote: 'Paid via personal bKash send money. Please deliver to Java edition.',
    auditLogs: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        action: 'ORDER_CREATED',
        actor: 'SYSTEM',
        details: 'Order placed with bKash TrxID 9J2K8L1M4P',
      },
    ],
  },
  {
    id: 'ORD-IC-881940',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: 'VERIFYING',
    buyer: {
      name: 'Rahim Chowdhury',
      email: 'rahim.bd@gmail.com',
      phone: '01898765432',
      discord: 'rahim_gg',
    },
    minecraft: {
      username: 'ShadowNinja_99',
      uuid: 'b5cb27b2-6174-4c98-af5a-5ffd62117e8b',
      edition: 'Java',
      verified: true,
    },
    items: [
      {
        productId: 'prod-crate-mythic-5',
        slug: 'mythic-keys',
        name: '5x Mythic Crate Keys',
        category: 'keys',
        price: 250,
        quantity: 1,
        subtotal: 250,
      },
    ],
    subtotal: 250,
    couponCode: null,
    couponDiscount: 0,
    finalTotal: 250,
    currency: 'BDT',
    paymentMethod: 'nagad',
    senderNumber: '01898765432',
    transactionRef: 'NG88219407',
    customerNote: 'Nagad payment sent.',
    auditLogs: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        action: 'ORDER_CREATED',
        actor: 'SYSTEM',
        details: 'Order placed with Nagad TrxID NG88219407',
      },
    ],
  },
  {
    id: 'ORD-IC-879102',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 270).toISOString(),
    status: 'DELIVERED',
    buyer: {
      name: 'Abrar Hossain',
      email: 'abrar.iron@gmail.com',
      phone: '01911223344',
    },
    minecraft: {
      username: 'PixelWarrior_BD',
      uuid: 'd80be135-7de6-6fcc-ddec-99cbb20d4ed4',
      edition: 'Bedrock',
      verified: true,
    },
    items: [
      {
        productId: 'prod-coins-100k',
        slug: 'coins-100k',
        name: '100,000 Network Economy Coins',
        category: 'coins',
        price: 150,
        quantity: 1,
        subtotal: 150,
      },
    ],
    subtotal: 150,
    couponCode: null,
    couponDiscount: 0,
    finalTotal: 150,
    currency: 'BDT',
    paymentMethod: 'bkash',
    senderNumber: '01911223344',
    transactionRef: 'BK99482103',
    adminNote: 'bKash TrxID verified in statement. Coins granted in Survival.',
    auditLogs: [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 270).toISOString(),
        action: 'STATUS_CHANGED_TO_DELIVERED',
        actor: 'ADMIN',
        details: 'Payment verified and delivered to player',
      },
    ],
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          products: parsed.products || DEFAULT_PRODUCTS,
          coupons: parsed.coupons || DEFAULT_COUPONS,
          orders: parsed.orders && parsed.orders.length > 0 ? parsed.orders : DEFAULT_ORDERS,
          gamemodes: parsed.gamemodes || DEFAULT_GAMEMODES,
          team: parsed.team || DEFAULT_TEAM,
          partners: parsed.partners || DEFAULT_PARTNERS,
          reports: parsed.reports || [],
          settings: parsed.settings || DEFAULT_SETTINGS,
          auditLogs: parsed.auditLogs || [],
          users: parsed.users || DEFAULT_USERS,
        };
      }
    } catch (err) {
      console.error('Error loading database, falling back to defaults:', err);
    }

    const initialData: DatabaseSchema = {
      products: DEFAULT_PRODUCTS,
      coupons: DEFAULT_COUPONS,
      orders: DEFAULT_ORDERS,
      gamemodes: DEFAULT_GAMEMODES,
      team: DEFAULT_TEAM,
      partners: DEFAULT_PARTNERS,
      reports: [],
      settings: DEFAULT_SETTINGS,
      auditLogs: [
        {
          id: 'audit-init',
          timestamp: new Date().toISOString(),
          action: 'DATABASE_INITIALIZED',
          actor: 'SYSTEM',
          entityType: 'SYSTEM',
          entityId: 'SYSTEM',
          details: 'Iron Cloud MC Authoritative Database initialized.',
        },
      ],
      users: DEFAULT_USERS,
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  public getProducts(): Product[] {
    return this.data.products.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug || p.id === slug);
  }

  public saveProduct(product: Product, actor = 'ADMIN'): Product {
    const idx = this.data.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      this.data.products[idx] = product;
      this.logAudit('PRODUCT_UPDATED', actor, 'PRODUCT', product.id, `Updated product ${product.name} (৳${product.price})`);
    } else {
      this.data.products.push(product);
      this.logAudit('PRODUCT_CREATED', actor, 'PRODUCT', product.id, `Created product ${product.name} (৳${product.price})`);
    }
    this.saveData();
    return product;
  }

  public deleteProduct(id: string, actor = 'ADMIN'): boolean {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx >= 0) {
      const p = this.data.products[idx];
      this.data.products.splice(idx, 1);
      this.logAudit('PRODUCT_DELETED', actor, 'PRODUCT', id, `Deleted product ${p.name}`);
      this.saveData();
      return true;
    }
    return false;
  }

  public getCoupons(includeArchived = false): Coupon[] {
    if (includeArchived) return this.data.coupons;
    return this.data.coupons.filter((c) => !c.isArchived);
  }

  public getCouponByCode(code: string): Coupon | undefined {
    const clean = code.trim().toUpperCase();
    return this.data.coupons.find((c) => c.code.toUpperCase() === clean);
  }

  public saveCoupon(coupon: Coupon, actor = 'ADMIN'): Coupon {
    const cleanCode = coupon.code.trim().toUpperCase();
    const cleanCoupon = { ...coupon, code: cleanCode };
    const idx = this.data.coupons.findIndex((c) => c.id === cleanCoupon.id);
    if (idx >= 0) {
      this.data.coupons[idx] = cleanCoupon;
      this.logAudit('COUPON_UPDATED', actor, 'COUPON', cleanCoupon.id, `Updated coupon ${cleanCoupon.code}`);
    } else {
      this.data.coupons.push(cleanCoupon);
      this.logAudit('COUPON_CREATED', actor, 'COUPON', cleanCoupon.id, `Created coupon ${cleanCoupon.code} (${cleanCoupon.discountType === 'percentage' ? cleanCoupon.discountValue + '%' : '৳' + cleanCoupon.discountValue})`);
    }
    this.saveData();
    return cleanCoupon;
  }

  public deleteCoupon(id: string, actor = 'ADMIN'): boolean {
    const idx = this.data.coupons.findIndex((c) => c.id === id);
    if (idx >= 0) {
      const code = this.data.coupons[idx].code;
      this.data.coupons.splice(idx, 1);
      this.logAudit('COUPON_DELETED', actor, 'COUPON', id, `Deleted coupon ${code}`);
      this.saveData();
      return true;
    }
    return false;
  }

  public getGamemodes(): GameMode[] {
    return this.data.gamemodes.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public saveGamemode(mode: GameMode, actor = 'ADMIN'): GameMode {
    const idx = this.data.gamemodes.findIndex((m) => m.id === mode.id);
    if (idx >= 0) {
      this.data.gamemodes[idx] = mode;
      this.logAudit('GAMEMODE_UPDATED', actor, 'GAMEMODE', mode.id, `Updated game mode ${mode.name}`);
    } else {
      this.data.gamemodes.push(mode);
      this.logAudit('GAMEMODE_CREATED', actor, 'GAMEMODE', mode.id, `Created game mode ${mode.name}`);
    }
    this.saveData();
    return mode;
  }

  public getTeam(): TeamMember[] {
    return this.data.team.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public saveTeamMember(member: TeamMember, actor = 'ADMIN'): TeamMember {
    const idx = this.data.team.findIndex((t) => t.id === member.id);
    if (idx >= 0) {
      this.data.team[idx] = member;
      this.logAudit('TEAM_MEMBER_UPDATED', actor, 'TEAM', member.id, `Updated team member ${member.name}`);
    } else {
      this.data.team.push(member);
      this.logAudit('TEAM_MEMBER_CREATED', actor, 'TEAM', member.id, `Added team member ${member.name} (${member.role})`);
    }
    this.saveData();
    return member;
  }

  public deleteTeamMember(id: string, actor = 'ADMIN'): boolean {
    const idx = this.data.team.findIndex((t) => t.id === id);
    if (idx >= 0) {
      const name = this.data.team[idx].name;
      this.data.team.splice(idx, 1);
      this.logAudit('TEAM_MEMBER_DELETED', actor, 'TEAM', id, `Removed team member ${name}`);
      this.saveData();
      return true;
    }
    return false;
  }

  public getPartners(): Partner[] {
    return this.data.partners.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public savePartner(partner: Partner, actor = 'ADMIN'): Partner {
    const idx = this.data.partners.findIndex((p) => p.id === partner.id);
    if (idx >= 0) {
      this.data.partners[idx] = partner;
      this.logAudit('PARTNER_UPDATED', actor, 'PARTNER', partner.id, `Updated partner ${partner.name}`);
    } else {
      this.data.partners.push(partner);
      this.logAudit('PARTNER_CREATED', actor, 'PARTNER', partner.id, `Created partner ${partner.name}`);
    }
    this.saveData();
    return partner;
  }

  public getOrders(): Order[] {
    return this.data.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): Order | undefined {
    if (!id) return undefined;
    const cleanId = decodeURIComponent(id).trim().toLowerCase();
    return this.data.orders.find(
      (o) => o.id.trim().toLowerCase() === cleanId || o.transactionRef?.trim().toLowerCase() === cleanId
    );
  }

  public saveOrder(order: Order, actor = 'SYSTEM'): Order {
    const idx = this.data.orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      this.data.orders[idx] = order;
      this.logAudit('ORDER_UPDATED', actor, 'ORDER', order.id, `Order ${order.id} status changed to ${order.status}`);
    } else {
      this.data.orders.push(order);
      this.logAudit('ORDER_CREATED', actor, 'ORDER', order.id, `Order ${order.id} submitted by ${order.minecraft.username} (৳${order.finalTotal})`);
    }
    this.saveData();
    return order;
  }

  public getReports(): PlayerReport[] {
    return this.data.reports.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public saveReport(report: PlayerReport, actor = 'USER'): PlayerReport {
    const idx = this.data.reports.findIndex((r) => r.id === report.id);
    if (idx >= 0) {
      this.data.reports[idx] = report;
      this.logAudit('REPORT_UPDATED', actor, 'REPORT', report.id, `Report ${report.id} status set to ${report.status}`);
    } else {
      this.data.reports.push(report);
      this.logAudit('REPORT_FILED', actor, 'REPORT', report.id, `Report against ${report.reportedPlayer} filed for ${report.category}`);
    }
    this.saveData();
    return report;
  }

  public getSettings(): ServerSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<ServerSettings>, actor = 'ADMIN'): ServerSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.logAudit('SETTINGS_UPDATED', actor, 'SETTINGS', 'SERVER_SETTINGS', 'Updated server configuration settings');
    this.saveData();
    return this.data.settings;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public logAudit(action: string, actor: string, entityType: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      entityType,
      entityId,
      details,
    };
    this.data.auditLogs.unshift(log);
    // Keep max 1000 logs
    if (this.data.auditLogs.length > 1000) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 1000);
    }
  }

  public getUsers(): UserProfile[] {
    return this.data.users || [];
  }

  public getUserByEmail(email: string): UserProfile | undefined {
    const clean = email.trim().toLowerCase();
    return (this.data.users || []).find((u) => u.email.toLowerCase() === clean);
  }

  public getUserByUsername(username: string): UserProfile | undefined {
    const clean = username.trim().toLowerCase();
    return (this.data.users || []).find(
      (u) => u.minecraftUsername && u.minecraftUsername.toLowerCase() === clean
    );
  }

  public saveUser(user: Partial<UserProfile> & { email: string }, actor = 'USER'): UserProfile {
    if (!this.data.users) this.data.users = [...DEFAULT_USERS];
    const cleanEmail = user.email.trim().toLowerCase();
    const idx = this.data.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    let saved: UserProfile;
    if (idx >= 0) {
      saved = { ...this.data.users[idx], ...user };
      this.data.users[idx] = saved;
      this.logAudit('USER_UPDATED', actor, 'USER', saved.id, `Profile updated for ${saved.email}`);
    } else {
      saved = {
        id: user.id || `usr-${Date.now()}`,
        email: cleanEmail,
        name: user.name || cleanEmail.split('@')[0],
        role: user.role || 'USER',
        joinedAt: user.joinedAt || new Date().toISOString(),
        ...user,
      };
      this.data.users.push(saved);
      this.logAudit('USER_CREATED', actor, 'USER', saved.id, `User profile created for ${saved.email}`);
    }
    this.saveData();
    return saved;
  }
}

export const db = new Database();
