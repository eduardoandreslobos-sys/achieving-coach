/**
 * Privacy Service
 *
 * Manages user privacy settings, cookie consent, and CCPA "Do Not Sell"
 * preferences for GDPR and CCPA compliance.
 */

import { db } from '../config/firebase';
import { auditService } from './audit.service';
import {
  User,
  PrivacySettings,
  CookieConsent,
  ConsentRecord,
} from '../models/user.model';
import { generateToken } from '../utils/encryption';

const COOKIE_CONSENT_VERSION = '1.0.0';

export interface UpdatePrivacySettingsDto {
  doNotSellData?: boolean;
  marketingEmails?: boolean;
  productUpdates?: boolean;
  thirdPartySharing?: boolean;
}

export interface UpdateCookieConsentDto {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export class PrivacyService {
  private usersCollection = db.collection('users');
  private consentCollection = db.collection('consent_records');

  /**
   * Get privacy settings for a user
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    const userDoc = await this.usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data() as User;
    return userData.privacySettings || this.getDefaultPrivacySettings();
  }

  /**
   * Get default privacy settings for new users
   */
  getDefaultPrivacySettings(): PrivacySettings {
    return {
      doNotSellData: false,
      marketingEmails: true,
      productUpdates: true,
      thirdPartySharing: false,
      dataRetentionAcknowledged: false,
      lastUpdated: new Date(),
    };
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(
    userId: string,
    userEmail: string,
    settings: UpdatePrivacySettingsDto,
    ipAddress?: string
  ): Promise<PrivacySettings> {
    const userDoc = await this.usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;
    const currentSettings = userData.privacySettings || this.getDefaultPrivacySettings();

    const updatedSettings: PrivacySettings = {
      ...currentSettings,
      ...settings,
      lastUpdated: new Date(),
    };

    await this.usersCollection.doc(userId).update({
      privacySettings: updatedSettings,
      updatedAt: new Date(),
    });

    // Log consent update for audit trail
    await auditService.logConsentUpdate(
      userId,
      userEmail,
      {
        before: currentSettings,
        after: updatedSettings,
        fields: Object.keys(settings),
      },
      userData.organizationId,
      ipAddress
    );

    return updatedSettings;
  }

  /**
   * Update cookie consent
   */
  async updateCookieConsent(
    userId: string,
    userEmail: string,
    consent: UpdateCookieConsentDto,
    ipAddress?: string,
    userAgent?: string
  ): Promise<CookieConsent> {
    const userDoc = await this.usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;

    const cookieConsent: CookieConsent = {
      necessary: true, // Always required
      analytics: consent.analytics,
      marketing: consent.marketing,
      functional: consent.functional,
      version: COOKIE_CONSENT_VERSION,
      timestamp: new Date(),
      ipAddress,
    };

    const privacySettings: PrivacySettings = {
      ...(userData.privacySettings || this.getDefaultPrivacySettings()),
      cookieConsent,
      lastUpdated: new Date(),
    };

    await this.usersCollection.doc(userId).update({
      privacySettings,
      updatedAt: new Date(),
    });

    // Record consent for legal compliance
    await this.recordConsent(
      userId,
      userEmail,
      'cookies',
      COOKIE_CONSENT_VERSION,
      true,
      ipAddress,
      userAgent
    );

    // Log for audit trail
    await auditService.logConsentUpdate(
      userId,
      userEmail,
      {
        after: cookieConsent,
        fields: ['analytics', 'marketing', 'functional'],
      },
      userData.organizationId,
      ipAddress
    );

    return cookieConsent;
  }

  /**
   * Set CCPA "Do Not Sell" preference
   */
  async setDoNotSell(
    userId: string,
    userEmail: string,
    doNotSell: boolean,
    ipAddress?: string
  ): Promise<PrivacySettings> {
    return this.updatePrivacySettings(
      userId,
      userEmail,
      { doNotSellData: doNotSell },
      ipAddress
    );
  }

  /**
   * Record a consent event for legal compliance
   */
  async recordConsent(
    userId: string,
    userEmail: string,
    type: ConsentRecord['type'],
    version: string,
    accepted: boolean,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ConsentRecord> {
    const consentRecord: ConsentRecord = {
      id: generateToken(16),
      type,
      version,
      accepted,
      timestamp: new Date(),
      ipAddress,
      userAgent,
    };

    // Store in consent_records collection for long-term retention
    await this.consentCollection.add({
      userId,
      userEmail,
      ...consentRecord,
    });

    // Update user's consent records array
    const userDoc = await this.usersCollection.doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data() as User;
      const consentRecords = userData.consentRecords || [];

      // Keep last 10 consent records per user
      consentRecords.push(consentRecord);
      if (consentRecords.length > 10) {
        consentRecords.shift();
      }

      await this.usersCollection.doc(userId).update({
        consentRecords,
        updatedAt: new Date(),
      });
    }

    return consentRecord;
  }

  /**
   * Get consent history for a user
   */
  async getConsentHistory(
    userId: string,
    type?: ConsentRecord['type']
  ): Promise<ConsentRecord[]> {
    let query: FirebaseFirestore.Query = this.consentCollection
      .where('userId', '==', userId);

    if (type) {
      query = query.where('type', '==', type);
    }

    query = query.orderBy('timestamp', 'desc').limit(50);

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        type: data.type,
        version: data.version,
        accepted: data.accepted,
        timestamp: data.timestamp?.toDate() || new Date(),
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      } as ConsentRecord;
    });
  }

  /**
   * Verify if user has given specific consent
   */
  async hasConsent(
    userId: string,
    type: ConsentRecord['type'],
    minVersion?: string
  ): Promise<boolean> {
    const userDoc = await this.usersCollection.doc(userId).get();

    if (!userDoc.exists) {
      return false;
    }

    const userData = userDoc.data() as User;
    const privacySettings = userData.privacySettings;

    if (!privacySettings) {
      return false;
    }

    switch (type) {
      case 'cookies':
        if (!privacySettings.cookieConsent) return false;
        if (minVersion && privacySettings.cookieConsent.version < minVersion) return false;
        return true;

      case 'marketing':
        return privacySettings.marketingEmails === true;

      case 'data_processing':
        return privacySettings.dataRetentionAcknowledged === true;

      default:
        return false;
    }
  }

  /**
   * Acknowledge data retention policy
   */
  async acknowledgeDataRetention(
    userId: string,
    userEmail: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.updatePrivacySettings(
      userId,
      userEmail,
      { /* dataRetentionAcknowledged handled separately */ },
      ipAddress
    );

    const userDoc = await this.usersCollection.doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data() as User;
      const privacySettings = userData.privacySettings || this.getDefaultPrivacySettings();

      await this.usersCollection.doc(userId).update({
        privacySettings: {
          ...privacySettings,
          dataRetentionAcknowledged: true,
          lastUpdated: new Date(),
        },
        updatedAt: new Date(),
      });

      await this.recordConsent(
        userId,
        userEmail,
        'data_processing',
        '1.0.0',
        true,
        ipAddress,
        userAgent
      );
    }
  }
}

// Export singleton instance
export const privacyService = new PrivacyService();
