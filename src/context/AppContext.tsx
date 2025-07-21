import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  User, 
  Organization,
  Property, 
  Unit, 
  Tenant, 
  Lease, 
  Payment, 
  Expense, 
  MaintenanceRequest,
  Vendor,
  Mortgage,
  Application,
  Notification,
  DashboardStats,
  PlatformStats,
  Settings
} from '../types';

// Mock data for organizations (super admin view)
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Sunset Property Management',
    slug: 'sunset-pm',
    description: 'Luxury residential property management',
    address: {
      street: '123 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    subscriptionPlan: {
      id: 'pro',
      name: 'professional',
      displayName: 'Professional',
      price: 149,
      billingCycle: 'monthly',
      maxProperties: 50,
      maxUsers: 10,
      features: ['Advanced Analytics', 'API Access', 'Custom Branding'],
      isActive: true
    },
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date('2023-01-15'),
    maxProperties: 50,
    maxUsers: 10,
    features: ['Advanced Analytics', 'API Access', 'Custom Branding'],
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      allowTenantPortal: true,
      allowOnlinePayments: true,
      autoLateFeesEnabled: true,
      lateFeeAmount: 50,
      lateFeeGracePeriod: 5,
      maintenanceAutoAssignment: false,
      emailNotifications: true,
      smsNotifications: false,
      customBranding: {
        primaryColor: '#1976d2',
        companyName: 'Sunset PM'
      }
    },
    ownerId: 'user1',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '2',
    name: 'Metro Real Estate Group',
    slug: 'metro-reg',
    description: 'Commercial and residential properties',
    address: {
      street: '456 Downtown St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    subscriptionPlan: {
      id: 'ent',
      name: 'enterprise',
      displayName: 'Enterprise',
      price: 299,
      billingCycle: 'monthly',
      maxProperties: 200,
      maxUsers: 50,
      features: ['All Features', 'White Label', 'Priority Support'],
      isActive: true
    },
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date('2022-08-10'),
    maxProperties: 200,
    maxUsers: 50,
    features: ['All Features', 'White Label', 'Priority Support'],
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      allowTenantPortal: true,
      allowOnlinePayments: true,
      autoLateFeesEnabled: true,
      lateFeeAmount: 75,
      lateFeeGracePeriod: 3,
      maintenanceAutoAssignment: true,
      emailNotifications: true,
      smsNotifications: true,
      customBranding: {
        primaryColor: '#2e7d32',
        secondaryColor: '#4caf50',
        companyName: 'Metro REG'
      }
    },
    ownerId: 'user2',
    createdAt: new Date('2022-08-10'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  }
];

// Mock data for properties (organization-specific)
const mockProperties: Property[] = [
  {
    id: '1',
    organizationId: '1', // Sunset Property Management
    name: 'Sunset Apartments',
    description: 'Modern apartment complex with pool and fitness center',
    type: 'residential',
    propertyClass: 'apartment',
    address: {
      street: '123 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    totalUnits: 24,
    yearBuilt: 2018,
    squareFootage: 28800,
    lotSize: 45000,
    purchasePrice: 8500000,
    purchaseDate: new Date('2020-03-15'),
    marketValue: 9200000,
    amenities: ['Pool', 'Gym', 'Parking', 'Laundry', 'Security System'],
    images: [],
    managerId: 'mgr1',
    ownerId: 'owner1',
    units: [],
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '2',
    organizationId: '1', // Sunset Property Management
    name: 'Hollywood Heights',
    description: 'Luxury condos in Hollywood Hills',
    type: 'residential',
    propertyClass: 'condo',
    address: {
      street: '456 Hollywood Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90028',
      country: 'USA'
    },
    totalUnits: 18,
    yearBuilt: 2019,
    squareFootage: 32400,
    lotSize: 25000,
    purchasePrice: 12000000,
    purchaseDate: new Date('2021-06-20'),
    marketValue: 13500000,
    amenities: ['Rooftop Pool', 'Concierge', 'Valet Parking', 'Gym'],
    images: [],
    managerId: 'mgr1',
    ownerId: 'owner1',
    units: [],
    createdAt: new Date('2021-06-20'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '3',
    organizationId: '2', // Metro Real Estate Group
    name: 'Downtown Office Tower',
    description: 'Premium office space in financial district',
    type: 'commercial',
    propertyClass: 'office',
    address: {
      street: '789 Wall Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10005',
      country: 'USA'
    },
    totalUnits: 45,
    yearBuilt: 2020,
    squareFootage: 125000,
    lotSize: 15000,
    purchasePrice: 45000000,
    purchaseDate: new Date('2022-01-15'),
    marketValue: 48000000,
    amenities: ['Conference Center', 'Parking Garage', 'Security', 'Elevators'],
    images: [],
    managerId: 'mgr2',
    ownerId: 'owner2',
    units: [],
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  }
];

const mockTenants: Tenant[] = [
  {
    id: '1',
    organizationId: '1',
    userId: 'user1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: new Date('1985-03-15'),
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    },
    employment: {
      employer: 'Tech Corp',
      position: 'Software Engineer',
      monthlyIncome: 8500,
      employmentStartDate: new Date('2020-01-15')
    },
    creditScore: 750,
    backgroundCheckStatus: 'approved',
    documents: [],
    currentLeases: ['lease1'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    isActive: true
  },
  {
    id: '2',
    organizationId: '1',
    userId: 'user2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: new Date('1990-07-22'),
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '(555) 876-5432',
      relationship: 'Father'
    },
    employment: {
      employer: 'Design Studio',
      position: 'UX Designer',
      monthlyIncome: 6500,
      employmentStartDate: new Date('2021-06-01')
    },
    creditScore: 720,
    backgroundCheckStatus: 'approved',
    documents: [],
    currentLeases: ['lease2'],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10'),
    isActive: true
  }
];

// Mock platform stats for super admin
const mockPlatformStats: PlatformStats = {
  totalOrganizations: 247,
  activeOrganizations: 231,
  totalUsers: 1849,
  totalProperties: 3420,
  totalRevenue: 89750,
  monthlyRevenue: 12450,
  churnRate: 3.2,
  averagePropertiesPerOrg: 13.8,
  subscriptionBreakdown: {
    'Starter': 89,
    'Professional': 124,
    'Enterprise': 34
  },
  recentSignups: [],
  topPerformingOrgs: []
};

// Mock dashboard stats for organization admin
const mockDashboardStats: DashboardStats = {
  totalProperties: 3,
  totalUnits: 78,
  occupiedUnits: 72,
  vacantUnits: 6,
  totalTenants: 72,
  monthlyRevenue: 156000,
  yearlyRevenue: 1872000,
  expensesThisMonth: 28500,
  netIncome: 127500,
  occupancyRate: 92.3,
  averageRent: 2167,
  maintenanceRequests: {
    open: 8,
    inProgress: 3,
    completed: 15
  },
  upcomingLeaseExpirations: 6,
  overduePayments: 2,
  recentActivity: [
    {
      id: '1',
      type: 'payment',
      description: 'Rent payment received from John Smith',
      timestamp: new Date('2024-01-15T10:30:00'),
      amount: 2500
    },
    {
      id: '2',
      type: 'maintenance',
      description: 'Maintenance request submitted for Unit 2A',
      timestamp: new Date('2024-01-15T09:15:00')
    },
    {
      id: '3',
      type: 'lease',
      description: 'New lease signed for Unit 3B',
      timestamp: new Date('2024-01-14T16:45:00')
    }
  ]
};

interface AppState {
  user: User | null;
  currentOrganization: Organization | null; // Current organization context
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Multi-tenant data (filtered by organization)
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  leases: Lease[];
  payments: Payment[];
  expenses: Expense[];
  maintenanceRequests: MaintenanceRequest[];
  vendors: Vendor[];
  mortgages: Mortgage[];
  applications: Application[];
  notifications: Notification[];
  
  // Dashboard data
  dashboardStats: DashboardStats | null;
  
  // Super admin data
  organizations: Organization[];
  platformStats: PlatformStats | null;
  
  settings: Settings | null;
  selectedProperty: Property | null;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_CURRENT_ORGANIZATION'; payload: Organization | null }
  | { type: 'SET_LOADING'; payload: boolean }
  
  // Organization management (super admin)
  | { type: 'SET_ORGANIZATIONS'; payload: Organization[] }
  | { type: 'ADD_ORGANIZATION'; payload: Organization }
  | { type: 'UPDATE_ORGANIZATION'; payload: Organization }
  | { type: 'DELETE_ORGANIZATION'; payload: string }
  | { type: 'SET_PLATFORM_STATS'; payload: PlatformStats }
  
  // Property management
  | { type: 'SET_PROPERTIES'; payload: Property[] }
  | { type: 'ADD_PROPERTY'; payload: Property }
  | { type: 'UPDATE_PROPERTY'; payload: Property }
  | { type: 'DELETE_PROPERTY'; payload: string }
  
  // Tenant management
  | { type: 'SET_TENANTS'; payload: Tenant[] }
  | { type: 'ADD_TENANT'; payload: Tenant }
  | { type: 'UPDATE_TENANT'; payload: Tenant }
  | { type: 'DELETE_TENANT'; payload: string }
  
  // Dashboard and stats
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_SELECTED_PROPERTY'; payload: Property | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  currentOrganization: null,
  isAuthenticated: false,
  isLoading: false,
  properties: [],
  units: [],
  tenants: [],
  leases: [],
  payments: [],
  expenses: [],
  maintenanceRequests: [],
  vendors: [],
  mortgages: [],
  applications: [],
  notifications: [],
  dashboardStats: null,
  organizations: [],
  platformStats: null,
  settings: null,
  selectedProperty: null,
  error: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_CURRENT_ORGANIZATION':
      return { 
        ...state, 
        currentOrganization: action.payload,
        // Filter data by organization when switching context
        properties: action.payload ? 
          mockProperties.filter(p => p.organizationId === action.payload.id) : 
          [],
        tenants: action.payload ?
          mockTenants.filter(t => t.organizationId === action.payload.id) :
          []
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    // Super admin actions
    case 'SET_ORGANIZATIONS':
      return { ...state, organizations: action.payload };
    
    case 'ADD_ORGANIZATION':
      return { ...state, organizations: [...state.organizations, action.payload] };
    
    case 'UPDATE_ORGANIZATION':
      return {
        ...state,
        organizations: state.organizations.map(o => 
          o.id === action.payload.id ? action.payload : o
        ),
        currentOrganization: state.currentOrganization?.id === action.payload.id ? 
          action.payload : state.currentOrganization
      };
    
    case 'DELETE_ORGANIZATION':
      return {
        ...state,
        organizations: state.organizations.filter(o => o.id !== action.payload),
        currentOrganization: state.currentOrganization?.id === action.payload ? 
          null : state.currentOrganization
      };
    
    case 'SET_PLATFORM_STATS':
      return { ...state, platformStats: action.payload };
    
    // Property management
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    
    case 'ADD_PROPERTY':
      return { ...state, properties: [...state.properties, action.payload] };
    
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(p => p.id !== action.payload)
      };
    
    // Tenant management
    case 'SET_TENANTS':
      return { ...state, tenants: action.payload };
    
    case 'ADD_TENANT':
      return { ...state, tenants: [...state.tenants, action.payload] };
    
    case 'UPDATE_TENANT':
      return {
        ...state,
        tenants: state.tenants.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    
    case 'DELETE_TENANT':
      return {
        ...state,
        tenants: state.tenants.filter(t => t.id !== action.payload)
      };
    
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    
    case 'SET_SELECTED_PROPERTY':
      return { ...state, selectedProperty: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOGOUT':
      localStorage.removeItem('authToken');
      return initialState;
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with mock data and check for existing authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole') || 'admin'; // Default to admin for demo
    
    if (token) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      
      // Set user based on role
      if (userRole === 'super_admin') {
        dispatch({ type: 'SET_USER', payload: {
          id: 'super1',
          email: 'superadmin@propertypro.com',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'super_admin',
          permissions: ['platform:manage', 'organizations:manage', 'users:manage'],
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        }});
        
        // Load platform-wide data for super admin
        dispatch({ type: 'SET_ORGANIZATIONS', payload: mockOrganizations });
        dispatch({ type: 'SET_PLATFORM_STATS', payload: mockPlatformStats });
        
      } else {
        // Regular organization admin
        const currentOrg = mockOrganizations[0]; // Default to first organization for demo
        
        dispatch({ type: 'SET_USER', payload: {
          id: '1',
          email: 'admin@sunset-pm.com',
          firstName: 'Demo',
          lastName: 'Admin',
          role: 'admin',
          organizationId: currentOrg.id,
          permissions: ['properties:manage', 'tenants:manage', 'maintenance:manage'],
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        }});
        
        // Set organization context and load organization-specific data
        dispatch({ type: 'SET_CURRENT_ORGANIZATION', payload: currentOrg });
        dispatch({ type: 'SET_DASHBOARD_STATS', payload: mockDashboardStats });
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};