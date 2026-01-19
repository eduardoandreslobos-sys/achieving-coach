/**
 * Account Deletion Service
 *
 * Implements GDPR Article 17 - Right to Erasure ("Right to be Forgotten").
 * Provides 30-day grace period before permanent deletion.
 */

import { db } from '../config/firebase';
import { auditService } from './audit.service';
import { User, DeletionRequest } from '../models/user.model';

const DELETION_GRACE_PERIOD_DAYS = 30;

export interface DeletionRequestResult {
  success: boolean;
  deletionRequest: DeletionRequest;
  message: string;
}

export interface DeletionCancelResult {
  success: boolean;
  message: string;
}

export class AccountDeletionService {
  private usersCollection = db.collection('users');

  /**
   * Request account deletion (starts 30-day grace period)
   */
  async requestDeletion(
    userId: string,
    userEmail: string,
    reason?: string,
    organizationId?: string,
    ipAddress?: string
  ): Promise<DeletionRequestResult> {
    const userDoc = await this.usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;

    // Check if deletion is already pending
    if (userData.deletionRequest?.status === 'pending') {
      return {
        success: false,
        deletionRequest: userData.deletionRequest,
        message: 'Deletion request already pending',
      };
    }

    const now = new Date();
    const scheduledAt = new Date(
      now.getTime() + DELETION_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
    );

    const deletionRequest: DeletionRequest = {
      status: 'pending',
      requestedAt: now,
      scheduledAt,
      reason,
    };

    await this.usersCollection.doc(userId).update({
      status: 'pending_deletion',
      deletionRequest,
      updatedAt: now,
    });

    // Log for audit trail
    await auditService.logDeletionRequest(
      userId,
      userEmail,
      organizationId,
      ipAddress
    );

    return {
      success: true,
      deletionRequest,
      message: `Account scheduled for deletion on ${scheduledAt.toLocaleDateString()}. You can cancel this request anytime before then.`,
    };
  }

  /**
   * Cancel a pending deletion request
   */
  async cancelDeletion(
    userId: string,
    userEmail: string,
    organizationId?: string,
    ipAddress?: string
  ): Promise<DeletionCancelResult> {
    const userDoc = await this.usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;

    if (!userData.deletionRequest || userData.deletionRequest.status !== 'pending') {
      return {
        success: false,
        message: 'No pending deletion request found',
      };
    }

    const updatedDeletionRequest: DeletionRequest = {
      ...userData.deletionRequest,
      status: 'cancelled',
      cancelledAt: new Date(),
    };

    await this.usersCollection.doc(userId).update({
      status: 'active',
      deletionRequest: updatedDeletionRequest,
      updatedAt: new Date(),
    });

    // Log for audit trail
    await auditService.logDeletionCancel(
      userId,
      userEmail,
      organizationId,
      ipAddress
    );

    return {
      success: true,
      message: 'Deletion request cancelled successfully. Your account is active.',
    };
  }

  /**
   * Get deletion status for a user
   */
  async getDeletionStatus(userId: string): Promise<DeletionRequest | null> {
    const userDoc = await this.usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data() as User;
    return userData.deletionRequest || null;
  }

  /**
   * Process all scheduled deletions (called by scheduled function)
   */
  async processScheduledDeletions(): Promise<{ processed: number; errors: number }> {
    const now = new Date();
    let processed = 0;
    let errors = 0;

    const snapshot = await this.usersCollection
      .where('status', '==', 'pending_deletion')
      .where('deletionRequest.status', '==', 'pending')
      .get();

    for (const doc of snapshot.docs) {
      const userData = doc.data() as User;

      if (
        userData.deletionRequest?.scheduledAt &&
        new Date(userData.deletionRequest.scheduledAt) <= now
      ) {
        try {
          await this.executeAccountDeletion(doc.id, userData);
          processed++;
        } catch (error) {
          console.error(`Error deleting account ${doc.id}:`, error);
          errors++;
        }
      }
    }

    return { processed, errors };
  }

  /**
   * Execute the actual account deletion
   */
  private async executeAccountDeletion(userId: string, userData: User): Promise<void> {
    const batch = db.batch();

    // Collections to delete user data from
    const collectionsToDelete = [
      { name: 'goals', field: 'coacheeId' },
      { name: 'reflections', field: 'userId' },
      { name: 'tool_results', field: 'userId' },
      { name: 'notifications', field: 'userId' },
      { name: 'consent_records', field: 'userId' },
      { name: 'stakeholders', field: 'coacheeId' },
      { name: 'icf_simulation_results', field: 'userId' },
    ];

    // Delete data from each collection
    for (const { name, field } of collectionsToDelete) {
      const snapshot = await db.collection(name).where(field, '==', userId).get();
      for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
      }
    }

    // Handle sessions - anonymize instead of delete (preserve coach records)
    await this.anonymizeSessions(userId);

    // Handle conversations - anonymize messages
    await this.anonymizeConversations(userId);

    // Handle coaching programs - remove user reference
    await this.removeFromCoachingPrograms(userId);

    // Mark user record as deleted (keep for audit purposes)
    batch.update(this.usersCollection.doc(userId), {
      status: 'deleted',
      email: `deleted-${userId}@anonymized.local`,
      displayName: 'Deleted User',
      firstName: null,
      lastName: null,
      phone: null,
      photoURL: null,
      'deletionRequest.status': 'completed',
      'deletionRequest.processedAt': new Date(),
      updatedAt: new Date(),
    });

    await batch.commit();

    // Log completion
    await auditService.log({
      userId,
      userEmail: userData.email,
      organizationId: userData.organizationId,
      action: 'delete',
      resource: 'user',
      resourceId: userId,
      metadata: {
        deletionType: 'gdpr_request',
        processedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Anonymize sessions instead of deleting
   */
  private async anonymizeSessions(userId: string): Promise<void> {
    const [coachSessions, coacheeSessions] = await Promise.all([
      db.collection('sessions').where('coachId', '==', userId).get(),
      db.collection('sessions').where('coacheeId', '==', userId).get(),
    ]);

    const batch = db.batch();

    for (const doc of coachSessions.docs) {
      batch.update(doc.ref, {
        coachId: 'deleted-user',
        coachName: 'Deleted User',
      });
    }

    for (const doc of coacheeSessions.docs) {
      batch.update(doc.ref, {
        coacheeId: 'deleted-user',
        coacheeName: 'Deleted User',
        // Clear private notes
        notes: null,
        privateNotes: null,
      });
    }

    await batch.commit();
  }

  /**
   * Anonymize conversations
   */
  private async anonymizeConversations(userId: string): Promise<void> {
    const snapshot = await db
      .collection('conversations')
      .where('participants', 'array-contains', userId)
      .get();

    for (const doc of snapshot.docs) {
      const convData = doc.data();
      const updatedParticipants = convData.participants.map((p: string) =>
        p === userId ? 'deleted-user' : p
      );

      await doc.ref.update({
        participants: updatedParticipants,
      });

      // Anonymize messages from this user
      const messagesSnapshot = await doc.ref
        .collection('messages')
        .where('senderId', '==', userId)
        .get();

      const batch = db.batch();
      for (const msgDoc of messagesSnapshot.docs) {
        batch.update(msgDoc.ref, {
          senderId: 'deleted-user',
          senderName: 'Deleted User',
          content: '[Message removed due to account deletion]',
        });
      }
      await batch.commit();
    }
  }

  /**
   * Remove user from coaching programs
   */
  private async removeFromCoachingPrograms(userId: string): Promise<void> {
    const [coachPrograms, coacheePrograms] = await Promise.all([
      db.collection('coaching_programs').where('coachId', '==', userId).get(),
      db.collection('coaching_programs').where('coacheeId', '==', userId).get(),
    ]);

    const batch = db.batch();

    for (const doc of coachPrograms.docs) {
      batch.update(doc.ref, {
        coachId: 'deleted-user',
        status: 'archived',
      });
    }

    for (const doc of coacheePrograms.docs) {
      batch.update(doc.ref, {
        coacheeId: 'deleted-user',
        status: 'archived',
      });
    }

    await batch.commit();
  }

  /**
   * Check if user can be deleted (no pending obligations)
   */
  async canDelete(userId: string): Promise<{ canDelete: boolean; reason?: string }> {
    // Check for active coaching programs as a coach
    const activePrograms = await db
      .collection('coaching_programs')
      .where('coachId', '==', userId)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (!activePrograms.empty) {
      return {
        canDelete: false,
        reason: 'You have active coaching programs. Please archive or transfer them first.',
      };
    }

    return { canDelete: true };
  }
}

// Export singleton instance
export const accountDeletionService = new AccountDeletionService();
