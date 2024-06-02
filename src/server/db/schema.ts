import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `omnitrack_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (post) => ({
    postCreatedByIdIdx: index("postCreatedById_idx").on(post.createdById),
  }),
);

export const trackers = createTable(
  "tracker",
  {
    id: serial("id").primaryKey(),
    monitoredById: varchar("monitoredById", { length: 255 })
      .notNull()
      .references(() => users.id),
    name: varchar("name", { length: 255 }).notNull().default("N/A"),
    latitude: real("latitude"),
    longtitude: real("longtitude"),
    createdAt: timestamp("createdAt", { withTimezone: true, precision: 6 })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    imei: integer("imei").notNull(),
    speed: real("speed").default(4.0).notNull(),
  },
  (user) => ({
    trackerMonitoredByIdIdx: index("trackerMonitoredById_idx").on(
      user.monitoredById,
    ),
  }),
);

export const histories = createTable(
  "history",
  {
    id: serial("id").primaryKey(),
    createdById: integer("createdById")
      .notNull()
      .references(() => trackers.id),
    savedAt: timestamp("savedAt", { withTimezone: true, precision: 6 })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (tracker) => ({
    historySavedByIdIdx: index("historySavedAtId_idx").on(tracker.createdById),
  }),
);

export const userRole = pgEnum("role", ["admin", "employee"]);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  first_name: varchar("first_name", { length: 255 }),
  last_name: varchar("first_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  username: varchar("username", { length: 255 }),
  phone_number: varchar("phone_number", { length: 50 }),
  role: userRole("role"),
  company: varchar("company", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
