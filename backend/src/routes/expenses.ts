import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all expenses for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, propertyId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      property: {
        organizationId: req.user!.organizationId
      }
    };

    if (category) where.category = category;
    if (propertyId) where.propertyId = propertyId;

    if (search) {
      where.OR = [
        { description: { contains: search as string, mode: 'insensitive' } },
        { vendor: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          property: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { date: 'desc' }
      }),
      prisma.expense.count({ where })
    ]);

    res.json({
      expenses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create expense
router.post('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      propertyId,
      amount,
      category,
      description,
      vendor,
      date,
      receipt
    } = req.body;

    const expense = await prisma.expense.create({
      data: {
        propertyId,
        amount,
        category,
        description,
        vendor,
        date: new Date(date),
        receipt,
        createdBy: req.user!.userId
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
      expense,
      message: 'Expense created successfully'
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(400).json({ error: 'Failed to create expense' });
  }
});

export default router;
