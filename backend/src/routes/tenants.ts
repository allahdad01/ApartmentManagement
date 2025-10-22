import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all tenants for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      organizationId: req.user!.organizationId
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) where.status = status;

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
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
          lease: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              rentAmount: true,
              status: true
            }
          },
          payments: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              payments: true,
              maintenanceRequests: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tenant.count({ where })
    ]);

    res.json({
      tenants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Get single tenant
router.get('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      },
      include: {
        unit: {
          include: {
            property: true
          }
        },
        lease: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        maintenanceRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            property: {
              select: {
                name: true
              }
            }
          }
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        },
        emergencyContact: true
      }
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// Create tenant
router.post('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      socialSecurityNumber,
      driversLicense,
      unitId,
      emergencyContact,
      employmentInfo,
      documents
    } = req.body;

    const tenant = await prisma.tenant.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        socialSecurityNumber,
        driversLicense,
        unitId,
        organizationId: req.user!.organizationId,
        status: 'ACTIVE',
        emergencyContact: emergencyContact ? {
          create: emergencyContact
        } : undefined,
        employmentInfo,
        documents: documents ? {
          create: documents
        } : undefined
      },
      include: {
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        emergencyContact: true
      }
    });

    res.status(201).json({
      tenant,
      message: 'Tenant created successfully'
    });
  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(400).json({ error: 'Failed to create tenant' });
  }
});

// Update tenant
router.put('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      socialSecurityNumber,
      driversLicense,
      unitId,
      status,
      employmentInfo
    } = req.body;

    const tenant = await prisma.tenant.update({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        socialSecurityNumber,
        driversLicense,
        unitId,
        status,
        employmentInfo
      },
      include: {
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        emergencyContact: true
      }
    });

    res.json({
      tenant,
      message: 'Tenant updated successfully'
    });
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(400).json({ error: 'Failed to update tenant' });
  }
});

// Delete tenant
router.delete('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    await prisma.tenant.delete({
      where: {
        id: req.params.id,
        organizationId: req.user!.organizationId
      }
    });

    res.json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Delete tenant error:', error);
    res.status(400).json({ error: 'Failed to delete tenant' });
  }
});

// Get tenant payment history
router.get('/:id/payments', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: {
          tenantId: req.params.id,
          lease: {
            unit: {
              property: {
                organizationId: req.user!.organizationId
              }
            }
          }
        },
        skip,
        take: Number(limit),
        include: {
          lease: {
            include: {
              unit: {
                include: {
                  property: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.payment.count({
        where: {
          tenantId: req.params.id,
          lease: {
            unit: {
              property: {
                organizationId: req.user!.organizationId
              }
            }
          }
        }
      })
    ]);

    res.json({
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get tenant payments error:', error);
    res.status(500).json({ error: 'Failed to fetch tenant payments' });
  }
});

// Get tenant maintenance requests
router.get('/:id/maintenance', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where: {
          tenantId: req.params.id,
          property: {
            organizationId: req.user!.organizationId
          }
        },
        skip,
        take: Number(limit),
        include: {
          property: {
            select: {
              name: true
            }
          },
          unit: {
            select: {
              unitNumber: true
            }
          },
          assignedTo: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.maintenanceRequest.count({
        where: {
          tenantId: req.params.id,
          property: {
            organizationId: req.user!.organizationId
          }
        }
      })
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
    console.error('Get tenant maintenance requests error:', error);
    res.status(500).json({ error: 'Failed to fetch tenant maintenance requests' });
  }
});

export default router;
