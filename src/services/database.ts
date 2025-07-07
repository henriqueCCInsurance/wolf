import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import type { CallLog, BattleCard, CallSequence, User } from '@/types'

type Tables = Database['public']['Tables']
type UserRow = Tables['users']['Row']
type CallLogRow = Tables['call_logs']['Row']
type BattleCardRow = Tables['battle_cards']['Row']
type CallSequenceRow = Tables['call_sequences']['Row']

export class DatabaseService {
  // User operations
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !userProfile) return null

    return this.mapUserRowToUser(userProfile)
  }

  static async updateUserProfile(userId: string, updates: Partial<UserRow>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return this.mapUserRowToUser(data)
  }

  static async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapUserRowToUser)
  }

  // Call log operations
  static async getCallLogs(userId: string): Promise<CallLog[]> {
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapCallLogRowToCallLog)
  }

  static async addCallLog(callLog: Omit<CallLog, 'id' | 'createdAt'>): Promise<CallLog> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('call_logs')
      .insert({
        user_id: user.id,
        lead_id: callLog.leadId,
        outcome: callLog.outcome,
        intel: callLog.intel,
        best_talking_point: callLog.bestTalkingPoint,
        key_takeaway: callLog.keyTakeaway,
        call_duration: callLog.callDuration,
        sequence_id: callLog.sequenceId,
        contact_id: callLog.contactId,
        start_time: callLog.startTime?.toISOString(),
        end_time: callLog.endTime?.toISOString(),
        attempt_number: callLog.attemptNumber,
        additional_info: callLog.additionalInfo || {}
      })
      .select()
      .single()

    if (error) throw error
    return this.mapCallLogRowToCallLog(data)
  }

  static async updateCallLog(id: string, updates: Partial<CallLog>): Promise<CallLog> {
    const { data, error } = await supabase
      .from('call_logs')
      .update({
        ...(updates.outcome && { outcome: updates.outcome }),
        ...(updates.intel && { intel: updates.intel }),
        ...(updates.bestTalkingPoint && { best_talking_point: updates.bestTalkingPoint }),
        ...(updates.keyTakeaway && { key_takeaway: updates.keyTakeaway }),
        ...(updates.callDuration && { call_duration: updates.callDuration }),
        ...(updates.sequenceId && { sequence_id: updates.sequenceId }),
        ...(updates.contactId && { contact_id: updates.contactId }),
        ...(updates.startTime && { start_time: updates.startTime.toISOString() }),
        ...(updates.endTime && { end_time: updates.endTime.toISOString() }),
        ...(updates.attemptNumber && { attempt_number: updates.attemptNumber }),
        ...(updates.additionalInfo && { additional_info: updates.additionalInfo })
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapCallLogRowToCallLog(data)
  }

  static async getCallLogsForContact(contactId: string): Promise<CallLog[]> {
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapCallLogRowToCallLog)
  }

  // Battle card operations
  static async getBattleCards(userId: string): Promise<BattleCard[]> {
    const { data, error } = await supabase
      .from('battle_cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapBattleCardRowToBattleCard)
  }

  static async addBattleCard(battleCard: Omit<BattleCard, 'generatedAt'>): Promise<BattleCard> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('battle_cards')
      .insert({
        user_id: user.id,
        lead_data: battleCard.lead,
        selected_content: battleCard.selectedContent,
        dynamic_intelligence: battleCard.dynamicIntelligence
      })
      .select()
      .single()

    if (error) throw error
    return this.mapBattleCardRowToBattleCard(data)
  }

  // Call sequence operations
  static async getCallSequences(userId: string): Promise<CallSequence[]> {
    const { data, error } = await supabase
      .from('call_sequences')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.mapCallSequenceRowToCallSequence)
  }

  static async addCallSequence(sequence: Omit<CallSequence, 'id' | 'createdAt' | 'createdBy'>): Promise<CallSequence> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('call_sequences')
      .insert({
        user_id: user.id,
        name: sequence.name,
        contacts: sequence.contacts,
        status: sequence.status,
        sprint_size: sequence.sprintSize,
        mode: sequence.mode
      })
      .select()
      .single()

    if (error) throw error
    return this.mapCallSequenceRowToCallSequence(data)
  }

  static async updateCallSequence(id: string, updates: Partial<CallSequence>): Promise<CallSequence> {
    const { data, error } = await supabase
      .from('call_sequences')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.contacts && { contacts: updates.contacts }),
        ...(updates.status && { status: updates.status }),
        ...(updates.sprintSize && { sprint_size: updates.sprintSize }),
        ...(updates.mode && { mode: updates.mode })
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.mapCallSequenceRowToCallSequence(data)
  }

  // Real-time subscriptions
  static subscribeToCallLogs(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('call_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'call_logs',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  static subscribeToCallSequences(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('call_sequences_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'call_sequences',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }

  // Mapper functions
  private static mapUserRowToUser(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as 'salesperson' | 'admin',
      avatar: row.avatar || undefined,
      createdAt: new Date(row.created_at),
      lastLogin: row.last_login ? new Date(row.last_login) : undefined,
      settings: row.settings as any
    }
  }

  private static mapCallLogRowToCallLog(row: CallLogRow): CallLog {
    return {
      id: row.id,
      leadId: row.lead_id,
      outcome: row.outcome as 'meeting-booked' | 'nurture' | 'disqualified' | 'follow-up',
      intel: row.intel,
      bestTalkingPoint: row.best_talking_point,
      keyTakeaway: row.key_takeaway,
      createdAt: new Date(row.created_at),
      callDuration: row.call_duration || undefined,
      sequenceId: row.sequence_id || undefined,
      contactId: row.contact_id || undefined,
      startTime: row.start_time ? new Date(row.start_time) : undefined,
      endTime: row.end_time ? new Date(row.end_time) : undefined,
      attemptNumber: row.attempt_number || undefined,
      additionalInfo: row.additional_info as any
    }
  }

  private static mapBattleCardRowToBattleCard(row: BattleCardRow): BattleCard {
    return {
      lead: row.lead_data as any,
      selectedContent: row.selected_content as any,
      dynamicIntelligence: row.dynamic_intelligence,
      generatedAt: new Date(row.created_at)
    }
  }

  private static mapCallSequenceRowToCallSequence(row: CallSequenceRow): CallSequence {
    return {
      id: row.id,
      name: row.name,
      contacts: row.contacts as any,
      createdBy: row.user_id,
      createdAt: new Date(row.created_at),
      status: row.status as 'planned' | 'active' | 'completed',
      sprintSize: row.sprint_size,
      mode: row.mode as 'standalone' | 'imported' | 'crm-sync'
    }
  }
}