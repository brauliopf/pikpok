import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const Playing_with_neon = pgTable("playing_with_neon", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: decimal("value"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  lastName: text("lastname"),
  country: text("country"),
  age: integer("age"),
  genderMale: boolean("gender_male"),
});

export const videos = pgTable("tables", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  s3Key: text("s3_key").notNull(),
  metadata: jsonb("metadata"), // tags, categories, etc.
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
});
