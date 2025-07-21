// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'property_manager' | 'landlord' | 'tenant';
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Property Types
export interface Property {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  type: 'residential' | 'commercial' | 'mixed_use' | 'industrial';
  propertyClass: 'single_family' | 'multi_family' | 'apartment' | 'condo' | 'townhouse' | 'office' | 'retail' | 'warehouse';
  units: Unit[];
  totalUnits: number;
  yearBuilt?: number;
  squareFootage?: number;
  lotSize?: number;
  amenities: string[];
  images: string[];
  description?: string;
  managerId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  marketValue?: number;
  purchasePrice?: number;
  purchaseDate?: Date;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  type: 'studio' | '1br' | '2br' | '3br' | '4br' | '5br+' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  rent: number;
  deposit: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'notice_given';
  currentLeaseId?: string;
  amenities: string[];
  images: string[];
  description?: string;
  floorPlan?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tenant and Lease Types
export interface Tenant {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  ssn?: string; // Encrypted
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  employment: {
    employer: string;
    position: string;
    monthlyIncome: number;
    employmentStartDate: Date;
  };
  creditScore?: number;
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected' | 'not_required';
  documents: Document[];
  currentLeases: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Lease {
  id: string;
  unitId: string;
  tenantIds: string[];
  type: 'residential' | 'commercial';
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'renewed';
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  petDeposit?: number;
  lateFeePct: number;
  lateFeeFlat: number;
  renewalOptions: {
    automatic: boolean;
    noticePeriod: number; // days
    rentIncrease?: number;
  };
  terms: string;
  documents: Document[];
  signatures: {
    tenantId: string;
    signedAt: Date;
    ipAddress: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Financial Types
export interface Payment {
  id: string;
  leaseId: string;
  tenantId: string;
  type: 'rent' | 'deposit' | 'late_fee' | 'pet_fee' | 'utility' | 'other';
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: 'cash' | 'check' | 'ach' | 'credit_card' | 'online';
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'refunded';
  reference?: string;
  notes?: string;
  fees: {
    processingFee?: number;
    lateFee?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  propertyId?: string;
  unitId?: string;
  category: 'maintenance' | 'utilities' | 'insurance' | 'taxes' | 'management' | 'marketing' | 'legal' | 'other';
  subcategory?: string;
  amount: number;
  date: Date;
  vendor?: string;
  description: string;
  receipt?: string;
  isRecurring: boolean;
  recurringSchedule?: {
    frequency: 'monthly' | 'quarterly' | 'annually';
    nextDate: Date;
  };
  taxDeductible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  leaseId: string;
  tenantId: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  sentDate?: Date;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxable: boolean;
}

// Maintenance Types
export interface MaintenanceRequest {
  id: string;
  unitId: string;
  tenantId?: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'cosmetic' | 'pest_control' | 'other';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled';
  images: string[];
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: Date;
  completedDate?: Date;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'contractor' | 'supplier' | 'service_provider';
  specialties: string[];
  contact: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  rating: number;
  isPreferred: boolean;
  insurance: {
    liability: boolean;
    workersComp: boolean;
    expirationDate?: Date;
  };
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

// Mortgage and Loan Types
export interface Mortgage {
  id: string;
  propertyId: string;
  lender: string;
  loanAmount: number;
  interestRate: number;
  term: number; // months
  monthlyPayment: number;
  startDate: Date;
  maturityDate: Date;
  currentBalance: number;
  type: 'fixed' | 'variable' | 'interest_only';
  escrow: {
    taxes: number;
    insurance: number;
    pmi?: number;
  };
  payments: MortgagePayment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MortgagePayment {
  id: string;
  mortgageId: string;
  paymentDate: Date;
  amount: number;
  principal: number;
  interest: number;
  escrow: number;
  remainingBalance: number;
  status: 'scheduled' | 'paid' | 'late';
  createdAt: Date;
}

// Document Management
export interface Document {
  id: string;
  name: string;
  type: 'lease' | 'application' | 'inspection' | 'receipt' | 'insurance' | 'tax' | 'other';
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  tags: string[];
  relatedTo: {
    type: 'property' | 'unit' | 'tenant' | 'lease' | 'maintenance' | 'vendor';
    id: string;
  };
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics and Reporting
export interface FinancialReport {
  propertyId?: string;
  period: {
    start: Date;
    end: Date;
  };
  income: {
    rent: number;
    fees: number;
    deposits: number;
    other: number;
    total: number;
  };
  expenses: {
    maintenance: number;
    utilities: number;
    insurance: number;
    taxes: number;
    management: number;
    other: number;
    total: number;
  };
  netIncome: number;
  occupancyRate: number;
  avgRentPerUnit: number;
  collectionRate: number;
}

export interface OccupancyReport {
  propertyId: string;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  maintenanceUnits: number;
  occupancyRate: number;
  avgDaysVacant: number;
  turnaroundTime: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'payment_due' | 'maintenance_request' | 'lease_expiring' | 'application_received' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Application and Screening
export interface Application {
  id: string;
  unitId: string;
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    ssn: string; // Encrypted
    currentAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      monthlyRent: number;
      landlordContact: string;
    };
    employment: {
      employer: string;
      position: string;
      monthlyIncome: number;
      employmentLength: number;
      supervisorContact: string;
    };
    references: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
    }[];
    pets: {
      type: string;
      breed: string;
      weight: number;
      age: number;
    }[];
  };
  documents: Document[];
  screening: {
    creditScore?: number;
    backgroundCheck?: 'passed' | 'failed' | 'pending';
    incomeVerification?: 'verified' | 'unverified' | 'pending';
    references?: 'positive' | 'negative' | 'pending';
  };
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// System Configuration
export interface Settings {
  company: {
    name: string;
    logo?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    phone: string;
    email: string;
    website?: string;
  };
  billing: {
    lateFeeGracePeriod: number; // days
    defaultLateFeeFlat: number;
    defaultLateFeePct: number;
    processingFees: {
      ach: number;
      creditCard: number;
    };
  };
  notifications: {
    rentReminders: {
      enabled: boolean;
      daysBefore: number[];
    };
    leaseExpiration: {
      enabled: boolean;
      daysBefore: number[];
    };
    maintenanceUpdates: {
      enabled: boolean;
    };
  };
  integrations: {
    stripe?: {
      enabled: boolean;
      publicKey: string;
      webhookSecret: string;
    };
    plaid?: {
      enabled: boolean;
      clientId: string;
    };
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard Types
export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupancyRate: number;
  monthlyRevenue: number;
  pendingMaintenance: number;
  leasesExpiring: number;
  overduePayments: number;
  applications: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}