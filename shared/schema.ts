import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// PA Appeal Cases
export const appealCases = pgTable("appeal_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientName: text("patient_name").notNull(),
  patientEmail: text("patient_email").notNull(),
  insurerName: text("insurer_name").notNull(),
  planType: text("plan_type").notNull(), // medicare, medicaid, employer, marketplace, other
  memberId: text("member_id"),
  deniedItem: text("denied_item").notNull(), // drug/procedure/service denied
  deniedCode: text("denied_code"), // CPT or NDC code if known
  diagnosisCode: text("diagnosis_code"), // ICD-10 code if known
  denialReason: text("denial_reason").notNull(), // insurer's stated reason
  denialDate: text("denial_date"),
  additionalContext: text("additional_context"),
  denialLetterText: text("denial_letter_text"), // extracted text from uploaded denial letter/EOB
  status: text("status").notNull().default("draft"), // draft | generating | ready | submitted | won | lost
  appealLetter: text("appeal_letter"), // generated appeal text (mutable — advocate edits this)
  appealLetterOriginal: text("appeal_letter_original"), // raw Claude output, never modified
  appealLetterGeneratedAt: timestamp("appeal_letter_generated_at"),
  advocateNotes: text("advocate_notes"),
  advocateApprovedAt: timestamp("advocate_approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAppealCaseSchema = createInsertSchema(appealCases).pick({
  patientName: true,
  patientEmail: true,
  insurerName: true,
  planType: true,
  memberId: true,
  deniedItem: true,
  deniedCode: true,
  diagnosisCode: true,
  denialReason: true,
  denialDate: true,
  additionalContext: true,
});

export type InsertAppealCase = z.infer<typeof insertAppealCaseSchema>;
export type AppealCase = typeof appealCases.$inferSelect;
