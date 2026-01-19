/**
 * Audit Middleware
 *
 * Automatically logs API requests for compliance and security monitoring.
 * Attaches to routes that need audit logging.
 */

import { Request, Response, NextFunction } from 'express';
import { auditService, AuditAction, AuditResource } from '../services/audit.service';
import { AuthRequest } from './auth';

export interface AuditContext {
  action?: AuditAction;
  resource?: AuditResource;
  resourceId?: string;
  skipAudit?: boolean;
}

export interface AuditableRequest extends AuthRequest {
  auditContext?: AuditContext;
}

/**
 * Get client IP address from request
 */
function getClientIp(req: AuditableRequest): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded : forwarded[0];
    return ips.split(',')[0].trim();
  }
  return req.socket?.remoteAddress;
}

/**
 * Get user agent from request
 */
function getUserAgent(req: AuditableRequest): string | undefined {
  return req.headers['user-agent'];
}

/**
 * Map HTTP method to audit action
 */
function methodToAction(method: string): AuditAction {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'read';
    case 'POST':
      return 'create';
    case 'PUT':
    case 'PATCH':
      return 'update';
    case 'DELETE':
      return 'delete';
    default:
      return 'read';
  }
}

/**
 * Extract resource type from URL path
 */
function extractResource(path: string): AuditResource | null {
  const resourceMap: Record<string, AuditResource> = {
    '/users': 'user',
    '/sessions': 'session',
    '/goals': 'goal',
    '/reflections': 'reflection',
    '/conversations': 'conversation',
    '/messages': 'message',
    '/tools': 'tool_result',
    '/stakeholders': 'stakeholder',
    '/feedback': 'feedback',
    '/programs': 'coaching_program',
    '/organizations': 'organization',
    '/privacy': 'privacy_settings',
    '/consent': 'consent',
    '/export': 'data_export',
  };

  for (const [urlPath, resource] of Object.entries(resourceMap)) {
    if (path.includes(urlPath)) {
      return resource;
    }
  }

  return null;
}

/**
 * Extract resource ID from URL path
 */
function extractResourceId(path: string): string | undefined {
  // Match patterns like /users/:id, /goals/:id, etc.
  const matches = path.match(/\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]{20,})/);
  return matches ? matches[2] : undefined;
}

/**
 * Middleware factory to create audit middleware with specific config
 */
export function createAuditMiddleware(config?: {
  action?: AuditAction;
  resource?: AuditResource;
  logRequestBody?: boolean;
  logResponseBody?: boolean;
}) {
  return async (req: AuditableRequest, res: Response, next: NextFunction) => {
    // Skip if no user (unauthenticated requests)
    if (!req.user) {
      return next();
    }

    // Skip if audit context says to skip
    if (req.auditContext?.skipAudit) {
      return next();
    }

    const startTime = Date.now();

    // Execute the route handler
    res.on('finish', async () => {
      try {
        const duration = Date.now() - startTime;
        const action = config?.action || req.auditContext?.action || methodToAction(req.method);
        const resource = config?.resource || req.auditContext?.resource || extractResource(req.path);

        // Only log if we have a valid resource
        if (!resource) {
          return;
        }

        // Don't log health checks or static assets
        if (req.path.includes('/health') || req.path.includes('/static')) {
          return;
        }

        // Only log successful mutations and explicit reads
        const shouldLog =
          res.statusCode < 400 &&
          (action !== 'read' || req.auditContext?.action === 'read');

        if (!shouldLog && action === 'read') {
          return; // Skip logging GET requests by default
        }

        await auditService.log({
          userId: req.user!.uid,
          userEmail: req.user!.email,
          action,
          resource,
          resourceId: req.auditContext?.resourceId || extractResourceId(req.path),
          ipAddress: getClientIp(req),
          userAgent: getUserAgent(req),
          metadata: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            ...(config?.logRequestBody && req.body ? { requestBody: sanitizeBody(req.body) } : {}),
          },
        });
      } catch (error) {
        // Don't fail the request if audit logging fails
        console.error('[Audit Middleware] Error logging audit:', error);
      }
    });

    next();
  };
}

/**
 * Sanitize request body to remove sensitive data
 */
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') return body;

  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'apiKey',
    'creditCard',
    'ssn',
    'currentPassword',
    'newPassword',
  ];

  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Set audit context for a request
 */
export function setAuditContext(
  req: AuditableRequest,
  context: AuditContext
) {
  req.auditContext = { ...req.auditContext, ...context };
}

/**
 * Default audit middleware for general API routes
 */
export const auditMiddleware = createAuditMiddleware();

/**
 * Audit middleware for sensitive operations (logs request body)
 */
export const sensitiveAuditMiddleware = createAuditMiddleware({
  logRequestBody: true,
});

/**
 * Middleware to explicitly log a read operation
 */
export function auditRead(resource: AuditResource) {
  return (req: AuditableRequest, res: Response, next: NextFunction) => {
    setAuditContext(req, { action: 'read', resource });
    next();
  };
}

/**
 * Middleware to skip audit for specific routes
 */
export function skipAudit(req: AuditableRequest, res: Response, next: NextFunction) {
  setAuditContext(req, { skipAudit: true });
  next();
}
