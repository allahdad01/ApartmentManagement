import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all mortgages for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const mortgages = await prisma.mortgage.findMany({
      where: {
        property: {
          organizationId: req.user!.organizationId
        }
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ mortgages });
  } catch (error) {
    console.error('Get mortgages error:', error);
    res.status(500).json({ error: 'Failed to fetch mortgages' });
  }
});

// Create mortgage
router.post('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      propertyId,
      lender,
      originalAmount,
      currentBalance,
      interestRate,
      monthlyPayment,
      startDate,
      endDate
    } = req.body;

    const mortgage = await prisma.mortgage.create({
      data: {
        propertyId,
        lender,
        originalAmount,
        currentBalance,
        interestRate,
        monthlyPayment,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      include: {
        property: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      mortgage,
      message: 'Mortgage created successfully'
    });
  } catch (error) {
    console.error('Create mortgage error:', error);
    res.status(400).json({ error: 'Failed to create mortgage' });
  }
});

export default router;
