import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all applications for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const applications = await prisma.rentalApplication.findMany({
      where: {
        property: {
          organizationId: req.user!.organizationId
        }
      },
      include: {
        property: {
          select: {
            id: true,
            name: true
          }
        },
        unit: {
          select: {
            id: true,
            unitNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create application
router.post('/', async (req, res) => {
  try {
    const {
      propertyId,
      unitId,
      firstName,
      lastName,
      email,
      phone,
      monthlyIncome,
      employmentInfo,
      references
    } = req.body;

    const application = await prisma.rentalApplication.create({
      data: {
        propertyId,
        unitId,
        firstName,
        lastName,
        email,
        phone,
        monthlyIncome,
        employmentInfo,
        references: references || [],
        status: 'PENDING'
      }
    });

    res.status(201).json({
      application,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(400).json({ error: 'Failed to submit application' });
  }
});

export default router;
