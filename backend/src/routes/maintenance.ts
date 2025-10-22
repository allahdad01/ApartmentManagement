import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all maintenance requests for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, priority, propertyId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      property: {
        organizationId: req.user!.organizationId
      }
    };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (propertyId) where.propertyId = propertyId;

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { category: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [requests, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true
            }
          },
          unit: {
            select: {
              id: true,
              unitNumber: true
            }
          },
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.maintenanceRequest.count({ where })
    ]);

    res.json({
      requests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get maintenance requests error:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance requests' });
  }
});

// Get single maintenance request
router.get('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const request = await prisma.maintenanceRequest.findFirst({
      where: {
        id: req.params.id,
        property: {
          organizationId: req.user!.organizationId
        }
      },
      include: {
        property: true,
        unit: true,
        tenant: {
          include: {
            emergencyContact: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        },
        workOrders: {
          include: {
            assignedTo: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        comments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                role: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Get maintenance request error:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance request' });
  }
});

// Create maintenance request
router.post('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      propertyId,
      unitId,
      tenantId,
      title,
      description,
      category,
      priority = 'MEDIUM',
      images,
      allowEntry,
      preferredTime
    } = req.body;

    // Verify property belongs to organization
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        organizationId: req.user!.organizationId
      }
    });

    if (!property) {
      return res.status(400).json({ error: 'Property not found or access denied' });
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        propertyId,
        unitId,
        tenantId,
        title,
        description,
        category,
        priority,
        status: 'OPEN',
        images: images || [],
        allowEntry: allowEntry || false,
        preferredTime,
        requestedBy: req.user!.userId
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
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      request,
      message: 'Maintenance request created successfully'
    });
  } catch (error) {
    console.error('Create maintenance request error:', error);
    res.status(400).json({ error: 'Failed to create maintenance request' });
  }
});

// Update maintenance request
router.put('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      status,
      assignedToId,
      estimatedCost,
      actualCost,
      completionNotes,
      images
    } = req.body;

    const request = await prisma.maintenanceRequest.update({
      where: {
        id: req.params.id,
        property: {
          organizationId: req.user!.organizationId
        }
      },
      data: {
        title,
        description,
        category,
        priority,
        status,
        assignedToId,
        estimatedCost,
        actualCost,
        completionNotes,
        images,
        completedAt: status === 'COMPLETED' ? new Date() : undefined
      },
      include: {
        property: {
          select: {
            id: true,
            name: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      request,
      message: 'Maintenance request updated successfully'
    });
  } catch (error) {
    console.error('Update maintenance request error:', error);
    res.status(400).json({ error: 'Failed to update maintenance request' });
  }
});

// Assign maintenance request
router.post('/:id/assign', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { assignedToId, notes } = req.body;

    const request = await prisma.maintenanceRequest.update({
      where: {
        id: req.params.id,
        property: {
          organizationId: req.user!.organizationId
        }
      },
      data: {
        assignedToId,
        status: 'IN_PROGRESS',
        assignedAt: new Date()
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true
          }
        }
      }
    });

    // Add assignment comment
    if (notes) {
      await prisma.maintenanceComment.create({
        data: {
          maintenanceRequestId: req.params.id,
          userId: req.user!.userId,
          comment: notes,
          type: 'ASSIGNMENT'
        }
      });
    }

    res.json({
      request,
      message: 'Maintenance request assigned successfully'
    });
  } catch (error) {
    console.error('Assign maintenance request error:', error);
    res.status(400).json({ error: 'Failed to assign maintenance request' });
  }
});

// Add comment to maintenance request
router.post('/:id/comments', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { comment, type = 'GENERAL', images } = req.body;

    const maintenanceComment = await prisma.maintenanceComment.create({
      data: {
        maintenanceRequestId: req.params.id,
        userId: req.user!.userId,
        comment,
        type,
        images: images || []
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      comment: maintenanceComment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(400).json({ error: 'Failed to add comment' });
  }
});

// Get maintenance analytics
router.get('/analytics/summary', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const [statusCounts, priorityCounts, categoryCounts, monthlyCosts] = await Promise.all([
      prisma.maintenanceRequest.groupBy({
        by: ['status'],
        where: {
          property: {
            organizationId: req.user!.organizationId
          }
        },
        _count: { id: true }
      }),
      prisma.maintenanceRequest.groupBy({
        by: ['priority'],
        where: {
          property: {
            organizationId: req.user!.organizationId
          }
        },
        _count: { id: true }
      }),
      prisma.maintenanceRequest.groupBy({
        by: ['category'],
        where: {
          property: {
            organizationId: req.user!.organizationId
          }
        },
        _count: { id: true }
      }),
      prisma.maintenanceRequest.findMany({
        where: {
          property: {
            organizationId: req.user!.organizationId
          },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
          }
        },
        select: {
          actualCost: true,
          createdAt: true
        }
      })
    ]);

    // Calculate monthly costs
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      const monthRequests = monthlyCosts.filter(req => 
        req.createdAt >= month && 
        req.createdAt < new Date(month.getFullYear(), month.getMonth() + 1, 1)
      );
      
      return {
        month: month.toISOString().slice(0, 7),
        totalCost: monthRequests.reduce((sum, req) => sum + (req.actualCost || 0), 0),
        requestCount: monthRequests.length
      };
    }).reverse();

    res.json({
      statusCounts,
      priorityCounts,
      categoryCounts,
      monthlyData
    });
  } catch (error) {
    console.error('Get maintenance analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance analytics' });
  }
});

export default router;
