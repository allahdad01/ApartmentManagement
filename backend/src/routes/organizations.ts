import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all organizations (Super Admin only)
router.get('/', authenticateToken, authorizeRoles(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { contactPerson: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) where.status = status;
    if (type) where.type = type;

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          subscription: {
            select: {
              plan: true,
              status: true,
              expiresAt: true
            }
          },
          _count: {
            select: {
              users: true,
              properties: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.organization.count({ where })
    ]);

    res.json({
      organizations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// Get single organization
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Super admin can access any organization, others only their own
    const where: any = { id: req.params.id };
    
    if (req.user!.role !== 'SUPER_ADMIN') {
      where.id = req.user!.organizationId;
    }

    const organization = await prisma.organization.findFirst({
      where,
      include: {
        subscription: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            lastLogin: true
          }
        },
        properties: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            status: true,
            totalUnits: true
          }
        },
        _count: {
          select: {
            users: true,
            properties: true
          }
        }
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    console.error('Get organization error:', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Create organization (Super Admin only)
router.post('/', authenticateToken, authorizeRoles(['SUPER_ADMIN']), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      type,
      contactPerson,
      website,
      subscriptionPlan
    } = req.body;

    const organization = await prisma.organization.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        type,
        contactPerson,
        website,
        status: 'ACTIVE',
        subscription: subscriptionPlan ? {
          create: {
            plan: subscriptionPlan,
            status: 'ACTIVE',
            startDate: new Date(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
          }
        } : undefined
      },
      include: {
        subscription: true
      }
    });

    res.status(201).json({
      organization,
      message: 'Organization created successfully'
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(400).json({ error: 'Failed to create organization' });
  }
});

// Update organization
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      type,
      contactPerson,
      website,
      status
    } = req.body;

    // Super admin can update any organization, others only their own
    const where: any = { id: req.params.id };
    
    if (req.user!.role !== 'SUPER_ADMIN') {
      where.id = req.user!.organizationId;
      // Non-super admins cannot change status
      delete req.body.status;
    }

    const organization = await prisma.organization.update({
      where,
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        type,
        contactPerson,
        website,
        ...(req.user!.role === 'SUPER_ADMIN' && { status })
      },
      include: {
        subscription: true
      }
    });

    res.json({
      organization,
      message: 'Organization updated successfully'
    });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(400).json({ error: 'Failed to update organization' });
  }
});

// Delete organization (Super Admin only)
router.delete('/:id', authenticateToken, authorizeRoles(['SUPER_ADMIN']), async (req, res) => {
  try {
    await prisma.organization.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(400).json({ error: 'Failed to delete organization' });
  }
});

// Get organization analytics
router.get('/:id/analytics', authenticateToken, async (req, res) => {
  try {
    // Super admin can access any organization, others only their own
    const organizationId = req.user!.role === 'SUPER_ADMIN' ? req.params.id : req.user!.organizationId;

    const [userStats, propertyStats, financialStats, maintenanceStats] = await Promise.all([
      prisma.user.groupBy({
        by: ['role'],
        where: { organizationId },
        _count: { id: true }
      }),
      prisma.property.groupBy({
        by: ['status'],
        where: { organizationId },
        _count: { id: true }
      }),
      prisma.payment.aggregate({
        where: {
          lease: {
            unit: {
              property: { organizationId }
            }
          },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.maintenanceRequest.groupBy({
        by: ['status'],
        where: {
          property: { organizationId }
        },
        _count: { id: true }
      })
    ]);

    const totalProperties = propertyStats.reduce((sum, stat) => sum + stat._count.id, 0);
    const totalUsers = userStats.reduce((sum, stat) => sum + stat._count.id, 0);

    res.json({
      users: {
        total: totalUsers,
        byRole: userStats
      },
      properties: {
        total: totalProperties,
        byStatus: propertyStats
      },
      financial: {
        totalRevenue: financialStats._sum.amount || 0,
        totalPayments: financialStats._count
      },
      maintenance: {
        byStatus: maintenanceStats
      }
    });
  } catch (error) {
    console.error('Get organization analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch organization analytics' });
  }
});

// Update organization subscription (Super Admin only)
router.put('/:id/subscription', authenticateToken, authorizeRoles(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { plan, status, expiresAt } = req.body;

    const subscription = await prisma.subscription.upsert({
      where: { organizationId: req.params.id },
      update: {
        plan,
        status,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      },
      create: {
        organizationId: req.params.id,
        plan,
        status,
        startDate: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      subscription,
      message: 'Subscription updated successfully'
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(400).json({ error: 'Failed to update subscription' });
  }
});

export default router;
