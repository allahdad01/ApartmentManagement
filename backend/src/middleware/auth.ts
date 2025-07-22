import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { UserRole } from '@prisma/client';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        organizationId?: string;
        permissions: string[];
      };
    }
  }
}

// JWT payload interface
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  iat?: number;
  exp?: number;
}

// Authenticate JWT token
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    
    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        organization: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId || undefined,
      permissions: user.permissions
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check if user has required role
export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user has required permission
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.permissions.includes(permission) && req.user.role !== UserRole.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Ensure user belongs to organization (for multi-tenant isolation)
export const requireOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admins can access any organization
    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    // Regular users must have an organization
    if (!req.user.organizationId) {
      return res.status(403).json({
        success: false,
        message: 'Organization access required'
      });
    }

    // Verify organization is active
    const organization = await prisma.organization.findUnique({
      where: { id: req.user.organizationId }
    });

    if (!organization || !organization.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Organization is inactive or not found'
      });
    }

    next();
  } catch (error) {
    console.error('Organization check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check subscription limits
export const checkSubscriptionLimits = (resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.user.role === UserRole.SUPER_ADMIN) {
        return next(); // Super admins bypass limits
      }

      if (!req.user.organizationId) {
        return res.status(403).json({
          success: false,
          message: 'Organization required'
        });
      }

      const organization = await prisma.organization.findUnique({
        where: { id: req.user.organizationId },
        include: {
          properties: true,
          users: true
        }
      });

      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }

      // Check specific resource limits
      switch (resource) {
        case 'properties':
          if (organization.properties.length >= organization.maxProperties) {
            return res.status(403).json({
              success: false,
              message: `Property limit reached (${organization.maxProperties}). Please upgrade your plan.`
            });
          }
          break;
        
        case 'users':
          if (organization.users.length >= organization.maxUsers) {
            return res.status(403).json({
              success: false,
              message: `User limit reached (${organization.maxUsers}). Please upgrade your plan.`
            });
          }
          break;
      }

      next();
    } catch (error) {
      console.error('Subscription limit check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

// Optional authentication (for public endpoints that can work with or without auth)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue without authentication
  }

  try {
    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId || undefined,
        permissions: user.permissions
      };
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error.message);
  }

  next();
};