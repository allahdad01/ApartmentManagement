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
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_PROPERTIES'; payload: Property[] }
  | { type: 'ADD_PROPERTY'; payload: Property }
  | { type: 'UPDATE_PROPERTY'; payload: Property }
  | { type: 'DELETE_PROPERTY'; payload: string }
  | { type: 'SET_SELECTED_PROPERTY'; payload: Property | null }
  | { type: 'SET_UNITS'; payload: Unit[] }
  | { type: 'ADD_UNIT'; payload: Unit }
  | { type: 'UPDATE_UNIT'; payload: Unit }
  | { type: 'DELETE_UNIT'; payload: string }
  | { type: 'SET_TENANTS'; payload: Tenant[] }
  | { type: 'ADD_TENANT'; payload: Tenant }
  | { type: 'UPDATE_TENANT'; payload: Tenant }
  | { type: 'DELETE_TENANT'; payload: string }
  | { type: 'SET_LEASES'; payload: Lease[] }
  | { type: 'ADD_LEASE'; payload: Lease }
  | { type: 'UPDATE_LEASE'; payload: Lease }
  | { type: 'DELETE_LEASE'; payload: string }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_MAINTENANCE_REQUESTS'; payload: MaintenanceRequest[] }
  | { type: 'ADD_MAINTENANCE_REQUEST'; payload: MaintenanceRequest }
  | { type: 'UPDATE_MAINTENANCE_REQUEST'; payload: MaintenanceRequest }
  | { type: 'DELETE_MAINTENANCE_REQUEST'; payload: string }
  | { type: 'SET_VENDORS'; payload: Vendor[] }
  | { type: 'ADD_VENDOR'; payload: Vendor }
  | { type: 'UPDATE_VENDOR'; payload: Vendor }
  | { type: 'DELETE_VENDOR'; payload: string }
  | { type: 'SET_MORTGAGES'; payload: Mortgage[] }
  | { type: 'ADD_MORTGAGE'; payload: Mortgage }
  | { type: 'UPDATE_MORTGAGE'; payload: Mortgage }
  | { type: 'DELETE_MORTGAGE'; payload: string }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION'; payload: Application }
  | { type: 'DELETE_APPLICATION'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'RESET_STATE' };

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
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    
    case 'ADD_PROPERTY':
      return { ...state, properties: [...state.properties, action.payload] };
    
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        selectedProperty: state.selectedProperty?.id === action.payload.id 
          ? action.payload 
          : state.selectedProperty
      };
    
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(p => p.id !== action.payload),
        selectedProperty: state.selectedProperty?.id === action.payload 
          ? null 
          : state.selectedProperty
      };
    
    case 'SET_SELECTED_PROPERTY':
      return { ...state, selectedProperty: action.payload };
    
    case 'SET_UNITS':
      return { ...state, units: action.payload };
    
    case 'ADD_UNIT':
      return { ...state, units: [...state.units, action.payload] };
    
    case 'UPDATE_UNIT':
      return {
        ...state,
        units: state.units.map(u => 
          u.id === action.payload.id ? action.payload : u
        )
      };
    
    case 'DELETE_UNIT':
      return {
        ...state,
        units: state.units.filter(u => u.id !== action.payload)
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
    
    case 'SET_LEASES':
      return { ...state, leases: action.payload };
    
    case 'ADD_LEASE':
      return { ...state, leases: [...state.leases, action.payload] };
    
    case 'UPDATE_LEASE':
      return {
        ...state,
        leases: state.leases.map(l => 
          l.id === action.payload.id ? action.payload : l
        )
      };
    
    case 'DELETE_LEASE':
      return {
        ...state,
        leases: state.leases.filter(l => l.id !== action.payload)
      };
    
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e => 
          e.id === action.payload.id ? action.payload : e
        )
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload)
      };
    
    case 'SET_MAINTENANCE_REQUESTS':
      return { ...state, maintenanceRequests: action.payload };
    
    case 'ADD_MAINTENANCE_REQUEST':
      return { 
        ...state, 
        maintenanceRequests: [...state.maintenanceRequests, action.payload] 
      };
    
    case 'UPDATE_MAINTENANCE_REQUEST':
      return {
        ...state,
        maintenanceRequests: state.maintenanceRequests.map(m => 
          m.id === action.payload.id ? action.payload : m
        )
      };
    
    case 'DELETE_MAINTENANCE_REQUEST':
      return {
        ...state,
        maintenanceRequests: state.maintenanceRequests.filter(m => 
          m.id !== action.payload
        )
      };
    
    case 'SET_VENDORS':
      return { ...state, vendors: action.payload };
    
    case 'ADD_VENDOR':
      return { ...state, vendors: [...state.vendors, action.payload] };
    
    case 'UPDATE_VENDOR':
      return {
        ...state,
        vendors: state.vendors.map(v => 
          v.id === action.payload.id ? action.payload : v
        )
      };
    
    case 'DELETE_VENDOR':
      return {
        ...state,
        vendors: state.vendors.filter(v => v.id !== action.payload)
      };
    
    case 'SET_MORTGAGES':
      return { ...state, mortgages: action.payload };
    
    case 'ADD_MORTGAGE':
      return { ...state, mortgages: [...state.mortgages, action.payload] };
    
    case 'UPDATE_MORTGAGE':
      return {
        ...state,
        mortgages: state.mortgages.map(m => 
          m.id === action.payload.id ? action.payload : m
        )
      };
    
    case 'DELETE_MORTGAGE':
      return {
        ...state,
        mortgages: state.mortgages.filter(m => m.id !== action.payload)
      };
    
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    
    case 'ADD_APPLICATION':
      return { ...state, applications: [...state.applications, action.payload] };
    
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(a => 
          a.id === action.payload.id ? action.payload : a
        )
      };
    
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter(a => a.id !== action.payload)
      };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications] 
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, isRead: true } : n
        )
      };
    
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Check for authentication token
        const token = localStorage.getItem('authToken');
        if (token) {
          // Validate token and load user data
          // This would typically make an API call
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          
          // Load mock data for demo purposes
          loadMockData();
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load initial data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const loadMockData = () => {
      // Mock dashboard stats
      const mockStats: DashboardStats = {
        totalProperties: 12,
        totalUnits: 48,
        occupancyRate: 92.5,
        monthlyRevenue: 125000,
        pendingMaintenance: 8,
        leasesExpiring: 3,
        overduePayments: 2,
        applications: 5
      };
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: mockStats });

      // Mock properties
      const mockProperties: Property[] = [
        {
          id: '1',
          name: 'Sunset Apartments',
          address: {
            street: '123 Main St',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'USA'
          },
          type: 'residential',
          propertyClass: 'multi_family',
          units: [],
          totalUnits: 24,
          yearBuilt: 2018,
          squareFootage: 18000,
          amenities: ['Pool', 'Gym', 'Parking', 'Laundry'],
          images: [],
          description: 'Modern apartment complex in prime location',
          managerId: 'mgr1',
          ownerId: 'owner1',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          marketValue: 2500000,
          purchasePrice: 2000000,
          purchaseDate: new Date('2018-01-15')
        },
        {
          id: '2',
          name: 'Downtown Office Plaza',
          address: {
            street: '456 Business Ave',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
            country: 'USA'
          },
          type: 'commercial',
          propertyClass: 'office',
          units: [],
          totalUnits: 12,
          yearBuilt: 2020,
          squareFootage: 25000,
          amenities: ['Elevator', 'Conference Rooms', 'Parking'],
          images: [],
          description: 'Premium office space in financial district',
          managerId: 'mgr1',
          ownerId: 'owner1',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          marketValue: 5000000,
          purchasePrice: 4200000,
          purchaseDate: new Date('2020-03-01')
        }
      ];
      dispatch({ type: 'SET_PROPERTIES', payload: mockProperties });
    };

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};