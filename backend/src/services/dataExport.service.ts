/**
 * Data Export Service
 *
 * Implements GDPR Article 20 - Right to Data Portability.
 * Exports all user data in a portable JSON format.
 */

import { db } from '../config/firebase';
import { auditService } from './audit.service';
import { decryptFields, SENSITIVE_FIELDS } from '../utils/encryption';
import { User } from '../models/user.model';

export interface ExportedData {
  exportInfo: {
    exportedAt: string;
    userId: string;
    userEmail: string;
    version: string;
    format: string;
  };
  profile: Partial<User>;
  sessions: any[];
  goals: any[];
  reflections: any[];
  toolResults: any[];
  conversations: any[];
  stakeholderFeedback: any[];
  coachingPrograms: any[];
  notifications: any[];
  icfSimulations: any[];
  consentHistory: any[];
  auditLogs: any[];
}

export class DataExportService {
  private async getCollection(
    collectionName: string,
    userId: string,
    userField: string = 'userId'
  ): Promise<any[]> {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where(userField, '==', userId)
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert Firestore timestamps to ISO strings
        return this.convertTimestamps({
          id: doc.id,
          ...data,
        });
      });
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  }

  private convertTimestamps(obj: any): any {
    if (!obj) return obj;

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        if ('toDate' in value && typeof value.toDate === 'function') {
          result[key] = value.toDate().toISOString();
        } else if (Array.isArray(value)) {
          result[key] = value.map((item) => this.convertTimestamps(item));
        } else {
          result[key] = this.convertTimestamps(value);
        }
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  private sanitizeProfile(user: User): Partial<User> {
    // Remove internal/sensitive fields from profile export
    const {
      organizationId, // Keep for context
      ...profile
    } = user;

    return {
      ...profile,
      organizationId,
    };
  }

  /**
   * Export all user data (GDPR Art. 20)
   */
  async exportUserData(
    userId: string,
    userEmail: string,
    organizationId?: string,
    ipAddress?: string
  ): Promise<ExportedData> {
    // Fetch user profile
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;

    // Fetch all user-related data in parallel
    const [
      sessions,
      goals,
      reflections,
      toolResults,
      conversations,
      stakeholderFeedback,
      coachingPrograms,
      notifications,
      icfSimulations,
      consentRecords,
      auditLogs,
    ] = await Promise.all([
      // Sessions where user is coach or coachee
      this.getSessionsForUser(userId),
      // Goals
      this.getCollection('goals', userId, 'coacheeId'),
      // Reflections
      this.getCollection('reflections', userId),
      // Tool results
      this.getCollection('tool_results', userId),
      // Conversations
      this.getConversationsForUser(userId),
      // Stakeholder feedback
      this.getCollection('stakeholder_feedback', userId, 'coacheeId'),
      // Coaching programs
      this.getCoachingProgramsForUser(userId),
      // Notifications
      this.getCollection('notifications', userId),
      // ICF simulations
      this.getCollection('icf_simulation_results', userId),
      // Consent records
      this.getCollection('consent_records', userId),
      // Audit logs (user's own activity)
      this.getCollection('audit_logs', userId),
    ]);

    // Decrypt sensitive fields before export
    const decryptedSessions = sessions.map((s) =>
      decryptFields(s, SENSITIVE_FIELDS.sessions)
    );
    const decryptedReflections = reflections.map((r) =>
      decryptFields(r, SENSITIVE_FIELDS.reflections)
    );
    const decryptedGoals = goals.map((g) =>
      decryptFields(g, SENSITIVE_FIELDS.goals)
    );
    const decryptedToolResults = toolResults.map((t) =>
      decryptFields(t, SENSITIVE_FIELDS.tool_results)
    );

    const exportData: ExportedData = {
      exportInfo: {
        exportedAt: new Date().toISOString(),
        userId,
        userEmail,
        version: '1.0.0',
        format: 'JSON',
      },
      profile: this.sanitizeProfile(this.convertTimestamps(userData)),
      sessions: decryptedSessions,
      goals: decryptedGoals,
      reflections: decryptedReflections,
      toolResults: decryptedToolResults,
      conversations: conversations,
      stakeholderFeedback: stakeholderFeedback,
      coachingPrograms: coachingPrograms,
      notifications: notifications,
      icfSimulations: icfSimulations,
      consentHistory: consentRecords,
      auditLogs: auditLogs.slice(0, 100), // Limit audit logs
    };

    // Log the export for audit trail
    await auditService.logDataExport(
      userId,
      userEmail,
      organizationId,
      ipAddress
    );

    return exportData;
  }

  /**
   * Get sessions where user is coach or coachee
   */
  private async getSessionsForUser(userId: string): Promise<any[]> {
    const [coachSessions, coacheeSessions] = await Promise.all([
      this.getCollection('sessions', userId, 'coachId'),
      this.getCollection('sessions', userId, 'coacheeId'),
    ]);

    // Deduplicate
    const sessionMap = new Map<string, any>();
    for (const session of [...coachSessions, ...coacheeSessions]) {
      sessionMap.set(session.id, session);
    }

    return Array.from(sessionMap.values());
  }

  /**
   * Get conversations where user is a participant
   */
  private async getConversationsForUser(userId: string): Promise<any[]> {
    try {
      const snapshot = await db
        .collection('conversations')
        .where('participants', 'array-contains', userId)
        .get();

      const conversations = [];

      for (const doc of snapshot.docs) {
        const convData = doc.data();

        // Fetch messages for each conversation
        const messagesSnapshot = await db
          .collection('conversations')
          .doc(doc.id)
          .collection('messages')
          .orderBy('createdAt', 'asc')
          .limit(500) // Limit messages per conversation
          .get();

        const messages = messagesSnapshot.docs.map((msgDoc) => {
          const msgData = msgDoc.data();
          return decryptFields(
            this.convertTimestamps({
              id: msgDoc.id,
              ...msgData,
            }),
            SENSITIVE_FIELDS.messages
          );
        });

        conversations.push(
          this.convertTimestamps({
            id: doc.id,
            ...convData,
            messages,
          })
        );
      }

      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  /**
   * Get coaching programs for user
   */
  private async getCoachingProgramsForUser(userId: string): Promise<any[]> {
    const [coachPrograms, coacheePrograms] = await Promise.all([
      this.getCollection('coaching_programs', userId, 'coachId'),
      this.getCollection('coaching_programs', userId, 'coacheeId'),
    ]);

    const programMap = new Map<string, any>();
    for (const program of [...coachPrograms, ...coacheePrograms]) {
      programMap.set(program.id, program);
    }

    return Array.from(programMap.values());
  }

  /**
   * Generate export filename
   */
  generateFilename(userId: string): string {
    const date = new Date().toISOString().split('T')[0];
    return `achievingcoach-data-export-${userId}-${date}.json`;
  }
}

// Export singleton instance
export const dataExportService = new DataExportService();
