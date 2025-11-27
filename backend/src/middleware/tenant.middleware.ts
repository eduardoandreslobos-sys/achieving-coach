/**
 * Tenant Middleware - Multi-tenant Isolation
 * 
 * Extracts organizationId from authenticated user and adds it to the request.
 * This ensures all subsequent database queries are scoped to the user's organization.
 */

import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

// Extend Express Request to include tenant info
declare global {
  namespace Express {
    interface Request {
      organizationId?: string;
      user?: DecodedIdToken & {
        organizationId?: string;
        role?: string;
      };
    }
  }
}

/**
 * Tenant Isolation Middleware
 * 
 * Usage:
 * app.use(authMiddleware); // First authenticate
 * app.use(tenantMiddleware); // Then extract tenant
 */
export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Skip tenant isolation for public routes
    const publicRoutes = ['/health', '/api/v1/auth'];
    if (publicRoutes.some(route => req.path.startsWith(route))) {
      return next();
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated to access this resource',
      });
    }
    
    // Extract organizationId from user custom claims
    const organizationId = req.user.organizationId;
    
    if (!organizationId) {
      return res.status(403).json({
        error: 'No organization assigned',
        message: 'User is not assigned to any organization. Please contact support.',
      });
    }
    
    // Add organizationId to request for use in subsequent handlers
    req.organizationId = organizationId;
    
    // Log tenant access for debugging (remove in production)
    console.log(`[Tenant] User ${req.user.uid} accessing org ${organizationId}`);
    
    next();
  } catch (error) {
    console.error('[Tenant Middleware] Error:', error);
    res.status(500).json({
      error: 'Tenant isolation error',
      message: 'Failed to extract organization context',
    });
  }
};

/**
 * Optional: Middleware to enforce tenant-specific routes
 * 
 * Example: /api/v1/organizations/:orgId/coaches
 * Ensures :orgId matches user's organizationId
 */
export const enforceTenantRouteMatch = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const routeOrgId = req.params.organizationId || req.params.orgId;
  
  if (routeOrgId && routeOrgId !== req.organizationId) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'You do not have permission to access this organization',
    });
  }
  
  next();
};
