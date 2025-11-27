/**
 * Organization Model - Multi-tenant Foundation
 * 
 * Represents a company/organization using the coaching platform.
 * All users, coaches, coachees, and data belong to an organization.
 */

export interface Organization {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier (e.g., "acme-corp")
  domain?: string; // Optional custom domain (e.g., "coaching.acme.com")
  
  // Plan & Billing
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  trialEndsAt?: Date;
  subscriptionId?: string; // Stripe subscription ID (Sprint 2.4)
  
  // Licensing & Limits
  limits: {
    coaches: number;       // Max number of coaches
    coachees: number;      // Max number of coachees
    storage: number;       // Storage limit in GB
    programs: number;      // Max coaching programs
  };
  
  usage: {
    coaches: number;       // Current active coaches
    coachees: number;      // Current active coachees
    storage: number;       // Current storage used in GB
    programs: number;      // Current active programs
  };
  
  // Branding (Sprint 2.3)
  branding?: {
    logo?: string;         // Logo URL
    primaryColor: string;  // Hex color (e.g., "#6366f1")
    secondaryColor: string;
    favicon?: string;
  };
  
  // Settings
  settings: {
    allowSelfSignup: boolean;           // Allow users to self-register
    requireEmailVerification: boolean;  // Require email verification
    ssoEnabled: boolean;                // SSO enabled (Sprint 3)
    defaultCoachRole: 'coach' | 'coach_admin';
    defaultCoacheeRole: 'coachee';
  };
  
  // Contact & Billing Info
  contactInfo: {
    primaryContactName: string;
    primaryContactEmail: string;
    billingEmail?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID of creator
}

/**
 * Organization Creation DTO
 */
export interface CreateOrganizationDto {
  name: string;
  slug: string;
  plan: 'starter' | 'professional' | 'enterprise';
  contactInfo: {
    primaryContactName: string;
    primaryContactEmail: string;
  };
}

/**
 * Organization Update DTO
 */
export interface UpdateOrganizationDto {
  name?: string;
  slug?: string;
  domain?: string;
  plan?: 'starter' | 'professional' | 'enterprise';
  status?: 'active' | 'trial' | 'suspended' | 'cancelled';
  limits?: Partial<Organization['limits']>;
  branding?: Partial<Organization['branding']>;
  settings?: Partial<Organization['settings']>;
  contactInfo?: Partial<Organization['contactInfo']>;
}

/**
 * Default limits by plan
 */
export const PLAN_LIMITS: Record<Organization['plan'], Organization['limits']> = {
  starter: {
    coaches: 2,
    coachees: 10,
    storage: 5,
    programs: 3,
  },
  professional: {
    coaches: 10,
    coachees: 100,
    storage: 50,
    programs: 20,
  },
  enterprise: {
    coaches: -1,  // Unlimited
    coachees: -1, // Unlimited
    storage: 500,
    programs: -1, // Unlimited
  },
};
