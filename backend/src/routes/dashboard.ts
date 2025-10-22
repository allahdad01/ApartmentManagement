import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, checkOrganizationAccess, authorizeRoles } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get dashboard stats for organization admin
router.get('/stats', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const organizationId = req.user!.organizationId;

    const [
      propertyCount,
      tenantCount,
      unitStats,
      revenueStats,
      maintenanceStats,
      recentPayments,
      upcomingLeases
    ] = await Promise.all([
      // Property count
      prisma.property.count({
        where: { organizationId }
      }),
      
      // Tenant count
      prisma.tenant.count({
        where: { organizationId, status: 'ACTIVE' }
      }),
      
      // Unit statistics
      prisma.unit.groupBy({
        by: ['status'],
        where: {
          property: { organizationId }
        },
        _count: { id: true }
      }),
      
      // Revenue statistics (current month)
      prisma.payment.aggregate({
        where: {
          lease: {
            unit: {
              property: { organizationId }
            }
          },
          status: 'PAID',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      
      // Maintenance statistics
      prisma.maintenanceRequest.groupBy({
        by: ['status'],
        where: {
          property: { organizationId }
        },
        _count: { id: true }
      }),
      
      // Recent payments
      prisma.payment.findMany({
        where: {
          lease: {
            unit: {
              property: { organizationId }
            }
          },
          status: 'PAID'
        },
        take: 5,
        orderBy: { paidDate: 'desc' },
        include: {
          tenant: {
            select: {
              firstName: true,
              lastName: true
            }
          },
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
        }
      }),
      
      // Upcoming lease expirations
      prisma.lease.findMany({
        where: {
          unit: {
            property: { organizationId }
          },
          status: 'ACTIVE',
          endDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Next 90 days
          }
        },
        take: 5,
        orderBy: { endDate: 'asc' },
        include: {
          tenant: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
              email: true
            }
          },
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
      })
    ]);

    // Calculate occupancy rate
    const totalUnits = unitStats.reduce((sum, stat) => sum + stat._count.id, 0);
    const occupiedUnits = unitStats.find(stat => stat.status === 'OCCUPIED')?._count.id || 0;
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

    res.json({
      properties: propertyCount,
      tenants: tenantCount,
      occupancy: {
        total: totalUnits,
        occupied: occupiedUnits,
        vacant: totalUnits - occupiedUnits,
        rate: Math.round(occupancyRate * 100) / 100
      },
      revenue: {
        currentMonth: revenueStats._sum.amount || 0,
        paymentCount: revenueStats._count
      },
      maintenance: maintenanceStats,
      recentPayments,
      upcomingLeases
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get super admin dashboard stats
router.get('/super-admin/stats', authenticateToken, authorizeRoles(['SUPER_ADMIN']), async (req, res) => {
  try {
    const [
      organizationStats,
      userStats,
      subscriptionStats,
      revenueStats
    ] = await Promise.all([
      // Organization statistics
      prisma.organization.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      
      // User statistics
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true }
      }),
      
      // Subscription statistics
      prisma.subscription.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      
      // Total revenue across all organizations
      prisma.payment.aggregate({
        where: {
          status: 'PAID',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      })
    ]);

    res.json({
      organizations: organizationStats,
      users: userStats,
      subscriptions: subscriptionStats,
      revenue: {
        currentMonth: revenueStats._sum.amount || 0,
        paymentCount: revenueStats._count
      }
    });
  } catch (error) {
    console.error('Get super admin dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch super admin dashboard stats' });
  }
});

// Get monthly revenue chart data
router.get('/revenue/monthly', authenticateToken, checkOrganizationAccess, async (req, res) => {
  try {
    const organizationId = req.user!.organizationId;
    const months = 12;
    const monthlyData = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const revenue = await prisma.payment.aggregate({
        where: {
          lease: {
            unit: {
              property: { organizationId }
            }
          },
          status: 'PAID',
          paidDate: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { amount: true },
        _count: { id: true }
      });

      monthlyData.push({
        month: startOfMonth.toISOString().slice(0, 7),
        revenue: revenue._sum.amount || 0,
        payments: revenue._count
      });
    }

    res.json(monthlyData);
  } catch (error) {
    console.error('Get monthly revenue error:', error);
    res.status(500).json({ error: 'Failed to fetch monthly revenue data' });
  }
});

export default router;
