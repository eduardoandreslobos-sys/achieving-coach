/**
 * Audit Routes
 *
 * Admin-only API endpoints for viewing audit logs.
 * Required for HIPAA compliance and security monitoring.
 */

import { Router, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { auditService, AuditResource, AuditAction } from '../services/audit.service';
import { rbacService } from '../services/rbac.service';
import { db } from '../config/firebase';
import { User } from '../models/user.model';

const router = Router();

interface AuditRequest extends AuthRequest {
  userData?: User;
}

/**
 * Middleware to check admin access for audit logs
 */
async function requireAuditAccess(req: AuditRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get full user profile to check role
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(403).json({ error: 'User profile not found' });
    }

    const userData = userDoc.data() as User;
    const accessCheck = rbacService.canAccessAuditLogs(userData);

    if (!accessCheck.allowed) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view audit logs',
      });
    }

    // Attach full user data for scope checking
    req.userData = userData;
    next();
  } catch (error) {
    console.error('Error checking audit access:', error);
    res.status(500).json({ error: 'Failed to verify access' });
  }
}

/**
 * GET /api/v1/audit/logs
 * Get audit logs for the organization (admin only)
 */
router.get('/logs', authenticate, requireAuditAccess as any, async (req: AuditRequest, res: Response) => {
  try {
    const userData = req.userData as User;
    const {
      userId,
      resource,
      action,
      startDate,
      endDate,
      limit = '50',
      offset,
    } = req.query;

    const logs = await auditService.query({
      organizationId: userData.organizationId,
      userId: userId as string | undefined,
      resource: resource as AuditResource | undefined,
      action: action as AuditAction | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: Math.min(parseInt(limit as string, 10), 100),
      offset: offset as string | undefined,
    });

    res.json({
      logs,
      count: logs.length,
      hasMore: logs.length === parseInt(limit as string, 10),
    });
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

/**
 * GET /api/v1/audit/resource/:type/:id
 * Get audit logs for a specific resource
 */
router.get(
  '/resource/:type/:id',
  authenticate,
  requireAuditAccess as any,
  async (req: AuditRequest, res: Response) => {
    try {
      const { type, id } = req.params;
      const { limit = '50' } = req.query;

      const logs = await auditService.getLogsForResource(
        type as AuditResource,
        id,
        Math.min(parseInt(limit as string, 10), 100)
      );

      res.json({
        logs,
        count: logs.length,
        resource: { type, id },
      });
    } catch (error: any) {
      console.error('Error fetching resource audit logs:', error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  }
);

/**
 * GET /api/v1/audit/user/:userId
 * Get audit logs for a specific user
 */
router.get(
  '/user/:userId',
  authenticate,
  requireAuditAccess as any,
  async (req: AuditRequest, res: Response) => {
    try {
      const userData = req.userData as User;
      const { userId } = req.params;
      const { limit = '50' } = req.query;

      // Verify the target user is in the same organization
      const targetUserDoc = await db.collection('users').doc(userId).get();
      if (!targetUserDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const targetUser = targetUserDoc.data() as User;
      if (targetUser.organizationId !== userData.organizationId) {
        return res.status(403).json({ error: 'Access denied to this user' });
      }

      const logs = await auditService.getLogsForUser(
        userId,
        Math.min(parseInt(limit as string, 10), 100)
      );

      res.json({
        logs,
        count: logs.length,
        user: {
          uid: userId,
          displayName: targetUser.displayName,
          email: targetUser.email,
        },
      });
    } catch (error: any) {
      console.error('Error fetching user audit logs:', error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
  }
);

/**
 * GET /api/v1/audit/verify/:logId
 * Verify integrity of an audit log entry
 */
router.get(
  '/verify/:logId',
  authenticate,
  requireAuditAccess as any,
  async (req: AuditRequest, res: Response) => {
    try {
      const { logId } = req.params;

      const isValid = await auditService.verifyIntegrity(logId);

      res.json({
        logId,
        integrityValid: isValid,
        verifiedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error verifying audit log:', error);
      res.status(500).json({ error: 'Failed to verify audit log' });
    }
  }
);

/**
 * GET /api/v1/audit/stats
 * Get audit log statistics for the organization
 */
router.get('/stats', authenticate, requireAuditAccess as any, async (req: AuditRequest, res: Response) => {
  try {
    const userData = req.userData as User;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Get logs for the period
    const logs = await auditService.query({
      organizationId: userData.organizationId,
      startDate: start,
      endDate: end,
      limit: 1000,
    });

    // Calculate stats
    const stats = {
      totalEvents: logs.length,
      byAction: {} as Record<string, number>,
      byResource: {} as Record<string, number>,
      uniqueUsers: new Set(logs.map((l) => l.userId)).size,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    };

    for (const log of logs) {
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
      stats.byResource[log.resource] = (stats.byResource[log.resource] || 0) + 1;
    }

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching audit stats:', error);
    res.status(500).json({ error: 'Failed to fetch audit statistics' });
  }
});

export default router;
