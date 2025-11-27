/**
 * User Model - Extended with Organization
 * 
 * Base user model with organization assignment and role
 */

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
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
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
