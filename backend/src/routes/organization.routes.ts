/**
 * Organization Routes - API Endpoints
 * 
 * RESTful API for organization management
 */

import { Router, Request, Response } from 'express';
import { OrganizationService } from '../services/organization.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../models/organization.model';

const router = Router();

/**
 * POST /api/v1/organizations
 * Create a new organization
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: CreateOrganizationDto = req.body;
    
    // TODO: Get user ID from auth middleware
    const createdBy = req.user?.uid || 'system';
    
    // Validate required fields
    if (!data.name || !data.slug || !data.plan) {
      return res.status(400).json({
        error: 'Missing required fields: name, slug, plan',
      });
    }
    
    // Validate slug format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      return res.status(400).json({
        error: 'Slug must contain only lowercase letters, numbers, and hyphens',
      });
    }
    
    const organization = await OrganizationService.createOrganization(data, createdBy);
    
    res.status(201).json(organization);
  } catch (error: any) {
    console.error('Error creating organization:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/organizations
 * List all organizations
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const startAfter = req.query.startAfter as string;
    
    const organizations = await OrganizationService.listOrganizations(limit, startAfter);
    
    res.json(organizations);
  } catch (error: any) {
    console.error('Error listing organizations:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/organizations/:id
 * Get organization by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const organization = await OrganizationService.getOrganizationById(id);
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    res.json(organization);
  } catch (error: any) {
    console.error('Error getting organization:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/organizations/slug/:slug
 * Get organization by slug
 */
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    
    const organization = await OrganizationService.getOrganizationBySlug(slug);
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    res.json(organization);
  } catch (error: any) {
    console.error('Error getting organization by slug:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/v1/organizations/:id
 * Update organization
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: UpdateOrganizationDto = req.body;
    
    const organization = await OrganizationService.updateOrganization(id, data);
    
    res.json(organization);
  } catch (error: any) {
    console.error('Error updating organization:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/v1/organizations/:id
 * Delete organization (soft delete)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await OrganizationService.deleteOrganization(id);
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting organization:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/v1/organizations/:id/limits/:type
 * Check if organization has reached a limit
 */
router.get('/:id/limits/:type', async (req: Request, res: Response) => {
  try {
    const { id, type } = req.params;
    
    const canAdd = await OrganizationService.checkLimit(
      id,
      type as keyof any
    );
    
    res.json({ canAdd });
  } catch (error: any) {
    console.error('Error checking limit:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
