import { pgTable, uuid, text, timestamp, integer, jsonb, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['salesperson', 'admin']);
export const callOutcomeEnum = pgEnum('call_outcome', ['meeting-booked', 'nurture', 'disqualified', 'follow-up']);
export const sequenceStatusEnum = pgEnum('sequence_status', ['planned', 'active', 'completed']);
export const sequenceModeEnum = pgEnum('sequence_mode', ['standalone', 'imported', 'crm-sync']);
export const contactStatusEnum = pgEnum('contact_status', ['new', 'contacted', 'qualified', 'disqualified', 'closed']);

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

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  company: text('company').notNull(),
  name: text('name').notNull(),
  title: text('title'),
  phone: text('phone'),
  email: text('email'),
  linkedinUrl: text('linkedin_url'),
  industry: text('industry'),
  employeeCount: text('employee_count'),
  revenue: text('revenue'),
  personaType: text('persona_type'),
  status: contactStatusEnum('status').default('new').notNull(),
  tags: text('tags').array(),
  notes: text('notes'),
  companyIntelligence: jsonb('company_intelligence'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const callLogs = pgTable('call_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  leadId: text('lead_id').notNull(),
  contactId: uuid('contact_id').references(() => contacts.id),
  battleCardId: uuid('battle_card_id').references(() => battleCards.id),
  outcome: callOutcomeEnum('outcome').notNull(),
  intel: text('intel').notNull(),
  bestTalkingPoint: text('best_talking_point').notNull(),
  keyTakeaway: text('key_takeaway').notNull(),
  callDuration: integer('call_duration'),
  sequenceId: text('sequence_id'),
  startTime: text('start_time'),
  endTime: text('end_time'),
  attemptNumber: integer('attempt_number'),
  additionalInfo: jsonb('additional_info').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const battleCards = pgTable('battle_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id),
  leadData: jsonb('lead_data').notNull(),
  selectedContent: jsonb('selected_content').notNull().$type<any[]>(),
  dynamicIntelligence: text('dynamic_intelligence').array().notNull(),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const callSequences = pgTable('call_sequences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  contacts: jsonb('contacts').notNull().$type<any[]>(),
  contactIds: uuid('contact_ids').array(),
  totalContacts: integer('total_contacts'),
  contactedCount: integer('contacted_count').default(0),
  qualifiedCount: integer('qualified_count').default(0),
  status: sequenceStatusEnum('status').default('planned').notNull(),
  sprintSize: integer('sprint_size').notNull(),
  mode: sequenceModeEnum('mode').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Additional tables

export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  theme: text('theme').default('light'),
  advancedMode: boolean('advanced_mode').default(false),
  salesWizardMode: boolean('sales_wizard_mode').default(true),
  defaultPersona: text('default_persona'),
  searchConfig: jsonb('search_config'),
  uiPreferences: jsonb('ui_preferences'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const companyIntelligence = pgTable('company_intelligence', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: text('company_name').notNull().unique(),
  industry: text('industry'),
  employeeCount: text('employee_count'),
  revenue: text('revenue'),
  intelligenceData: jsonb('intelligence_data'),
  source: text('source'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  callLogs: many(callLogs),
  battleCards: many(battleCards),
  callSequences: many(callSequences),
  contacts: many(contacts),
  preferences: one(userPreferences)
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

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id]
  }),
  callLogs: many(callLogs),
  battleCards: many(battleCards)
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
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
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type CompanyIntelligence = typeof companyIntelligence.$inferSelect;
export type NewCompanyIntelligence = typeof companyIntelligence.$inferInsert;