import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  User, 
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
  Settings
} from '../types';

// Mock data
const mockProperties: Property[] = [
  {
    id: '1',
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
    name: 'Downtown Lofts',
    description: 'Historic building converted to luxury lofts',
    type: 'residential',
    propertyClass: 'apartment',
    address: {
      street: '456 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    totalUnits: 18,
    yearBuilt: 1925,
    squareFootage: 32400,
    lotSize: 12000,
    purchasePrice: 12000000,
    purchaseDate: new Date('2019-08-20'),
    marketValue: 13500000,
    amenities: ['High Ceilings', 'Hardwood Floors', 'Rooftop Access', 'Elevator'],
    images: [],
    managerId: 'mgr1',
    ownerId: 'owner1',
    units: [],
    createdAt: new Date('2019-08-20'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '3',
    name: 'Garden View Condos',
    description: 'Family-friendly condominiums with garden views',
    type: 'residential',
    propertyClass: 'condo',
    address: {
      street: '789 Garden Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    totalUnits: 36,
    yearBuilt: 2015,
    squareFootage: 54000,
    lotSize: 80000,
    purchasePrice: 15000000,
    purchaseDate: new Date('2021-01-10'),
    marketValue: 16200000,
    amenities: ['Garden', 'Playground', 'Parking', 'Storage Unit'],
    images: [],
    managerId: 'mgr2',
    ownerId: 'owner1',
    units: [],
    createdAt: new Date('2021-01-10'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  }
];

const mockTenants: Tenant[] = [
  {
    id: '1',
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
  isAuthenticated: boolean;
  isLoading: boolean;
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
  dashboardStats: DashboardStats | null;
  settings: Settings | null;
  selectedProperty: Property | null;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROPERTIES'; payload: Property[] }
  | { type: 'ADD_PROPERTY'; payload: Property }
  | { type: 'UPDATE_PROPERTY'; payload: Property }
  | { type: 'DELETE_PROPERTY'; payload: string }
  | { type: 'SET_TENANTS'; payload: Tenant[] }
  | { type: 'ADD_TENANT'; payload: Tenant }
  | { type: 'UPDATE_TENANT'; payload: Tenant }
  | { type: 'DELETE_TENANT'; payload: string }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_SELECTED_PROPERTY'; payload: Property | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
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
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
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
      return {
        ...initialState,
        properties: state.properties, // Keep properties for demo
        tenants: state.tenants, // Keep tenants for demo
        dashboardStats: state.dashboardStats // Keep stats for demo
      };
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
    if (token) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      dispatch({ type: 'SET_USER', payload: {
        id: '1',
        email: 'demo@propertypro.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      }});
    }

    // Load mock data
    dispatch({ type: 'SET_PROPERTIES', payload: mockProperties });
    dispatch({ type: 'SET_TENANTS', payload: mockTenants });
    dispatch({ type: 'SET_DASHBOARD_STATS', payload: mockDashboardStats });
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