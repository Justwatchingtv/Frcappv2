import { pgTable, text, serial, integer, timestamp, json, boolean, numeric, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Enums (trading preferences)
export const tradingStyleEnum = pgEnum('trading_style', ['day_trader', 'swing_trader', 'position_trader', 'scalper']);
export const riskToleranceEnum = pgEnum('risk_tolerance', ['conservative', 'moderate', 'aggressive']);
export const experienceLevelEnum = pgEnum('experience_level', ['beginner', 'intermediate', 'advanced', 'expert']);
export const preferredMarketsEnum = pgEnum('preferred_markets', ['stocks', 'options', 'crypto', 'futures', 'forex']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: varchar("email", { length: 255 }),
  fullName: text("full_name"),
  bio: text("bio"),
  avatar: text("avatar"),
  tradingStyle: tradingStyleEnum("trading_style"),
  riskTolerance: riskToleranceEnum("risk_tolerance"),
  experienceLevel: experienceLevelEnum("experience_level"),
  preferredMarkets: json("preferred_markets").$type<string[]>(),
  favoriteSymbols: json("favorite_symbols").$type<string[]>(),
  tradingGoals: text("trading_goals"),
  dailyProfitTarget: numeric("daily_profit_target"),
  maxDrawdown: numeric("max_drawdown"),
  createdAt: timestamp("created_at").defaultNow(),
  totalPnl: numeric("total_pnl").default("0"),
  weeklyPnl: numeric("weekly_pnl").default("0"),
  winRate: numeric("win_rate").default("0"),
  tradesCount: integer("trades_count").default(0),
  averagePositionSize: numeric("average_position_size").default("0"),
  averageHoldingTime: numeric("average_holding_time").default("0"),
  bestTrade: numeric("best_trade").default("0"),
  worstTrade: numeric("worst_trade").default("0"),
  badges: json("badges").$type<string[]>(),
  achievements: json("achievements").$type<{ name: string; unlockedAt: string }[]>(),
});

// Create Zod schema for user registration/login
const baseUserSchema = createInsertSchema(users, {
  id: undefined,
  email: undefined,
  fullName: undefined,
  bio: undefined,
  avatar: undefined,
  tradingStyle: undefined,
  riskTolerance: undefined,
  experienceLevel: undefined,
  preferredMarkets: undefined,
  favoriteSymbols: undefined,
  tradingGoals: undefined,
  dailyProfitTarget: undefined,
  maxDrawdown: undefined,
  createdAt: undefined,
  totalPnl: undefined,
  weeklyPnl: undefined,
  winRate: undefined,
  tradesCount: undefined,
  averagePositionSize: undefined,
  averageHoldingTime: undefined,
  bestTrade: undefined,
  worstTrade: undefined,
  badges: undefined,
  achievements: undefined,
});

// Create the insert schema with only required fields for registration/login
export const insertUserSchema = baseUserSchema;
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  ticker: text("ticker"),
  analysis: json("analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const optionsFlow = pgTable("options_flow", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull(),
  strike: integer("strike").notNull(),
  expiry: timestamp("expiry").notNull(),
  volume: integer("volume").notNull(),
  openInterest: integer("open_interest").notNull(),
  type: text("type").notNull(), // 'call' or 'put'
  premium: integer("premium").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tradingChallenges = pgTable("trading_challenges", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  initialBalance: numeric("initial_balance").notNull(),
  maxLeverage: numeric("max_leverage").default("1"),
  allowedInstruments: json("allowed_instruments").notNull(),
  minParticipants: integer("min_participants").default(2),
  maxParticipants: integer("max_participants"),
  status: text("status").notNull().default("upcoming"), //Types(upcoming, active, completed) 
  createdAt: timestamp("created_at").defaultNow(),
});

export const challengeParticipants = pgTable("challenge_participants", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => tradingChallenges.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currentBalance: numeric("current_balance").notNull(),
  pnl: numeric("pnl").default("0"),
  rank: integer("rank"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const challengeTrades = pgTable("challenge_trades", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id").references(() => challengeParticipants.id).notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // buy, sell
  amount: numeric("amount").notNull(),
  entryPrice: numeric("entry_price").notNull(),
  exitPrice: numeric("exit_price"),
  pnl: numeric("pnl"),
  status: text("status").notNull(), // open, closed
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  createdChallenges: many(tradingChallenges),
  challengeParticipations: many(challengeParticipants),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export const tradingChallengesRelations = relations(tradingChallenges, ({ one, many }) => ({
  creator: one(users, {
    fields: [tradingChallenges.creatorId],
    references: [users.id],
  }),
  participants: many(challengeParticipants),
}));

export const challengeParticipantsRelations = relations(challengeParticipants, ({ one, many }) => ({
  challenge: one(tradingChallenges, {
    fields: [challengeParticipants.challengeId],
    references: [tradingChallenges.id],
  }),
  user: one(users, {
    fields: [challengeParticipants.userId],
    references: [users.id],
  }),
  trades: many(challengeTrades),
}));

export const challengeTradesRelations = relations(challengeTrades, ({ one }) => ({
  participant: one(challengeParticipants, {
    fields: [challengeTrades.participantId],
    references: [challengeParticipants.id],
  }),
}));

export const paperTradingAccounts = pgTable("paper_trading_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  balance: numeric("balance").notNull().default("100000"), // Default $100k
  totalPnl: numeric("total_pnl").default("0"),
  dailyPnl: numeric("daily_pnl").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  lastResetAt: timestamp("last_reset_at").defaultNow(),
});

export const paperTradingPositions = pgTable("paper_trading_positions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => paperTradingAccounts.id).notNull(),
  symbol: text("symbol").notNull(),
  optionType: text("option_type").notNull(), // 'call' or 'put'
  quantity: integer("quantity").notNull(),
  entryPrice: numeric("entry_price").notNull(),
  strikePrice: numeric("strike_price").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  status: text("status").notNull().default("open"), // open, closed
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  closingPrice: numeric("closing_price"),
  pnl: numeric("pnl").default("0"),
  riskLevel: text("risk_level").notNull(), // low, medium, high
});

export const paperTradingAccountsRelations = relations(paperTradingAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [paperTradingAccounts.userId],
    references: [users.id],
  }),
  positions: many(paperTradingPositions),
}));

export const paperTradingPositionsRelations = relations(paperTradingPositions, ({ one }) => ({
  account: one(paperTradingAccounts, {
    fields: [paperTradingPositions.accountId],
    references: [paperTradingAccounts.id],
  }),
}));


export const insertChallengeSchema = createInsertSchema(tradingChallenges);
export const selectChallengeSchema = createSelectSchema(tradingChallenges);
export type InsertChallenge = typeof tradingChallenges.$inferInsert;
export type SelectChallenge = typeof tradingChallenges.$inferSelect;


// Additional schema for user achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  criteria: json("criteria").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: json("progress"),
});

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));