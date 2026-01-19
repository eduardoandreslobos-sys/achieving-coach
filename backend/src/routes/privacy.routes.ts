/**
 * Privacy Routes
 *
 * API endpoints for GDPR/CCPA compliance:
 * - Privacy settings management
 * - Cookie consent
 * - Data export
 * - Account deletion
 */

import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { privacyService } from '../services/privacy.service';
import { dataExportService } from '../services/dataExport.service';
import { accountDeletionService } from '../services/accountDeletion.service';
import { setAuditContext, AuditableRequest } from '../middleware/audit.middleware';

const router = Router();

/**
 * Helper to get client IP
 */
function getClientIp(req: AuthRequest): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded : forwarded[0];
    return ips.split(',')[0].trim();
  }
  return req.socket?.remoteAddress;
}

/**
 * GET /api/v1/privacy/settings
 * Get current privacy settings for the authenticated user
 */
router.get('/settings', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const settings = await privacyService.getPrivacySettings(req.user!.uid);

    if (!settings) {
      return res.json(privacyService.getDefaultPrivacySettings());
    }

    res.json(settings);
  } catch (error: any) {
    console.error('Error fetching privacy settings:', error);
    res.status(500).json({ error: 'Failed to fetch privacy settings' });
  }
});

/**
 * PUT /api/v1/privacy/settings
 * Update privacy settings
 */
router.put('/settings', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { doNotSellData, marketingEmails, productUpdates, thirdPartySharing } = req.body;

    const settings = await privacyService.updatePrivacySettings(
      req.user!.uid,
      req.user!.email || '',
      { doNotSellData, marketingEmails, productUpdates, thirdPartySharing },
      getClientIp(req)
    );

    res.json(settings);
  } catch (error: any) {
    console.error('Error updating privacy settings:', error);
    res.status(500).json({ error: 'Failed to update privacy settings' });
  }
});

/**
 * POST /api/v1/privacy/consent/cookies
 * Update cookie consent preferences
 */
router.post('/consent/cookies', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { analytics, marketing, functional } = req.body;

    if (typeof analytics !== 'boolean' || typeof marketing !== 'boolean' || typeof functional !== 'boolean') {
      return res.status(400).json({ error: 'Invalid consent values' });
    }

    const consent = await privacyService.updateCookieConsent(
      req.user!.uid,
      req.user!.email || '',
      { analytics, marketing, functional },
      getClientIp(req),
      req.headers['user-agent']
    );

    res.json(consent);
  } catch (error: any) {
    console.error('Error updating cookie consent:', error);
    res.status(500).json({ error: 'Failed to update cookie consent' });
  }
});

/**
 * POST /api/v1/privacy/do-not-sell
 * Toggle CCPA "Do Not Sell My Personal Information"
 */
router.post('/do-not-sell', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { doNotSell } = req.body;

    if (typeof doNotSell !== 'boolean') {
      return res.status(400).json({ error: 'Invalid doNotSell value' });
    }

    const settings = await privacyService.setDoNotSell(
      req.user!.uid,
      req.user!.email || '',
      doNotSell,
      getClientIp(req)
    );

    res.json({
      success: true,
      doNotSellData: settings.doNotSellData,
      message: doNotSell
        ? 'Your data will not be sold to third parties.'
        : 'Do Not Sell preference has been disabled.',
    });
  } catch (error: any) {
    console.error('Error updating Do Not Sell preference:', error);
    res.status(500).json({ error: 'Failed to update preference' });
  }
});

/**
 * POST /api/v1/privacy/export
 * Export all user data (GDPR Article 20 - Right to Data Portability)
 */
router.post('/export', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    setAuditContext(req as AuditableRequest, { action: 'export', resource: 'data_export', resourceId: req.user!.uid });

    const exportData = await dataExportService.exportUserData(
      req.user!.uid,
      req.user!.email || '',
      req.user!.organizationId,
      getClientIp(req)
    );

    const filename = dataExportService.generateFilename(req.user!.uid);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(exportData);
  } catch (error: any) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

/**
 * GET /api/v1/privacy/deletion-status
 * Get current deletion request status
 */
router.get('/deletion-status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const status = await accountDeletionService.getDeletionStatus(req.user!.uid);
    res.json({ deletionRequest: status });
  } catch (error: any) {
    console.error('Error fetching deletion status:', error);
    res.status(500).json({ error: 'Failed to fetch deletion status' });
  }
});

/**
 * POST /api/v1/privacy/delete-account
 * Request account deletion (GDPR Article 17 - Right to Erasure)
 */
router.post('/delete-account', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;

    // Check if user can be deleted
    const canDelete = await accountDeletionService.canDelete(req.user!.uid);
    if (!canDelete.canDelete) {
      return res.status(400).json({
        error: 'Cannot delete account',
        reason: canDelete.reason,
      });
    }

    const result = await accountDeletionService.requestDeletion(
      req.user!.uid,
      req.user!.email || '',
      reason,
      req.user!.organizationId,
      getClientIp(req)
    );

    if (!result.success) {
      return res.status(400).json({
        error: 'Deletion request failed',
        message: result.message,
        deletionRequest: result.deletionRequest,
      });
    }

    res.json({
      success: true,
      message: result.message,
      deletionRequest: result.deletionRequest,
    });
  } catch (error: any) {
    console.error('Error requesting account deletion:', error);
    res.status(500).json({ error: 'Failed to request account deletion' });
  }
});

/**
 * POST /api/v1/privacy/cancel-deletion
 * Cancel a pending deletion request
 */
router.post('/cancel-deletion', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await accountDeletionService.cancelDeletion(
      req.user!.uid,
      req.user!.email || '',
      req.user!.organizationId,
      getClientIp(req)
    );

    if (!result.success) {
      return res.status(400).json({
        error: 'Cancel deletion failed',
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Error cancelling deletion:', error);
    res.status(500).json({ error: 'Failed to cancel deletion request' });
  }
});

/**
 * GET /api/v1/privacy/consent-history
 * Get consent history for the user
 */
router.get('/consent-history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const type = req.query.type as string | undefined;
    const history = await privacyService.getConsentHistory(
      req.user!.uid,
      type as any
    );

    res.json(history);
  } catch (error: any) {
    console.error('Error fetching consent history:', error);
    res.status(500).json({ error: 'Failed to fetch consent history' });
  }
});

export default router;
