import { db } from '@/db';
import { users, callLogs, battleCards, callSequences, contacts, userPreferences, companyIntelligence, type CallLog, type BattleCard, type CallSequence, type Contact as DatabaseContact, type NewContact, type UserPreferences, type CompanyIntelligence } from '@/db/schema';
import { eq, desc, and, inArray, or, ilike } from 'drizzle-orm';

// User operations
export const userService = {
  async create(data: { email: string; name: string; role?: 'salesperson' | 'admin' }) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async updateLastLogin(userId: string) {
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, userId));
  }
};

// Call log operations
export const callLogService = {
  async create(data: Omit<CallLog, 'id' | 'createdAt'>) {
    const [log] = await db.insert(callLogs).values(data).returning();
    return log;
  },

  async getByUser(userId: string, limit = 50) {
    return db.select()
      .from(callLogs)
      .where(eq(callLogs.userId, userId))
      .orderBy(desc(callLogs.createdAt))
      .limit(limit);
  },

  async getBySequence(userId: string, sequenceId: string) {
    return db.select()
      .from(callLogs)
      .where(and(
        eq(callLogs.userId, userId),
        eq(callLogs.sequenceId, sequenceId)
      ))
      .orderBy(desc(callLogs.createdAt));
  }
};

// Battle card operations
export const battleCardService = {
  async create(data: Omit<BattleCard, 'id' | 'createdAt'>) {
    const [card] = await db.insert(battleCards).values(data).returning();
    return card;
  },

  async getByUser(userId: string, limit = 20) {
    return db.select()
      .from(battleCards)
      .where(eq(battleCards.userId, userId))
      .orderBy(desc(battleCards.createdAt))
      .limit(limit);
  },

  async getById(id: string, userId: string) {
    const [card] = await db.select()
      .from(battleCards)
      .where(and(
        eq(battleCards.id, id),
        eq(battleCards.userId, userId)
      ));
    return card;
  }
};

// Call sequence operations
export const callSequenceService = {
  async create(data: Omit<CallSequence, 'id' | 'createdAt'>) {
    const [sequence] = await db.insert(callSequences).values(data).returning();
    return sequence;
  },

  async getByUser(userId: string) {
    return db.select()
      .from(callSequences)
      .where(eq(callSequences.userId, userId))
      .orderBy(desc(callSequences.createdAt));
  },

  async updateStatus(id: string, userId: string, status: 'planned' | 'active' | 'completed') {
    await db.update(callSequences)
      .set({ status })
      .where(and(
        eq(callSequences.id, id),
        eq(callSequences.userId, userId)
      ));
  },

  async updateContacts(id: string, userId: string, contacts: any[]) {
    await db.update(callSequences)
      .set({ contacts })
      .where(and(
        eq(callSequences.id, id),
        eq(callSequences.userId, userId)
      ));
  }
};

// Analytics operations
export const analyticsService = {
  async getCallStats(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const logs = await db.select()
      .from(callLogs)
      .where(and(
        eq(callLogs.userId, userId),
        // Note: You might want to add a date filter here
      ));

    const stats = {
      total: logs.length,
      meetingsBooked: logs.filter((l: CallLog) => l.outcome === 'meeting-booked').length,
      nurture: logs.filter((l: CallLog) => l.outcome === 'nurture').length,
      disqualified: logs.filter((l: CallLog) => l.outcome === 'disqualified').length,
      followUp: logs.filter((l: CallLog) => l.outcome === 'follow-up').length,
    };

    return stats;
  },

  async getTopTalkingPoints(userId: string, limit = 5) {
    const logs = await db.select()
      .from(callLogs)
      .where(eq(callLogs.userId, userId))
      .orderBy(desc(callLogs.createdAt))
      .limit(100);

    // Aggregate talking points
    const talkingPointCounts = logs.reduce((acc: Record<string, number>, log: CallLog) => {
      const point = log.bestTalkingPoint;
      acc[point] = (acc[point] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort and return top N
    return Object.entries(talkingPointCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, limit)
      .map(([point, count]) => ({ point, count }));
  }
};

// Contact operations
export const contactService = {
  async create(data: Omit<NewContact, 'id' | 'createdAt' | 'updatedAt'>) {
    const [contact] = await db.insert(contacts).values(data).returning();
    return contact;
  },

  async bulkCreate(userId: string, contactsData: Omit<NewContact, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]) {
    const contactsToInsert = contactsData.map(c => ({ ...c, userId }));
    return db.insert(contacts).values(contactsToInsert).returning();
  },

  async getByUser(userId: string, filters?: {
    status?: string;
    personaType?: string;
    industry?: string;
    search?: string;
  }) {
    let query = db.select().from(contacts).where(eq(contacts.userId, userId));

    if (filters) {
      const conditions = [eq(contacts.userId, userId)];
      
      if (filters.status) {
        conditions.push(eq(contacts.status, filters.status as any));
      }
      if (filters.personaType) {
        conditions.push(eq(contacts.personaType, filters.personaType));
      }
      if (filters.industry) {
        conditions.push(eq(contacts.industry, filters.industry));
      }
      if (filters.search) {
        const searchCondition = or(
          ilike(contacts.name, `%${filters.search}%`),
          ilike(contacts.company, `%${filters.search}%`),
          ilike(contacts.title, `%${filters.search}%`)
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }
      
      query = db.select().from(contacts).where(and(...conditions));
    }

    return query.orderBy(desc(contacts.createdAt));
  },

  async getByIds(contactIds: string[]) {
    if (!contactIds.length) return [];
    return db.select()
      .from(contacts)
      .where(inArray(contacts.id, contactIds));
  },

  async getById(id: string, userId: string) {
    const [contact] = await db.select()
      .from(contacts)
      .where(and(
        eq(contacts.id, id),
        eq(contacts.userId, userId)
      ));
    return contact;
  },

  async update(id: string, userId: string, data: Partial<DatabaseContact>) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = data;
    await db.update(contacts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(and(
        eq(contacts.id, id),
        eq(contacts.userId, userId)
      ));
  },

  async updateStatus(id: string, userId: string, status: DatabaseContact['status']) {
    await db.update(contacts)
      .set({ status, updatedAt: new Date() })
      .where(and(
        eq(contacts.id, id),
        eq(contacts.userId, userId)
      ));
  },

  async delete(id: string, userId: string) {
    await db.delete(contacts)
      .where(and(
        eq(contacts.id, id),
        eq(contacts.userId, userId)
      ));
  }
};

// User preferences operations
export const userPreferencesService = {
  async getOrCreate(userId: string) {
    const [existing] = await db.select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    
    if (existing) return existing;
    
    // Create default preferences
    const [newPrefs] = await db.insert(userPreferences)
      .values({ userId })
      .returning();
    
    return newPrefs;
  },

  async update(userId: string, data: Partial<UserPreferences>) {
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = data;
    
    await db.update(userPreferences)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId));
  },

  async getTheme(userId: string) {
    const prefs = await this.getOrCreate(userId);
    return prefs.theme;
  },

  async setTheme(userId: string, theme: 'light' | 'dark') {
    await this.update(userId, { theme });
  }
};

// Company intelligence operations
export const companyIntelligenceService = {
  async get(companyName: string) {
    const [intel] = await db.select()
      .from(companyIntelligence)
      .where(eq(companyIntelligence.companyName, companyName));
    
    // Check if expired
    if (intel && intel.expiresAt && new Date(intel.expiresAt) < new Date()) {
      await this.delete(companyName);
      return null;
    }
    
    return intel;
  },

  async set(data: Omit<CompanyIntelligence, 'id' | 'createdAt' | 'updatedAt'>) {
    const existing = await this.get(data.companyName);
    
    if (existing) {
      await db.update(companyIntelligence)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(companyIntelligence.companyName, data.companyName));
    } else {
      await db.insert(companyIntelligence).values(data);
    }
  },

  async delete(companyName: string) {
    await db.delete(companyIntelligence)
      .where(eq(companyIntelligence.companyName, companyName));
  },

  async cleanup() {
    // Delete expired entries
    const now = new Date();
    // Note: This would need proper SQL comparison for timestamp
    // For now, we'll fetch and filter in memory
    const allIntel = await db.select().from(companyIntelligence);
    const expired = allIntel.filter((intel: any) => 
      intel.expiresAt && new Date(intel.expiresAt) < now
    );
    
    for (const intel of expired) {
      await this.delete(intel.companyName);
    }
  }
};

// Export a unified service object
export const NetlifyDatabaseService = {
  userService,
  callLogService,
  battleCardService,
  callSequenceService,
  analyticsService,
  contactService,
  userPreferencesService,
  companyIntelligenceService
};