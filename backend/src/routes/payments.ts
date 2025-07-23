import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all payments for organization
router.get('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, type, propertyId, tenantId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      lease: {
        unit: {
          property: {
            organizationId: req.user!.organizationId
          }
        }
      }
    };

    if (status) where.status = status;
    if (type) where.type = type;
    if (tenantId) where.tenantId = tenantId;
    if (propertyId) {
      where.lease.unit.propertyId = propertyId;
    }

    if (search) {
      where.OR = [
        { tenant: { firstName: { contains: search as string, mode: 'insensitive' } } },
        { tenant: { lastName: { contains: search as string, mode: 'insensitive' } } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
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
          lease: {
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
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.payment.count({ where })
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
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get single payment
router.get('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        id: req.params.id,
        lease: {
          unit: {
            property: {
              organizationId: req.user!.organizationId
            }
          }
        }
      },
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
          include: {
            unit: {
              include: {
                property: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Create payment/invoice
router.post('/', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      tenantId,
      leaseId,
      amount,
      type,
      description,
      dueDate,
      lateFee,
      isRecurring,
      recurringFrequency
    } = req.body;

    // Verify lease belongs to organization
    const lease = await prisma.lease.findFirst({
      where: {
        id: leaseId,
        unit: {
          property: {
            organizationId: req.user!.organizationId
          }
        }
      }
    });

    if (!lease) {
      return res.status(400).json({ error: 'Lease not found or access denied' });
    }

    const payment = await prisma.payment.create({
      data: {
        tenantId,
        leaseId,
        amount,
        type,
        description,
        dueDate: new Date(dueDate),
        lateFee: lateFee || 0,
        status: 'PENDING',
        isRecurring: isRecurring || false,
        recurringFrequency,
        createdBy: req.user!.userId
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
        lease: {
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
            }
          }
        }
      }
    });

    res.status(201).json({
      payment,
      message: 'Payment/Invoice created successfully'
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(400).json({ error: 'Failed to create payment' });
  }
});

// Update payment
router.put('/:id', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const {
      amount,
      type,
      description,
      dueDate,
      lateFee,
      status,
      paidDate,
      paymentMethod,
      transactionId,
      notes
    } = req.body;

    const payment = await prisma.payment.update({
      where: {
        id: req.params.id,
        lease: {
          unit: {
            property: {
              organizationId: req.user!.organizationId
            }
          }
        }
      },
      data: {
        amount,
        type,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        lateFee,
        status,
        paidDate: paidDate ? new Date(paidDate) : undefined,
        paymentMethod,
        transactionId,
        notes
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
        lease: {
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
            }
          }
        }
      }
    });

    res.json({
      payment,
      message: 'Payment updated successfully'
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(400).json({ error: 'Failed to update payment' });
  }
});

// Mark payment as paid
router.post('/:id/mark-paid', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { paymentMethod, transactionId, notes, paidDate } = req.body;

    const payment = await prisma.payment.update({
      where: {
        id: req.params.id,
        lease: {
          unit: {
            property: {
              organizationId: req.user!.organizationId
            }
          }
        }
      },
      data: {
        status: 'PAID',
        paidDate: paidDate ? new Date(paidDate) : new Date(),
        paymentMethod,
        transactionId,
        notes
      },
      include: {
        tenant: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      payment,
      message: 'Payment marked as paid successfully'
    });
  } catch (error) {
    console.error('Mark payment as paid error:', error);
    res.status(400).json({ error: 'Failed to mark payment as paid' });
  }
});

// Generate recurring payments
router.post('/generate-recurring', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const { months = 1 } = req.body;

    // Get all active leases with recurring payments
    const activeLeases = await prisma.lease.findMany({
      where: {
        status: 'ACTIVE',
        unit: {
          property: {
            organizationId: req.user!.organizationId
          }
        }
      },
      include: {
        tenant: true,
        unit: {
          include: {
            property: true
          }
        }
      }
    });

    const paymentsToCreate = [];
    const currentDate = new Date();

    for (const lease of activeLeases) {
      for (let i = 0; i < months; i++) {
        const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 1);
        
        // Check if payment already exists for this month
        const existingPayment = await prisma.payment.findFirst({
          where: {
            leaseId: lease.id,
            type: 'RENT',
            dueDate: {
              gte: new Date(dueDate.getFullYear(), dueDate.getMonth(), 1),
              lt: new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 1)
            }
          }
        });

        if (!existingPayment) {
          paymentsToCreate.push({
            tenantId: lease.tenantId,
            leaseId: lease.id,
            amount: lease.rentAmount,
            type: 'RENT',
            description: `Rent for ${dueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            dueDate,
            status: 'PENDING',
            isRecurring: true,
            recurringFrequency: 'MONTHLY',
            createdBy: req.user!.userId
          });
        }
      }
    }

    if (paymentsToCreate.length > 0) {
      await prisma.payment.createMany({
        data: paymentsToCreate
      });
    }

    res.json({
      message: `Generated ${paymentsToCreate.length} recurring payments`,
      count: paymentsToCreate.length
    });
  } catch (error) {
    console.error('Generate recurring payments error:', error);
    res.status(500).json({ error: 'Failed to generate recurring payments' });
  }
});

// Get payment analytics
router.get('/analytics/summary', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const [monthlyData, yearlyData, statusCounts, recentPayments] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          lease: {
            unit: {
              property: {
                organizationId: req.user!.organizationId
              }
            }
          },
          createdAt: {
            gte: firstDayOfMonth
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.payment.aggregate({
        where: {
          lease: {
            unit: {
              property: {
                organizationId: req.user!.organizationId
              }
            }
          },
          createdAt: {
            gte: firstDayOfYear
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.payment.groupBy({
        by: ['status'],
        where: {
          lease: {
            unit: {
              property: {
                organizationId: req.user!.organizationId
              }
            }
          }
        },
        _count: { id: true },
        _sum: { amount: true }
      }),
      prisma.payment.findMany({
        where: {
          lease: {
            unit: {
              property: {
                organizationId: req.user!.organizationId
              }
            }
          }
        },
        take: 10,
        orderBy: { paidDate: 'desc' },
        include: {
          tenant: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })
    ]);

    res.json({
      monthly: {
        totalAmount: monthlyData._sum.amount || 0,
        totalCount: monthlyData._count
      },
      yearly: {
        totalAmount: yearlyData._sum.amount || 0,
        totalCount: yearlyData._count
      },
      statusCounts,
      recentPayments
    });
  } catch (error) {
    console.error('Get payment analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch payment analytics' });
  }
});

export default router;
