/**
 * Audit Log Service
 *
 * Provides immutable audit logging for HIPAA compliance.
 * Logs are append-only and cannot be modified or deleted.
 */

import { db } from '../config/firebase';
import { encrypt, hash } from '../utils/encryption';

export interface AuditLogEntry {
  id?: string;
  userId: string;
  userEmail?: string;
  organizationId?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  changes?: AuditChanges;
  metadata?: Record<string, any>;
  checksum?: string; // For integrity verification
}

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'export'
  | 'login'
  | 'logout'
  | 'password_change'
  | 'consent_update'
  | 'deletion_request'
  | 'deletion_cancel'
  | 'role_change'
  | 'access_granted'
  | 'access_revoked';

export type AuditResource =
  | 'user'
  | 'session'
  | 'goal'
  | 'reflection'
  | 'conversation'
  | 'message'
  | 'tool_result'
  | 'stakeholder'
  | 'feedback'
  | 'coaching_program'
  | 'organization'
  | 'privacy_settings'
  | 'consent'
  | 'data_export';

export interface AuditChanges {
  before?: Record<string, any>;
  after?: Record<string, any>;
  fields?: string[];
}

export interface AuditQueryOptions {
  userId?: string;
  organizationId?: string;
  resource?: AuditResource;
  resourceId?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: string; // Last document ID for pagination
}

export class AuditService {
  private collection = db.collection('audit_logs');

  /**
   * Generate checksum for audit entry integrity
   */
  private generateChecksum(entry: Omit<AuditLogEntry, 'checksum' | 'id'>): string {
    const data = JSON.stringify({
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      timestamp: entry.timestamp.toISOString(),
      changes: entry.changes,
    });
    return hash(data);
  }

  /**
   * Create an immutable audit log entry
   */
  async log(entry: Omit<AuditLogEntry, 'timestamp' | 'checksum' | 'id'>): Promise<AuditLogEntry> {
    const timestamp = new Date();

    const logEntry: Omit<AuditLogEntry, 'id'> = {
      ...entry,
      timestamp,
      checksum: '', // Will be set below
    };

    // Generate checksum for integrity
    logEntry.checksum = this.generateChecksum(logEntry);

    // Encrypt sensitive metadata if present
    if (logEntry.changes?.before) {
      logEntry.changes.before = this.sanitizeChanges(logEntry.changes.before);
    }
    if (logEntry.changes?.after) {
      logEntry.changes.after = this.sanitizeChanges(logEntry.changes.after);
    }

    const docRef = await this.collection.add({
      ...logEntry,
      timestamp: logEntry.timestamp,
    });

    return { id: docRef.id, ...logEntry };
  }

  /**
   * Sanitize changes to remove highly sensitive data
   */
  private sanitizeChanges(changes: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'ssn', 'creditCard'];
    const sanitized = { ...changes };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Query audit logs by various criteria
   */
  async query(options: AuditQueryOptions): Promise<AuditLogEntry[]> {
    let query: FirebaseFirestore.Query = this.collection;

    if (options.userId) {
      query = query.where('userId', '==', options.userId);
    }

    if (options.organizationId) {
      query = query.where('organizationId', '==', options.organizationId);
    }

    if (options.resource) {
      query = query.where('resource', '==', options.resource);
    }

    if (options.resourceId) {
      query = query.where('resourceId', '==', options.resourceId);
    }

    if (options.action) {
      query = query.where('action', '==', options.action);
    }

    if (options.startDate) {
      query = query.where('timestamp', '>=', options.startDate);
    }

    if (options.endDate) {
      query = query.where('timestamp', '<=', options.endDate);
    }

    // Order by timestamp descending
    query = query.orderBy('timestamp', 'desc');

    // Pagination
    if (options.offset) {
      const lastDoc = await this.collection.doc(options.offset).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(options.limit || 50);

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as AuditLogEntry;
    });
  }

  /**
   * Get logs for a specific user (GDPR data access)
   */
  async getLogsForUser(userId: string, limit: number = 100): Promise<AuditLogEntry[]> {
    return this.query({ userId, limit });
  }

  /**
   * Get logs for a specific resource
   */
  async getLogsForResource(
    resource: AuditResource,
    resourceId: string,
    limit: number = 50
  ): Promise<AuditLogEntry[]> {
    return this.query({ resource, resourceId, limit });
  }

  /**
   * Get logs for an organization (admin view)
   */
  async getLogsForOrganization(
    organizationId: string,
    options?: Partial<AuditQueryOptions>
  ): Promise<AuditLogEntry[]> {
    return this.query({ ...options, organizationId });
  }

  /**
   * Verify audit log integrity
   */
  async verifyIntegrity(logId: string): Promise<boolean> {
    const doc = await this.collection.doc(logId).get();
    if (!doc.exists) return false;

    const data = doc.data() as AuditLogEntry;
    const storedChecksum = data.checksum;

    const calculatedChecksum = this.generateChecksum({
      ...data,
      timestamp: data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp),
    });

    return storedChecksum === calculatedChecksum;
  }

  /**
   * Log a login event
   */
  async logLogin(
    userId: string,
    userEmail: string,
    ipAddress?: string,
    userAgent?: string,
    organizationId?: string
  ): Promise<AuditLogEntry> {
    return this.log({
      userId,
      userEmail,
      organizationId,
      action: 'login',
      resource: 'user',
      resourceId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log a logout event
   */
  async logLogout(
    userId: string,
    userEmail: string,
    organizationId?: string
  ): Promise<AuditLogEntry> {
    return this.log({
      userId,
      userEmail,
      organizationId,
      action: 'logout',
      resource: 'user',
      resourceId: userId,
    });
  }

  /**
   * Log a data export event (GDPR)
   */
  async logDataExport(
    userId: string,
    userEmail: string,
    organizationId?: string,
    ipAddress?: string
  ): Promise<AuditLogEntry> {
    return this.log({
      userId,
      userEmail,
      organizationId,
      action: 'export',
      resource: 'data_export',
      resourceId: userId,
      ipAddress,
      metadata: {
        exportType: 'full_data',
        format: 'json',
      },
    });
  }

  /**
   * Log consent update (GDPR/CCPA)
   */
  async logConsentUpdate(
    userId: string,
    userEmail: string,
    changes: AuditChanges,
    organizationId?: string,
    ipAddress?: string
  ): Promise<AuditLogEntry> {
    return this.log({
      userId,
      userEmail,
      organizationId,
      action: 'consent_update',
      resource: 'consent',
      resourceId: userId,
      ipAddress,
      changes,
    });
  }

  /**
   * Log deletion request (GDPR Art. 17)
   */
  async logDeletionRequest(
    userId: string,
    userEmail: string,
    organizationId?: string,
    ipAddress?: string
  ): Promise<AuditLogEntry> {
    return this.log({
      userId,
      userEmail,
      organizationId,
      action: 'deletion_request',
      resource: 'user',
      resourceId: userId,
      ipAddress,
      metadata: {
        requestedAt: new Date().toISOString(),
        scheduledDeletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      },
    });
  }

  /**
   * Log deletion cancellation
   */
  async logDeletionCancel(
    userId: string,
    userEmail: string,
    organizationId?: string,
    ipAddress?: string
  ): Promise<AuditLogEntry> {
    return this.log({
      userId,
      userEmail,
      organizationId,
      action: 'deletion_cancel',
      resource: 'user',
      resourceId: userId,
      ipAddress,
    });
  }
}

// Export singleton instance
export const auditService = new AuditService();
