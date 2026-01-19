/**
 * User Model - Extended with Organization and Privacy
 *
 * Base user model with organization assignment, role, and privacy settings
 * for GDPR, CCPA, and HIPAA compliance.
 */

/**
 * Cookie consent preferences
 */
export interface CookieConsent {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  version: string; // Consent policy version
  timestamp: Date;
  ipAddress?: string;
}

/**
 * Privacy settings for GDPR/CCPA compliance
 */
export interface PrivacySettings {
  cookieConsent?: CookieConsent;
  doNotSellData: boolean; // CCPA "Do Not Sell My Personal Information"
  marketingEmails: boolean;
  productUpdates: boolean;
  thirdPartySharing: boolean;
  dataRetentionAcknowledged: boolean;
  lastUpdated: Date;
}

/**
 * Account deletion request (GDPR Art. 17)
 */
export interface DeletionRequest {
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestedAt: Date;
  scheduledAt: Date; // 30-day grace period
  reason?: string;
  processedAt?: Date;
  cancelledAt?: Date;
}

/**
 * Consent record for audit trail
 */
export interface ConsentRecord {
  id: string;
  type: 'terms' | 'privacy' | 'cookies' | 'marketing' | 'data_processing';
  version: string;
  accepted: boolean;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;

  // Organization & Role
  organizationId: string;
  role: 'org_admin' | 'coach_admin' | 'supervisor' | 'coach' | 'coachee';

  // Profile
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;

  // Status
  status: 'active' | 'inactive' | 'suspended' | 'pending_deletion';
  emailVerified: boolean;

  // Privacy & Compliance (GDPR/CCPA/HIPAA)
  privacySettings?: PrivacySettings;
  deletionRequest?: DeletionRequest;
  consentRecords?: ConsentRecord[];
}

/**
 * User creation DTO
 */
export interface CreateUserDto {
  email: string;
  password: string;
  displayName?: string;
  organizationId: string;
  role: User['role'];
  firstName?: string;
  lastName?: string;
}

/**
 * User update DTO
 */
export interface UpdateUserDto {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
  photoURL?: string;
}
