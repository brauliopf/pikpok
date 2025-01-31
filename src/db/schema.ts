import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";

export const Playing_with_neon = pgTable("playing_with_neon", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: decimal("value"),
});

export const Users = pgTable("users", {
  custoemrid: serial("id").primaryKey(),
  custoemrname: text("customername").notNull(),
  lastname: text("lastname"),
  // lastname: varchar('email', { length: 255 }).notNull().unique(),
  country: text("country"),
  age: integer("age"),
  gender_male: boolean("gender_male"),
});
