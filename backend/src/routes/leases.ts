import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all leases for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, propertyId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      unit: {
        property: {
          organizationId: req.user!.organizationId
        }
      }
    };

    if (status) where.status = status;
    if (propertyId) where.unit = { propertyId };

    if (search) {
      where.OR = [
        { tenant: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { tenant: { lastName: { contains: search as string, mode: 'insensitive' } } },
        { unit: { unitNumber: { contains: search as string, mode: 'insensitive' } } }
      ];
    }

    const [leases, total] = await Promise.all([
      prisma.lease.findMany({
        where,
        skip,
        take: Number(limit),
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
          unit: {
            include: {
              property: {
                select: {
                  id: true,
                  name: true,
                  address: true
                }
              }
            }
          },
          payments: {
            select: {
              id: true,
              amount: true,
              status: true,
              dueDate: true,
              paidDate: true
            },
            orderBy: { dueDate: 'desc' },
            take: 3
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lease.count({ where })
    ]);

    res.json({
      leases,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get leases error:', error);
    res.status(500).json({ error: 'Failed to fetch leases' });
  }
});

// Get single lease
router.get('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const lease = await prisma.lease.findFirst({
      where: {
        id: req.params.id,
        unit: {
          property: {
            organizationId: req.user!.organizationId
          }
        }
      },
      include: {
        tenant: {
          include: {
            emergencyContact: true
          }
        },
        unit: {
          include: {
            property: true
          }
        },
        payments: {
          orderBy: { dueDate: 'desc' }
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!lease) {
      return res.status(404).json({ error: 'Lease not found' });
    }

    res.json(lease);
  } catch (error) {
    console.error('Get lease error:', error);
    res.status(500).json({ error: 'Failed to fetch lease' });
  }
});

// Create lease
router.post('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      tenantId,
      unitId,
      startDate,
      endDate,
      rentAmount,
      securityDeposit,
      petDeposit,
      leaseTerms,
      specialConditions,
      documents
    } = req.body;

    // Verify unit belongs to organization
    const unit = await prisma.unit.findFirst({
      where: {
        id: unitId,
        property: {
          organizationId: req.user!.organizationId
        }
      }
    });

    if (!unit) {
      return res.status(400).json({ error: 'Unit not found or access denied' });
    }

    const lease = await prisma.lease.create({
      data: {
        tenantId,
        unitId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentAmount,
        securityDeposit,
        petDeposit,
        leaseTerms,
        specialConditions,
        status: 'ACTIVE',
        documents: documents ? {
          create: documents
        } : undefined
      },
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Update unit status to occupied
    await prisma.unit.update({
      where: { id: unitId },
      data: { 
        status: 'OCCUPIED',
        tenantId: tenantId
      }
    });

    res.status(201).json({
      lease,
      message: 'Lease created successfully'
    });
  } catch (error) {
    console.error('Create lease error:', error);
    res.status(400).json({ error: 'Failed to create lease' });
  }
});

// Update lease
router.put('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      rentAmount,
      securityDeposit,
      petDeposit,
      leaseTerms,
      specialConditions,
      status
    } = req.body;

    const lease = await prisma.lease.update({
      where: {
        id: req.params.id,
        unit: {
          property: {
            organizationId: req.user!.organizationId
          }
        }
      },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        rentAmount,
        securityDeposit,
        petDeposit,
        leaseTerms,
        specialConditions,
        status
      },
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.json({
      lease,
      message: 'Lease updated successfully'
    });
  } catch (error) {
    console.error('Update lease error:', error);
    res.status(400).json({ error: 'Failed to update lease' });
  }
});

// Terminate lease
router.post('/:id/terminate', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { terminationDate, reason, notes } = req.body;

    const lease = await prisma.lease.update({
      where: {
        id: req.params.id,
        unit: {
          property: {
            organizationId: req.user!.organizationId
          }
        }
      },
      data: {
        status: 'TERMINATED',
        terminationDate: new Date(terminationDate),
        terminationReason: reason,
        terminationNotes: notes
      },
      include: {
        unit: true
      }
    });

    // Update unit status to vacant
    await prisma.unit.update({
      where: { id: lease.unitId },
      data: { 
        status: 'VACANT',
        tenantId: null
      }
    });

    res.json({
      lease,
      message: 'Lease terminated successfully'
    });
  } catch (error) {
    console.error('Terminate lease error:', error);
    res.status(400).json({ error: 'Failed to terminate lease' });
  }
});

// Renew lease
router.post('/:id/renew', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { newEndDate, newRentAmount, renewalTerms } = req.body;

    const oldLease = await prisma.lease.findFirst({
      where: {
        id: req.params.id,
        unit: {
          property: {
            organizationId: req.user!.organizationId
          }
        }
      }
    });

    if (!oldLease) {
      return res.status(404).json({ error: 'Lease not found' });
    }

    // Create new lease
    const newLease = await prisma.lease.create({
      data: {
        tenantId: oldLease.tenantId,
        unitId: oldLease.unitId,
        startDate: oldLease.endDate,
        endDate: new Date(newEndDate),
        rentAmount: newRentAmount || oldLease.rentAmount,
        securityDeposit: oldLease.securityDeposit,
        petDeposit: oldLease.petDeposit,
        leaseTerms: renewalTerms || oldLease.leaseTerms,
        status: 'ACTIVE',
        previousLeaseId: oldLease.id
      },
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    // Update old lease status
    await prisma.lease.update({
      where: { id: oldLease.id },
      data: { status: 'EXPIRED' }
    });

    res.status(201).json({
      lease: newLease,
      message: 'Lease renewed successfully'
    });
  } catch (error) {
    console.error('Renew lease error:', error);
    res.status(400).json({ error: 'Failed to renew lease' });
  }
});

export default router;
