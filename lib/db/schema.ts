import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: text("provider_id").unique().notNull(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    avatar: text("avatar"),
    createdAt: timestamp("created_at").defaultNow(),
    lastLoginAt: timestamp("last_login_at").defaultNow(),
  },
  (t) => ({
    providerIdx: index("provider_id_idx").on(t.providerId),
  })
);

export const simulations = pgTable(
  "simulations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    html: text("html").notNull(),
    slug: text("slug").unique().notNull(),
    title: text("title"),
    createdAt: timestamp("created_at").defaultNow(),
    views: integer("views").default(0),
  },
  (t) => ({
    slugIdx: index("slug_idx").on(t.slug),
    userIdx: index("user_id_idx").on(t.userId),
    createdIdx: index("created_at_idx").on(t.createdAt),
  })
);

export type User = typeof users.$inferSelect;
export type Simulation = typeof simulations.$inferSelect;
