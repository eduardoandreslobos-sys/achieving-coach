/**
 * Organization Service - Business Logic Layer
 * 
 * Handles all organization-related operations including CRUD,
 * usage tracking, and limit enforcement.
 */

import { 
  Organization, 
  CreateOrganizationDto, 
  UpdateOrganizationDto,
  PLAN_LIMITS 
} from '../models/organization.model';
import { db } from '../config/firebase';

const COLLECTION = 'organizations';

export class OrganizationService {
  
  /**
   * Create a new organization
   */
  static async createOrganization(
    data: CreateOrganizationDto,
    createdBy: string
  ): Promise<Organization> {
    // Validate slug is unique
    const existingOrg = await this.getOrganizationBySlug(data.slug);
    if (existingOrg) {
      throw new Error(`Organization with slug '${data.slug}' already exists`);
    }
    
    // Create organization object
    const organization: Organization = {
      id: db.collection(COLLECTION).doc().id,
      name: data.name,
      slug: data.slug.toLowerCase(),
      plan: data.plan,
      status: 'trial',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      
      limits: PLAN_LIMITS[data.plan],
      
      usage: {
        coaches: 0,
        coachees: 0,
        storage: 0,
        programs: 0,
      },
      
      branding: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
      },
      
      settings: {
        allowSelfSignup: false,
        requireEmailVerification: true,
        ssoEnabled: false,
        defaultCoachRole: 'coach',
        defaultCoacheeRole: 'coachee',
      },
      
      contactInfo: data.contactInfo,
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
    };
    
    // Save to Firestore
    await db.collection(COLLECTION).doc(organization.id).set(organization);
    
    return organization;
  }
  
  /**
   * Get organization by ID
   */
  static async getOrganizationById(id: string): Promise<Organization | null> {
    const doc = await db.collection(COLLECTION).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return doc.data() as Organization;
  }
  
  /**
   * Get organization by slug
   */
  static async getOrganizationBySlug(slug: string): Promise<Organization | null> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('slug', '==', slug.toLowerCase())
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    return snapshot.docs[0].data() as Organization;
  }
  
  /**
   * List all organizations
   */
  static async listOrganizations(
    limit: number = 50,
    startAfter?: string
  ): Promise<Organization[]> {
    let query = db.collection(COLLECTION).orderBy('createdAt', 'desc').limit(limit);
    
    if (startAfter) {
      const startDoc = await db.collection(COLLECTION).doc(startAfter).get();
      query = query.startAfter(startDoc);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => doc.data() as Organization);
  }
  
  /**
   * Update organization
   */
  static async updateOrganization(
    id: string,
    data: UpdateOrganizationDto
  ): Promise<Organization> {
    const org = await this.getOrganizationById(id);
    
    if (!org) {
      throw new Error(`Organization with ID '${id}' not found`);
    }
    
    // If changing slug, validate uniqueness
    if (data.slug && data.slug !== org.slug) {
      const existingOrg = await this.getOrganizationBySlug(data.slug);
      if (existingOrg) {
        throw new Error(`Organization with slug '${data.slug}' already exists`);
      }
    }
    
    // If changing plan, update limits
    if (data.plan && data.plan !== org.plan) {
      data.limits = PLAN_LIMITS[data.plan];
    }
    
    // Update organization
    const updatedOrg: Organization = {
      ...org,
      ...data,
      limits: data.limits ? { ...org.limits, ...data.limits } : org.limits,
      branding: data.branding ? { ...org.branding, ...data.branding } : org.branding,
      settings: data.settings ? { ...org.settings, ...data.settings } : org.settings,
      contactInfo: data.contactInfo ? { ...org.contactInfo, ...data.contactInfo } : org.contactInfo,
      updatedAt: new Date(),
    };
    
    await db.collection(COLLECTION).doc(id).update(updatedOrg);
    
    return updatedOrg;
  }
  
  /**
   * Delete organization
   */
  static async deleteOrganization(id: string): Promise<void> {
    const org = await this.getOrganizationById(id);
    
    if (!org) {
      throw new Error(`Organization with ID '${id}' not found`);
    }
    
    // TODO: Cascade delete all related data (users, sessions, etc.)
    // For now, just soft delete by changing status
    await db.collection(COLLECTION).doc(id).update({
      status: 'cancelled',
      updatedAt: new Date(),
    });
  }
  
  /**
   * Check if organization has reached a limit
   */
  static async checkLimit(
    organizationId: string,
    type: keyof Organization['limits']
  ): Promise<boolean> {
    const org = await this.getOrganizationById(organizationId);
    
    if (!org) {
      throw new Error(`Organization with ID '${organizationId}' not found`);
    }
    
    const limit = org.limits[type];
    const usage = org.usage[type];
    
    // -1 means unlimited
    if (limit === -1) {
      return true;
    }
    
    return usage < limit;
  }
  
  /**
   * Increment usage counter
   */
  static async incrementUsage(
    organizationId: string,
    type: keyof Organization['usage'],
    amount: number = 1
  ): Promise<void> {
    const org = await this.getOrganizationById(organizationId);
    
    if (!org) {
      throw new Error(`Organization with ID '${organizationId}' not found`);
    }
    
    await db.collection(COLLECTION).doc(organizationId).update({
      [`usage.${type}`]: org.usage[type] + amount,
      updatedAt: new Date(),
    });
  }
  
  /**
   * Decrement usage counter
   */
  static async decrementUsage(
    organizationId: string,
    type: keyof Organization['usage'],
    amount: number = 1
  ): Promise<void> {
    const org = await this.getOrganizationById(organizationId);
    
    if (!org) {
      throw new Error(`Organization with ID '${organizationId}' not found`);
    }
    
    const newUsage = Math.max(0, org.usage[type] - amount);
    
    await db.collection(COLLECTION).doc(organizationId).update({
      [`usage.${type}`]: newUsage,
      updatedAt: new Date(),
    });
  }
}
