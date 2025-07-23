import axios, { AxiosInstance } from 'axios';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'PROPERTY_MANAGER' | 'TENANT';
  phone?: string;
  avatar?: string;
  organizationId?: string;
  organization?: Organization;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  type: 'PROPERTY_MANAGEMENT' | 'REAL_ESTATE' | 'INDIVIDUAL';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  contactPerson?: string;
  website?: string;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

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
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'COMMERCIAL';
  description?: string;
  totalUnits: number;
  yearBuilt?: number;
  amenities: string[];
  images: string[];
  features: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  organizationId: string;
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
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  rentAmount: number;
  securityDeposit?: number;
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'UNAVAILABLE';
  features: string[];
  images: string[];
  tenantId?: string;
  tenant?: Tenant;
  lease?: Lease;
  property?: Property;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  unitId?: string;
  organizationId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MOVED_OUT';
  employmentInfo?: any;
  emergencyContact?: EmergencyContact;
  unit?: Unit;
  lease?: Lease;
  payments?: Payment[];
  maintenanceRequests?: MaintenanceRequest[];
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
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
  tenantId: string;
  unitId: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  securityDeposit: number;
  petDeposit?: number;
  leaseTerms?: any;
  specialConditions?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'PENDING';
  tenant?: Tenant;
  unit?: Unit;
  payments?: Payment[];
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  leaseId: string;
  amount: number;
  type: 'RENT' | 'DEPOSIT' | 'FEE' | 'UTILITY' | 'OTHER';
  description: string;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentMethod?: string;
  transactionId?: string;
  lateFee?: number;
  isRecurring: boolean;
  recurringFrequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  notes?: string;
  tenant?: Tenant;
  lease?: Lease;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  title: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  images: string[];
  allowEntry: boolean;
  preferredTime?: string;
  estimatedCost?: number;
  actualCost?: number;
  completionNotes?: string;
  assignedToId?: string;
  assignedTo?: User;
  assignedAt?: string;
  completedAt?: string;
  requestedBy: string;
  property?: Property;
  unit?: Unit;
  tenant?: Tenant;
  comments?: MaintenanceComment[];
  createdAt: string;
  updatedAt: string;
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
