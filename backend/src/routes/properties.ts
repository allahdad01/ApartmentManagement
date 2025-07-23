import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all properties for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      organizationId: req.user!.organizationId
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
        { city: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) where.status = status;
    if (type) where.type = type;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          units: {
            select: {
              id: true,
              unitNumber: true,
              status: true,
              bedrooms: true,
              bathrooms: true,
              rentAmount: true
            }
          },
          _count: {
            select: {
              units: true,
              leases: true,
              maintenanceRequests: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.property.count({ where })
    ]);

    res.json({
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
router.get('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      },
      include: {
        units: {
          include: {
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            },
            lease: {
              select: {
                id: true,
                startDate: true,
                endDate: true,
                rentAmount: true,
                status: true
              }
            }
          }
        },
        maintenanceRequests: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            tenant: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: {
            units: true,
            leases: true,
            maintenanceRequests: true
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property
router.post('/', authenticateToken, authorizeRoles(['SUPER_ADMIN', 'ORGANIZATION_ADMIN']), async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      country,
      type,
      description,
      totalUnits,
      yearBuilt,
      amenities,
      images,
      features
    } = req.body;

    const property = await prisma.property.create({
      data: {
        name,
        address,
        city,
        state,
        zipCode,
        country,
        type,
        description,
        totalUnits,
        yearBuilt,
        amenities: amenities || [],
        images: images || [],
        features: features || [],
        organizationId: req.user!.organizationId,
        status: 'ACTIVE'
      },
      include: {
        _count: {
          select: {
            units: true,
            leases: true,
            maintenanceRequests: true
          }
        }
      }
    });

    res.status(201).json({
      property,
      message: 'Property created successfully'
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(400).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', authenticateToken, authorizeRoles(['SUPER_ADMIN', 'ORGANIZATION_ADMIN']), async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      country,
      type,
      description,
      totalUnits,
      yearBuilt,
      amenities,
      images,
      features,
      status
    } = req.body;

    const property = await prisma.property.update({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      },
      data: {
        name,
        address,
        city,
        state,
        zipCode,
        country,
        type,
        description,
        totalUnits,
        yearBuilt,
        amenities,
        images,
        features,
        status
      },
      include: {
        _count: {
          select: {
            units: true,
            leases: true,
            maintenanceRequests: true
          }
        }
      }
    });

    res.json({
      property,
      message: 'Property updated successfully'
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(400).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', authenticateToken, authorizeRoles(['SUPER_ADMIN', 'ORGANIZATION_ADMIN']), async (req, res) => {
  try {
    await prisma.property.delete({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(400).json({ error: 'Failed to delete property' });
  }
});

// Get property analytics
router.get('/:id/analytics', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const propertyId = req.params.id;

    const [property, occupancyData, financialData, maintenanceData] = await Promise.all([
      prisma.property.findFirst({
        where: { id: propertyId, organizationId: req.user!.organizationId },
        select: { id: true, name: true, totalUnits: true }
      }),
      prisma.unit.groupBy({
        by: ['status'],
        where: { propertyId },
        _count: { id: true }
      }),
      prisma.payment.aggregate({
        where: {
          lease: {
            unit: { propertyId }
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
        where: { propertyId },
        _count: { id: true }
      })
    ]);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const occupiedUnits = occupancyData.find(item => item.status === 'OCCUPIED')?._count.id || 0;
    const occupancyRate = property.totalUnits > 0 ? (occupiedUnits / property.totalUnits) * 100 : 0;

    res.json({
      property,
      occupancy: {
        total: property.totalUnits,
        occupied: occupiedUnits,
        vacant: property.totalUnits - occupiedUnits,
        rate: occupancyRate
      },
      financial: {
        totalRevenue: financialData._sum.amount || 0,
        totalPayments: financialData._count || 0
      },
      maintenance: maintenanceData,
      occupancyData
    });
  } catch (error) {
    console.error('Get property analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch property analytics' });
  }
});

export default router;
