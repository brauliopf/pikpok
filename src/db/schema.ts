import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  clerk_id: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  country: text("country"),
  age: integer("age"),
  genderMale: boolean("gender_male"),
  profileImageURL: text("profile_image_url"),
  onboarded: boolean("onboarded").notNull().default(false),
  videoDuration: text("videoDuration"),
  topicsOfInterest: text("topics_of_interest").array(),
  embeddings: vector("embeddings", { dimensions: 768 }).default([]),
});

export const videoStatusEnum = pgEnum("status", [
  "created",
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  s3Key: text("s3_key").notNull(),
  title: text("title").notNull(),
  status: videoStatusEnum().default("created").notNull(),
  description: text("description"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  aisummary: text("aisummary"),
  interests: text("interests"),
  embeddings: vector("embeddings", { dimensions: 768 }).default([]),
});
