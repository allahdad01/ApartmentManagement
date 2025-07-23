import axios, { AxiosInstance } from 'axios';

// Types (matching Prisma schema exactly)
export interface User {
  id: string;
  email: string;
  // passwordHash is excluded from frontend interface for security
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PROPERTY_MANAGER' | 'LANDLORD' | 'TENANT';
  organizationId?: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  email?: string;
  phone?: string;
  website?: string;
  subscriptionPlan: any; // JSON field
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';
  subscriptionStartDate: string;
  subscriptionEndDate?: string;
  maxProperties: number;
  maxUsers: number;
  features: string[];
  settings: any; // JSON field
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Subscription is now part of Organization model in Prisma schema
// Keeping this interface for backward compatibility if needed
export interface Subscription {
  id: string;
  organizationId: string;
  plan: 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  expiresAt: string;
}

export interface Property {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED_USE' | 'INDUSTRIAL';
  propertyClass: 'SINGLE_FAMILY' | 'MULTI_FAMILY' | 'APARTMENT' | 'CONDO' | 'TOWNHOUSE' | 'OFFICE' | 'RETAIL' | 'WAREHOUSE';
  address: any; // JSON field in schema
  totalUnits: number;
  yearBuilt?: number;
  squareFootage?: number;
  lotSize?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  marketValue?: number;
  amenities: string[];
  images: string[];
  managerId: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  units?: Unit[];
  _count?: {
    units: number;
    leases: number;
    maintenanceRequests: number;
  };
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: string;
  squareFootage?: number;
  bedrooms: number;
  bathrooms: number; // Decimal in schema
  rent: number; // Decimal in schema
  deposit: number; // Decimal in schema
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'UNAVAILABLE';
  amenities: string[];
  images: string[];
  currentLeaseId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  property?: Property;
  currentLease?: Lease;
  leases?: Lease[];
}

export interface Tenant {
  id: string;
  organizationId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  emergencyContact?: any; // JSON field in schema
  employment?: any; // JSON field in schema
  creditScore?: number;
  backgroundCheckStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
  documents: any[]; // JSON array in schema
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  leases?: Lease[];
  payments?: Payment[];
}

export interface EmergencyContact {
  id: string;
  tenantId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Lease {
  id: string;
  organizationId: string;
  propertyId: string;
  unitId: string;
  tenantIds: string[]; // Array in schema
  startDate: string;
  endDate: string;
  rentAmount: number; // Decimal in schema
  depositAmount: number; // Decimal in schema
  leaseTerms: string;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'RENEWED';
  paymentDueDay: number;
  lateFeeAmount: number; // Decimal in schema
  lateFeeGracePeriod: number;
  petPolicy?: any; // JSON field
  utilities: any[]; // JSON array
  documents: any[]; // JSON array
  renewalOptions: any[]; // JSON array
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  property?: Property;
  unit?: Unit;
  tenants?: Tenant[];
  payments?: Payment[];
}

export interface Payment {
  id: string;
  organizationId: string;
  leaseId: string;
  tenantId: string;
  type: string;
  amount: number; // Decimal in schema
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'CASH' | 'CHECK' | 'ACH' | 'CREDIT_CARD' | 'ONLINE' | 'MONEY_ORDER';
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL' | 'REFUNDED';
  reference?: string;
  notes?: string;
  fees: any; // JSON field
  createdAt: string;
  updatedAt: string;
  lease?: Lease;
  tenant?: Tenant;
}

export interface MaintenanceRequest {
  id: string;
  organizationId: string;
  unitId: string;
  tenantId?: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  images: string[];
  assignedTo?: string;
  estimatedCost?: number; // Decimal in schema
  actualCost?: number; // Decimal in schema
  scheduledDate?: string;
  completedDate?: string;
  notes: string[]; // Array in schema
  createdAt: string;
  updatedAt: string;
  unit?: Unit;
  tenant?: Tenant;
  assignedUser?: User;
  property?: Property;
}

export interface MaintenanceComment {
  id: string;
  maintenanceRequestId: string;
  userId: string;
  comment: string;
  type: 'GENERAL' | 'STATUS_UPDATE' | 'ASSIGNMENT' | 'COMPLETION';
  images: string[];
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    organizationId?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.put('/auth/profile', userData);
    return response.data.user;
  }

  // Properties
  async getProperties(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
  }): Promise<PaginationResponse<Property>> {
    const response = await this.api.get('/properties', { params });
    return {
      data: response.data.properties,
      pagination: response.data.pagination
    };
  }

  async getProperty(id: string): Promise<Property> {
    const response = await this.api.get(`/properties/${id}`);
    return response.data;
  }

  async createProperty(propertyData: Partial<Property>): Promise<Property> {
    const response = await this.api.post('/properties', propertyData);
    return response.data.property;
  }

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    const response = await this.api.put(`/properties/${id}`, propertyData);
    return response.data.property;
  }

  async deleteProperty(id: string): Promise<void> {
    await this.api.delete(`/properties/${id}`);
  }

  // Tenants
  async getTenants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<PaginationResponse<Tenant>> {
    const response = await this.api.get('/tenants', { params });
    return {
      data: response.data.tenants,
      pagination: response.data.pagination
    };
  }

  async getTenant(id: string): Promise<Tenant> {
    const response = await this.api.get(`/tenants/${id}`);
    return response.data;
  }

  async createTenant(tenantData: Partial<Tenant>): Promise<Tenant> {
    const response = await this.api.post('/tenants', tenantData);
    return response.data.tenant;
  }

  async updateTenant(id: string, tenantData: Partial<Tenant>): Promise<Tenant> {
    const response = await this.api.put(`/tenants/${id}`, tenantData);
    return response.data.tenant;
  }

  // Payments
  async getPayments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    propertyId?: string;
    tenantId?: string;
  }): Promise<PaginationResponse<Payment>> {
    const response = await this.api.get('/payments', { params });
    return {
      data: response.data.payments,
      pagination: response.data.pagination
    };
  }

  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const response = await this.api.post('/payments', paymentData);
    return response.data.payment;
  }

  async markPaymentAsPaid(id: string, data: {
    paymentMethod: string;
    transactionId?: string;
    notes?: string;
    paidDate?: string;
  }): Promise<Payment> {
    const response = await this.api.post(`/payments/${id}/mark-paid`, data);
    return response.data.payment;
  }

  // Maintenance
  async getMaintenanceRequests(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    propertyId?: string;
  }): Promise<PaginationResponse<MaintenanceRequest>> {
    const response = await this.api.get('/maintenance', { params });
    return {
      data: response.data.requests,
      pagination: response.data.pagination
    };
  }

  async createMaintenanceRequest(requestData: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    const response = await this.api.post('/maintenance', requestData);
    return response.data.request;
  }

  async updateMaintenanceRequest(id: string, requestData: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    const response = await this.api.put(`/maintenance/${id}`, requestData);
    return response.data.request;
  }

  // Dashboard
  async getDashboardStats(): Promise<any> {
    const response = await this.api.get('/dashboard/stats');
    return response.data;
  }

  async getSuperAdminDashboardStats(): Promise<any> {
    const response = await this.api.get('/dashboard/super-admin/stats');
    return response.data;
  }
}

export const apiService = new ApiService();
