// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'property_manager' | 'landlord' | 'tenant';
  phone?: string;
  avatar?: string;
  organizationId?: string; // null for super_admin, required for others
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Organization/Tenant Types
export interface Organization {
  id: string;
  name: string;
  slug: string; // unique identifier for subdomain
  description?: string;
  logo?: string;
  address: Address;
  phone?: string;
  email?: string;
  website?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'inactive' | 'suspended' | 'trial' | 'cancelled';
  subscriptionStartDate: Date;
  subscriptionEndDate?: Date;
  maxProperties: number;
  maxUsers: number;
  features: string[]; // enabled features for this organization
  settings: OrganizationSettings;
  ownerId: string; // primary admin user
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  maxProperties: number;
  maxUsers: number;
  features: string[];
  isActive: boolean;
}

export interface OrganizationSettings {
  timezone: string;
  currency: string;
  dateFormat: string;
  allowTenantPortal: boolean;
  allowOnlinePayments: boolean;
  autoLateFeesEnabled: boolean;
  lateFeeAmount: number;
  lateFeeGracePeriod: number; // days
  maintenanceAutoAssignment: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  customBranding: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    companyName?: string;
  };
}

// Platform Analytics for Super Admin
export interface PlatformStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalUsers: number;
  totalProperties: number;
  totalRevenue: number;
  monthlyRevenue: number;
  churnRate: number;
  averagePropertiesPerOrg: number;
  subscriptionBreakdown: {
    [planName: string]: number;
  };
  recentSignups: Organization[];
  topPerformingOrgs: {
    organization: Organization;
    propertyCount: number;
    revenue: number;
  }[];
}

// Billing and Subscription Types
export interface Invoice {
  id: string;
  organizationId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidDate?: Date;
  subscriptionPeriodStart: Date;
  subscriptionPeriodEnd: Date;
  lineItems: InvoiceLineItem[];
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Property Types (enhanced for multi-tenant)
export interface Property {
  id: string;
  organizationId: string; // belongs to an organization
  name: string;
  description?: string;
  address: Address;
  type: 'residential' | 'commercial' | 'mixed_use' | 'industrial';
  propertyClass: 'single_family' | 'multi_family' | 'apartment' | 'condo' | 'townhouse' | 'office' | 'retail' | 'warehouse';
  units: Unit[];
  totalUnits: number;
  yearBuilt?: number;
  squareFootage?: number;
  lotSize?: number;
  purchasePrice?: number;
  purchaseDate?: Date;
  marketValue?: number;
  amenities: string[];
  images: string[];
  managerId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  organizationId: string;
  unitNumber: string;
  type: 'studio' | '1br' | '2br' | '3br' | '4br+' | 'office' | 'retail' | 'warehouse';
  squareFootage?: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  deposit: number;
  status: 'vacant' | 'occupied' | 'maintenance' | 'unavailable';
  amenities: string[];
  images: string[];
  currentLeaseId?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Tenant Types (enhanced for multi-tenant)
export interface Tenant {
  id: string;
  organizationId: string;
  userId?: string; // linked user account for tenant portal
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  emergencyContact?: EmergencyContact;
  employment?: EmploymentInfo;
  creditScore?: number;
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected' | 'not_required';
  documents: Document[];
  currentLeases: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
}

export interface EmploymentInfo {
  employer: string;
  position: string;
  monthlyIncome: number;
  employmentStartDate: Date;
  supervisorName?: string;
  supervisorPhone?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'lease' | 'application' | 'id' | 'income_proof' | 'background_check' | 'other';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Lease Types
export interface Lease {
  id: string;
  organizationId: string;
  propertyId: string;
  unitId: string;
  tenantIds: string[];
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  depositAmount: number;
  leaseTerms: string;
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'renewed';
  paymentDueDay: number; // day of month
  lateFeeAmount: number;
  lateFeeGracePeriod: number; // days
  petPolicy?: PetPolicy;
  utilities: UtilityInfo[];
  documents: Document[];
  renewalOptions?: RenewalOption[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface PetPolicy {
  allowed: boolean;
  deposit?: number;
  monthlyFee?: number;
  restrictions?: string;
}

export interface UtilityInfo {
  type: 'electric' | 'gas' | 'water' | 'internet' | 'cable' | 'trash';
  includedInRent: boolean;
  provider?: string;
  accountNumber?: string;
}

export interface RenewalOption {
  termLength: number; // months
  rentIncrease: number; // percentage or flat amount
  isPercentage: boolean;
}

// Payment Types
export interface Payment {
  id: string;
  organizationId: string;
  leaseId: string;
  tenantId: string;
  type: 'rent' | 'deposit' | 'late_fee' | 'pet_fee' | 'utility' | 'other';
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: 'cash' | 'check' | 'ach' | 'credit_card' | 'online' | 'money_order';
  status: 'pending' | 'paid' | 'overdue' | 'partial' | 'refunded';
  reference?: string;
  notes?: string;
  fees: PaymentFees;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentFees {
  processingFee?: number;
  lateFee?: number;
  returnedCheckFee?: number;
}

// Expense Types
export interface Expense {
  id: string;
  organizationId: string;
  propertyId?: string;
  unitId?: string;
  category: 'maintenance' | 'utilities' | 'insurance' | 'taxes' | 'management' | 'marketing' | 'legal' | 'other';
  subcategory?: string;
  description: string;
  amount: number;
  date: Date;
  vendor?: string;
  paymentMethod?: string;
  receipt?: string;
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
  taxDeductible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Maintenance Types
export interface MaintenanceRequest {
  id: string;
  organizationId: string;
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

// Vendor Types
export interface Vendor {
  id: string;
  organizationId: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: Address;
  services: string[];
  rating?: number;
  insuranceExpiry?: Date;
  licenseNumber?: string;
  preferredCategories: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mortgage Types
export interface Mortgage {
  id: string;
  organizationId: string;
  propertyId: string;
  lender: string;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyPayment: number;
  startDate: Date;
  maturityDate: Date;
  currentBalance: number;
  paymentHistory: MortgagePayment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MortgagePayment {
  id: string;
  date: Date;
  amount: number;
  principal: number;
  interest: number;
  escrow?: number;
  remainingBalance: number;
}

// Application Types
export interface Application {
  id: string;
  organizationId: string;
  propertyId: string;
  unitId?: string;
  applicantInfo: ApplicantInfo;
  employmentInfo: EmploymentInfo;
  references: Reference[];
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicantInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  ssn?: string; // encrypted
  currentAddress: Address;
  desiredMoveInDate: Date;
  pets?: PetInfo[];
  emergencyContact: EmergencyContact;
}

export interface PetInfo {
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed?: string;
  weight?: number;
  name: string;
}

export interface Reference {
  type: 'landlord' | 'employer' | 'personal';
  name: string;
  phone: string;
  email?: string;
  relationship: string;
}

// Notification Types
export interface Notification {
  id: string;
  organizationId?: string; // null for platform-wide notifications
  userId?: string;
  type: 'payment' | 'maintenance' | 'lease' | 'system' | 'billing';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Dashboard Stats (enhanced for multi-tenant)
export interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalTenants: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  expensesThisMonth: number;
  netIncome: number;
  occupancyRate: number;
  averageRent: number;
  maintenanceRequests: {
    open: number;
    inProgress: number;
    completed: number;
  };
  upcomingLeaseExpirations: number;
  overduePayments: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'payment' | 'maintenance' | 'lease' | 'tenant' | 'property';
  description: string;
  timestamp: Date;
  amount?: number;
  userId?: string;
  propertyId?: string;
}

// Settings Types
export interface Settings {
  id: string;
  organizationId?: string; // null for platform settings
  notifications: NotificationSettings;
  financial: FinancialSettings;
  maintenance: MaintenanceSettings;
  tenant: TenantSettings;
  integrations: IntegrationSettings;
  security: SecuritySettings;
  updatedAt: Date;
  updatedBy: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  paymentReminders: boolean;
  maintenanceUpdates: boolean;
  leaseExpirations: boolean;
}

export interface FinancialSettings {
  defaultCurrency: string;
  automaticLateFeesEnabled: boolean;
  lateFeeAmount: number;
  lateFeeGracePeriod: number;
  acceptOnlinePayments: boolean;
  paymentProcessingFee: number;
  chartOfAccounts: ChartOfAccount[];
}

export interface ChartOfAccount {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'asset' | 'liability' | 'equity';
  category: string;
  isActive: boolean;
}

export interface MaintenanceSettings {
  autoAssignVendors: boolean;
  requireTenantApproval: boolean;
  emergencyContactInfo: string;
  defaultPriorities: {
    [category: string]: 'low' | 'medium' | 'high';
  };
}

export interface TenantSettings {
  requireBackgroundCheck: boolean;
  minimumCreditScore: number;
  maxOccupants: number;
  allowPets: boolean;
  petDeposit: number;
  screeningFee: number;
}

export interface IntegrationSettings {
  paymentProcessor?: {
    provider: 'stripe' | 'square' | 'paypal';
    isActive: boolean;
    credentials: any;
  };
  accountingSoftware?: {
    provider: 'quickbooks' | 'xero' | 'freshbooks';
    isActive: boolean;
    credentials: any;
  };
  backgroundCheck?: {
    provider: 'rentspree' | 'transunion' | 'cozy';
    isActive: boolean;
    credentials: any;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
  sessionTimeout: number; // minutes
  allowedIpRanges?: string[];
}

// Feature Flags
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  applicableRoles: string[];
  subscriptionPlans: string[];
}

// Audit Log
export interface AuditLog {
  id: string;
  organizationId?: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}