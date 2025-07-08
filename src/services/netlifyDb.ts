import { db } from '@/db';
import { users, callLogs, battleCards, callSequences, type CallLog, type BattleCard, type CallSequence } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

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
      meetingsBooked: logs.filter((l: any) => l.outcome === 'meeting-booked').length,
      nurture: logs.filter((l: any) => l.outcome === 'nurture').length,
      disqualified: logs.filter((l: any) => l.outcome === 'disqualified').length,
      followUp: logs.filter((l: any) => l.outcome === 'follow-up').length,
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
    const talkingPointCounts = logs.reduce((acc: Record<string, number>, log: any) => {
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

// Export a unified service object
export const NetlifyDatabaseService = {
  userService,
  callLogService,
  battleCardService,
  callSequenceService,
  analyticsService
};