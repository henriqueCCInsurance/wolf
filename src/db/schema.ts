import { pgTable, uuid, text, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['salesperson', 'admin']);
export const callOutcomeEnum = pgEnum('call_outcome', ['meeting-booked', 'nurture', 'disqualified', 'follow-up']);
export const sequenceStatusEnum = pgEnum('sequence_status', ['planned', 'active', 'completed']);
export const sequenceModeEnum = pgEnum('sequence_mode', ['standalone', 'imported', 'crm-sync']);

// Tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').default('salesperson').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
  settings: jsonb('settings').default({})
});

export const callLogs = pgTable('call_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  leadId: text('lead_id').notNull(),
  outcome: callOutcomeEnum('outcome').notNull(),
  intel: text('intel').notNull(),
  bestTalkingPoint: text('best_talking_point').notNull(),
  keyTakeaway: text('key_takeaway').notNull(),
  callDuration: integer('call_duration'),
  sequenceId: text('sequence_id'),
  contactId: text('contact_id'),
  startTime: text('start_time'),
  endTime: text('end_time'),
  attemptNumber: integer('attempt_number'),
  additionalInfo: jsonb('additional_info').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const battleCards = pgTable('battle_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  leadData: jsonb('lead_data').notNull(),
  selectedContent: jsonb('selected_content').notNull().$type<any[]>(),
  dynamicIntelligence: text('dynamic_intelligence').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const callSequences = pgTable('call_sequences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  contacts: jsonb('contacts').notNull().$type<any[]>(),
  status: sequenceStatusEnum('status').default('planned').notNull(),
  sprintSize: integer('sprint_size').notNull(),
  mode: sequenceModeEnum('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  callLogs: many(callLogs),
  battleCards: many(battleCards),
  callSequences: many(callSequences)
}));

export const callLogsRelations = relations(callLogs, ({ one }) => ({
  user: one(users, {
    fields: [callLogs.userId],
    references: [users.id]
  })
}));

export const battleCardsRelations = relations(battleCards, ({ one }) => ({
  user: one(users, {
    fields: [battleCards.userId],
    references: [users.id]
  })
}));

export const callSequencesRelations = relations(callSequences, ({ one }) => ({
  user: one(users, {
    fields: [callSequences.userId],
    references: [users.id]
  })
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CallLog = typeof callLogs.$inferSelect;
export type NewCallLog = typeof callLogs.$inferInsert;
export type BattleCard = typeof battleCards.$inferSelect;
export type NewBattleCard = typeof battleCards.$inferInsert;
export type CallSequence = typeof callSequences.$inferSelect;
export type NewCallSequence = typeof callSequences.$inferInsert;