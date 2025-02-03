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

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  country: text("country"),
  age: integer("age"),
  genderMale: boolean("gender_male"),
  profileImageURL: text("profile_image_url"),
});

export const videos = pgTable("videos", {
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
