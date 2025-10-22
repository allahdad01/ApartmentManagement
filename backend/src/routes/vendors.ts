import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all vendors for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        organizationId: req.user!.organizationId
      },
      orderBy: { name: 'asc' }
    });

    res.json({ vendors });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Create vendor
router.post('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      services,
      notes
    } = req.body;

    const vendor = await prisma.vendor.create({
      data: {
        name,
        email,
        phone,
        address,
        services: services || [],
        notes,
        organizationId: req.user!.organizationId,
        isActive: true
      }
    });

    res.status(201).json({
      vendor,
      message: 'Vendor created successfully'
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(400).json({ error: 'Failed to create vendor' });
  }
});

export default router;
