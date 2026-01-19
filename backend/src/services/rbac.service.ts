/**
 * Role-Based Access Control (RBAC) Service
 *
 * Provides granular permissions for different user roles.
 * Implements scoped access: none, own, team, organization, all.
 */

import { User } from '../models/user.model';

export type Role = 'org_admin' | 'coach_admin' | 'supervisor' | 'coach' | 'coachee';

export type Permission =
  // User management
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  // Session management
  | 'sessions:read'
  | 'sessions:create'
  | 'sessions:update'
  | 'sessions:delete'
  // Goal management
  | 'goals:read'
  | 'goals:create'
  | 'goals:update'
  | 'goals:delete'
  // Reflection management
  | 'reflections:read'
  | 'reflections:create'
  | 'reflections:update'
  | 'reflections:delete'
  // Tool results
  | 'tools:read'
  | 'tools:create'
  | 'tools:update'
  | 'tools:delete'
  // Conversations
  | 'conversations:read'
  | 'conversations:create'
  | 'conversations:update'
  | 'conversations:delete'
  // Coaching programs
  | 'programs:read'
  | 'programs:create'
  | 'programs:update'
  | 'programs:delete'
  // Organization management
  | 'organization:read'
  | 'organization:update'
  | 'organization:billing'
  // Audit logs
  | 'audit:read'
  // Reports
  | 'reports:read'
  | 'reports:export'
  // Privacy
  | 'privacy:manage'
  | 'privacy:export'
  | 'privacy:delete';

export type Scope = 'none' | 'own' | 'team' | 'organization' | 'all';

export interface PermissionConfig {
  permission: Permission;
  scope: Scope;
}

/**
 * Permission matrix defining what each role can do
 */
const ROLE_PERMISSIONS: Record<Role, PermissionConfig[]> = {
  org_admin: [
    // Full organization control
    { permission: 'users:read', scope: 'organization' },
    { permission: 'users:create', scope: 'organization' },
    { permission: 'users:update', scope: 'organization' },
    { permission: 'users:delete', scope: 'organization' },
    { permission: 'sessions:read', scope: 'organization' },
    { permission: 'sessions:create', scope: 'organization' },
    { permission: 'sessions:update', scope: 'organization' },
    { permission: 'sessions:delete', scope: 'organization' },
    { permission: 'goals:read', scope: 'organization' },
    { permission: 'goals:create', scope: 'organization' },
    { permission: 'goals:update', scope: 'organization' },
    { permission: 'goals:delete', scope: 'organization' },
    { permission: 'reflections:read', scope: 'organization' },
    { permission: 'tools:read', scope: 'organization' },
    { permission: 'conversations:read', scope: 'organization' },
    { permission: 'programs:read', scope: 'organization' },
    { permission: 'programs:create', scope: 'organization' },
    { permission: 'programs:update', scope: 'organization' },
    { permission: 'programs:delete', scope: 'organization' },
    { permission: 'organization:read', scope: 'organization' },
    { permission: 'organization:update', scope: 'organization' },
    { permission: 'organization:billing', scope: 'organization' },
    { permission: 'audit:read', scope: 'organization' },
    { permission: 'reports:read', scope: 'organization' },
    { permission: 'reports:export', scope: 'organization' },
    { permission: 'privacy:manage', scope: 'own' },
    { permission: 'privacy:export', scope: 'own' },
    { permission: 'privacy:delete', scope: 'own' },
  ],

  coach_admin: [
    // Coach team management
    { permission: 'users:read', scope: 'team' },
    { permission: 'users:create', scope: 'team' },
    { permission: 'users:update', scope: 'team' },
    { permission: 'sessions:read', scope: 'team' },
    { permission: 'sessions:create', scope: 'team' },
    { permission: 'sessions:update', scope: 'team' },
    { permission: 'goals:read', scope: 'team' },
    { permission: 'goals:create', scope: 'team' },
    { permission: 'goals:update', scope: 'team' },
    { permission: 'reflections:read', scope: 'team' },
    { permission: 'tools:read', scope: 'team' },
    { permission: 'conversations:read', scope: 'team' },
    { permission: 'conversations:create', scope: 'team' },
    { permission: 'programs:read', scope: 'team' },
    { permission: 'programs:create', scope: 'team' },
    { permission: 'programs:update', scope: 'team' },
    { permission: 'organization:read', scope: 'organization' },
    { permission: 'reports:read', scope: 'team' },
    { permission: 'reports:export', scope: 'team' },
    { permission: 'privacy:manage', scope: 'own' },
    { permission: 'privacy:export', scope: 'own' },
    { permission: 'privacy:delete', scope: 'own' },
  ],

  supervisor: [
    // Oversight without modification
    { permission: 'users:read', scope: 'team' },
    { permission: 'sessions:read', scope: 'team' },
    { permission: 'goals:read', scope: 'team' },
    { permission: 'reflections:read', scope: 'team' },
    { permission: 'tools:read', scope: 'team' },
    { permission: 'programs:read', scope: 'team' },
    { permission: 'reports:read', scope: 'team' },
    { permission: 'privacy:manage', scope: 'own' },
    { permission: 'privacy:export', scope: 'own' },
    { permission: 'privacy:delete', scope: 'own' },
  ],

  coach: [
    // Coach can manage their own coachees
    { permission: 'users:read', scope: 'own' },
    { permission: 'sessions:read', scope: 'own' },
    { permission: 'sessions:create', scope: 'own' },
    { permission: 'sessions:update', scope: 'own' },
    { permission: 'goals:read', scope: 'own' },
    { permission: 'goals:create', scope: 'own' },
    { permission: 'goals:update', scope: 'own' },
    { permission: 'reflections:read', scope: 'own' },
    { permission: 'tools:read', scope: 'own' },
    { permission: 'tools:create', scope: 'own' },
    { permission: 'conversations:read', scope: 'own' },
    { permission: 'conversations:create', scope: 'own' },
    { permission: 'conversations:update', scope: 'own' },
    { permission: 'programs:read', scope: 'own' },
    { permission: 'programs:create', scope: 'own' },
    { permission: 'programs:update', scope: 'own' },
    { permission: 'reports:read', scope: 'own' },
    { permission: 'privacy:manage', scope: 'own' },
    { permission: 'privacy:export', scope: 'own' },
    { permission: 'privacy:delete', scope: 'own' },
  ],

  coachee: [
    // Coachee can only access their own data
    { permission: 'users:read', scope: 'own' },
    { permission: 'users:update', scope: 'own' },
    { permission: 'sessions:read', scope: 'own' },
    { permission: 'goals:read', scope: 'own' },
    { permission: 'goals:create', scope: 'own' },
    { permission: 'goals:update', scope: 'own' },
    { permission: 'reflections:read', scope: 'own' },
    { permission: 'reflections:create', scope: 'own' },
    { permission: 'reflections:update', scope: 'own' },
    { permission: 'reflections:delete', scope: 'own' },
    { permission: 'tools:read', scope: 'own' },
    { permission: 'tools:create', scope: 'own' },
    { permission: 'tools:update', scope: 'own' },
    { permission: 'conversations:read', scope: 'own' },
    { permission: 'conversations:create', scope: 'own' },
    { permission: 'conversations:update', scope: 'own' },
    { permission: 'programs:read', scope: 'own' },
    { permission: 'privacy:manage', scope: 'own' },
    { permission: 'privacy:export', scope: 'own' },
    { permission: 'privacy:delete', scope: 'own' },
  ],
};

export interface AccessCheckResult {
  allowed: boolean;
  scope: Scope;
  reason?: string;
}

export class RBACService {
  /**
   * Get all permissions for a role
   */
  getPermissionsForRole(role: Role): PermissionConfig[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Check if a user has a specific permission
   */
  hasPermission(user: User, permission: Permission): AccessCheckResult {
    const rolePermissions = ROLE_PERMISSIONS[user.role];

    if (!rolePermissions) {
      return { allowed: false, scope: 'none', reason: 'Unknown role' };
    }

    const permConfig = rolePermissions.find((p) => p.permission === permission);

    if (!permConfig) {
      return { allowed: false, scope: 'none', reason: 'Permission not granted' };
    }

    return { allowed: true, scope: permConfig.scope };
  }

  /**
   * Check if user can access a specific resource
   */
  canAccessResource(
    user: User,
    permission: Permission,
    resourceOwnerId: string,
    resourceOrganizationId?: string,
    resourceTeamId?: string
  ): AccessCheckResult {
    const permCheck = this.hasPermission(user, permission);

    if (!permCheck.allowed) {
      return permCheck;
    }

    switch (permCheck.scope) {
      case 'all':
        return { allowed: true, scope: 'all' };

      case 'organization':
        if (user.organizationId === resourceOrganizationId) {
          return { allowed: true, scope: 'organization' };
        }
        return { allowed: false, scope: 'organization', reason: 'Different organization' };

      case 'team':
        // For team scope, check if in same team (simplified: same org for now)
        if (user.organizationId === resourceOrganizationId) {
          return { allowed: true, scope: 'team' };
        }
        return { allowed: false, scope: 'team', reason: 'Different team' };

      case 'own':
        if (user.uid === resourceOwnerId) {
          return { allowed: true, scope: 'own' };
        }
        // Coaches can access their coachees' data
        if (user.role === 'coach' || user.role === 'coach_admin') {
          // This would need to check coach-coachee relationship
          // For now, allow if same organization
          if (user.organizationId === resourceOrganizationId) {
            return { allowed: true, scope: 'own' };
          }
        }
        return { allowed: false, scope: 'own', reason: 'Not resource owner' };

      case 'none':
      default:
        return { allowed: false, scope: 'none', reason: 'No access' };
    }
  }

  /**
   * Check if user is admin level
   */
  isAdmin(user: User): boolean {
    return user.role === 'org_admin' || user.role === 'coach_admin';
  }

  /**
   * Check if user is organization admin
   */
  isOrgAdmin(user: User): boolean {
    return user.role === 'org_admin';
  }

  /**
   * Check if user can manage other users
   */
  canManageUsers(user: User): AccessCheckResult {
    return this.hasPermission(user, 'users:create');
  }

  /**
   * Check if user can access audit logs
   */
  canAccessAuditLogs(user: User): AccessCheckResult {
    return this.hasPermission(user, 'audit:read');
  }

  /**
   * Check if user can export reports
   */
  canExportReports(user: User): AccessCheckResult {
    return this.hasPermission(user, 'reports:export');
  }

  /**
   * Get readable permissions list for a user
   */
  getReadablePermissions(user: User): string[] {
    const permissions = this.getPermissionsForRole(user.role);
    return permissions.map(
      (p) => `${p.permission} (${p.scope})`
    );
  }

  /**
   * Filter resources based on user's access scope
   */
  filterResourcesByScope<T extends { ownerId?: string; userId?: string; organizationId?: string }>(
    user: User,
    permission: Permission,
    resources: T[]
  ): T[] {
    const permCheck = this.hasPermission(user, permission);

    if (!permCheck.allowed) {
      return [];
    }

    switch (permCheck.scope) {
      case 'all':
        return resources;

      case 'organization':
        return resources.filter((r) => r.organizationId === user.organizationId);

      case 'team':
        // Simplified: same as organization for now
        return resources.filter((r) => r.organizationId === user.organizationId);

      case 'own':
        return resources.filter(
          (r) => (r.ownerId || r.userId) === user.uid
        );

      case 'none':
      default:
        return [];
    }
  }
}

// Export singleton instance
export const rbacService = new RBACService();
