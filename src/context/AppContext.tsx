import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  apiService, 
  User, 
  Organization, 
  Property, 
  Tenant, 
  MaintenanceRequest, 
  Payment,
  PaginationResponse
} from '../services/api';

// User roles and permissions
const userRoles = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    permissions: ['*'], // All permissions
    dashboardPath: '/super-admin',
  },
  ORGANIZATION_ADMIN: {
    label: 'Organization Admin',
    permissions: ['properties', 'tenants', 'leases', 'payments', 'maintenance', 'reports'],
    dashboardPath: '/dashboard',
  },
  PROPERTY_MANAGER: {
    label: 'Property Manager',
    permissions: ['properties', 'tenants', 'maintenance'],
    dashboardPath: '/dashboard',
  },
  TENANT: {
    label: 'Tenant',
    permissions: ['payments', 'maintenance'],
    dashboardPath: '/tenant',
  },
};

interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // Multi-tenant
  currentOrganization: Organization | null;
  organizations: Organization[];
  
  // Data
  properties: Property[];
  tenants: Tenant[];
  maintenanceRequests: MaintenanceRequest[];
  payments: Payment[];
  
  // Dashboard
  dashboardStats: any;
  superAdminStats: any;
  
  // UI State
  loading: boolean;
  error: string | null;
  sidebarOpen: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_CURRENT_ORGANIZATION'; payload: Organization | null }
  | { type: 'SET_ORGANIZATIONS'; payload: Organization[] }
  | { type: 'SET_PROPERTIES'; payload: Property[] }
  | { type: 'SET_TENANTS'; payload: Tenant[] }
  | { type: 'SET_MAINTENANCE_REQUESTS'; payload: MaintenanceRequest[] }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'SET_DASHBOARD_STATS'; payload: any }
  | { type: 'SET_SUPER_ADMIN_STATS'; payload: any }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_PROPERTY'; payload: Property }
  | { type: 'UPDATE_PROPERTY'; payload: Property }
  | { type: 'DELETE_PROPERTY'; payload: string }
  | { type: 'ADD_TENANT'; payload: Tenant }
  | { type: 'UPDATE_TENANT'; payload: Tenant }
  | { type: 'DELETE_TENANT'; payload: string }
  | { type: 'ADD_MAINTENANCE_REQUEST'; payload: MaintenanceRequest }
  | { type: 'UPDATE_MAINTENANCE_REQUEST'; payload: MaintenanceRequest }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  currentOrganization: null,
  organizations: [],
  properties: [],
  tenants: [],
  maintenanceRequests: [],
  payments: [],
  dashboardStats: null,
  superAdminStats: null,
  loading: false,
  error: null,
  sidebarOpen: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_CURRENT_ORGANIZATION':
      return { ...state, currentOrganization: action.payload };
    case 'SET_ORGANIZATIONS':
      return { ...state, organizations: action.payload };
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    case 'SET_TENANTS':
      return { ...state, tenants: action.payload };
    case 'SET_MAINTENANCE_REQUESTS':
      return { ...state, maintenanceRequests: action.payload };
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    case 'SET_SUPER_ADMIN_STATS':
      return { ...state, superAdminStats: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
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
    case 'ADD_MAINTENANCE_REQUEST':
      return { ...state, maintenanceRequests: [...state.maintenanceRequests, action.payload] };
    case 'UPDATE_MAINTENANCE_REQUEST':
      return {
        ...state,
        maintenanceRequests: state.maintenanceRequests.map(r => 
          r.id === action.payload.id ? action.payload : r
        )
      };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  
  // Data actions
  loadProperties: (params?: any) => Promise<void>;
  loadTenants: (params?: any) => Promise<void>;
  loadMaintenanceRequests: (params?: any) => Promise<void>;
  loadPayments: (params?: any) => Promise<void>;
  loadDashboardStats: () => Promise<void>;
  loadSuperAdminStats: () => Promise<void>;
  
  // Property actions
  createProperty: (propertyData: Partial<Property>) => Promise<Property>;
  updateProperty: (id: string, propertyData: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<void>;
  
  // Tenant actions
  createTenant: (tenantData: Partial<Tenant>) => Promise<Tenant>;
  updateTenant: (id: string, tenantData: Partial<Tenant>) => Promise<Tenant>;
  deleteTenant: (id: string) => Promise<void>;
  
  // Maintenance actions
  createMaintenanceRequest: (requestData: Partial<MaintenanceRequest>) => Promise<MaintenanceRequest>;
  updateMaintenanceRequest: (id: string, requestData: Partial<MaintenanceRequest>) => Promise<MaintenanceRequest>;
  
  // Payment actions
  createPayment: (paymentData: Partial<Payment>) => Promise<Payment>;
  markPaymentAsPaid: (id: string, data: any) => Promise<Payment>;
  
  // Utility functions
  hasPermission: (permission: string) => boolean;
  getUserRole: () => any;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          
          // Load user profile to ensure data is fresh
          const profile = await apiService.getProfile();
          dispatch({ type: 'SET_USER', payload: profile });
          localStorage.setItem('user', JSON.stringify(profile));
          
          // Load initial data based on user role
          if (profile.role === 'SUPER_ADMIN') {
            loadSuperAdminStats();
          } else {
            loadDashboardStats();
            loadProperties();
            loadTenants();
          }
        } catch (error) {
          console.error('Failed to initialize app:', error);
          logout();
        }
      }
    };

    initializeApp();
  }, []);

  // Authentication actions
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await apiService.login(email, password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ type: 'SET_USER', payload: response.user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      
      // Load initial data based on user role
      if (response.user.role === 'SUPER_ADMIN') {
        await loadSuperAdminStats();
      } else {
        await loadDashboardStats();
        await loadProperties();
        await loadTenants();
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await apiService.register(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ type: 'SET_USER', payload: response.user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Registration failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_PROPERTIES', payload: [] });
    dispatch({ type: 'SET_TENANTS', payload: [] });
    dispatch({ type: 'SET_MAINTENANCE_REQUESTS', payload: [] });
    dispatch({ type: 'SET_PAYMENTS', payload: [] });
    dispatch({ type: 'SET_DASHBOARD_STATS', payload: null });
    dispatch({ type: 'SET_SUPER_ADMIN_STATS', payload: null });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedUser = await apiService.updateProfile(userData);
      dispatch({ type: 'SET_USER', payload: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Profile update failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Data loading actions
  const loadProperties = async (params?: any) => {
    try {
      const response = await apiService.getProperties(params);
      dispatch({ type: 'SET_PROPERTIES', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to load properties' });
    }
  };

  const loadTenants = async (params?: any) => {
    try {
      const response = await apiService.getTenants(params);
      dispatch({ type: 'SET_TENANTS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to load tenants' });
    }
  };

  const loadMaintenanceRequests = async (params?: any) => {
    try {
      const response = await apiService.getMaintenanceRequests(params);
      dispatch({ type: 'SET_MAINTENANCE_REQUESTS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to load maintenance requests' });
    }
  };

  const loadPayments = async (params?: any) => {
    try {
      const response = await apiService.getPayments(params);
      dispatch({ type: 'SET_PAYMENTS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to load payments' });
    }
  };

  const loadDashboardStats = async () => {
    try {
      const stats = await apiService.getDashboardStats();
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to load dashboard stats' });
    }
  };

  const loadSuperAdminStats = async () => {
    try {
      const stats = await apiService.getSuperAdminDashboardStats();
      dispatch({ type: 'SET_SUPER_ADMIN_STATS', payload: stats });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to load super admin stats' });
    }
  };

  // Property actions
  const createProperty = async (propertyData: Partial<Property>) => {
    try {
      const property = await apiService.createProperty(propertyData);
      dispatch({ type: 'ADD_PROPERTY', payload: property });
      return property;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to create property' });
      throw error;
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    try {
      const property = await apiService.updateProperty(id, propertyData);
      dispatch({ type: 'UPDATE_PROPERTY', payload: property });
      return property;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to update property' });
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await apiService.deleteProperty(id);
      dispatch({ type: 'DELETE_PROPERTY', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to delete property' });
      throw error;
    }
  };

  // Tenant actions
  const createTenant = async (tenantData: Partial<Tenant>) => {
    try {
      const tenant = await apiService.createTenant(tenantData);
      dispatch({ type: 'ADD_TENANT', payload: tenant });
      return tenant;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to create tenant' });
      throw error;
    }
  };

  const updateTenant = async (id: string, tenantData: Partial<Tenant>) => {
    try {
      const tenant = await apiService.updateTenant(id, tenantData);
      dispatch({ type: 'UPDATE_TENANT', payload: tenant });
      return tenant;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to update tenant' });
      throw error;
    }
  };

  const deleteTenant = async (id: string) => {
    try {
      await apiService.deleteTenant(id);
      dispatch({ type: 'DELETE_TENANT', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to delete tenant' });
      throw error;
    }
  };

  // Maintenance actions
  const createMaintenanceRequest = async (requestData: Partial<MaintenanceRequest>) => {
    try {
      const request = await apiService.createMaintenanceRequest(requestData);
      dispatch({ type: 'ADD_MAINTENANCE_REQUEST', payload: request });
      return request;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to create maintenance request' });
      throw error;
    }
  };

  const updateMaintenanceRequest = async (id: string, requestData: Partial<MaintenanceRequest>) => {
    try {
      const request = await apiService.updateMaintenanceRequest(id, requestData);
      dispatch({ type: 'UPDATE_MAINTENANCE_REQUEST', payload: request });
      return request;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to update maintenance request' });
      throw error;
    }
  };

  // Payment actions
  const createPayment = async (paymentData: Partial<Payment>) => {
    try {
      const payment = await apiService.createPayment(paymentData);
      dispatch({ type: 'ADD_PAYMENT', payload: payment });
      return payment;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to create payment' });
      throw error;
    }
  };

  const markPaymentAsPaid = async (id: string, data: any) => {
    try {
      const payment = await apiService.markPaymentAsPaid(id, data);
      dispatch({ type: 'UPDATE_PAYMENT', payload: payment });
      return payment;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to mark payment as paid' });
      throw error;
    }
  };

  // Utility functions
  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    const role = userRoles[state.user.role];
    return role.permissions.includes('*') || role.permissions.includes(permission);
  };

  const getUserRole = () => {
    if (!state.user) return null;
    return userRoles[state.user.role];
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    register,
    logout,
    updateProfile,
    loadProperties,
    loadTenants,
    loadMaintenanceRequests,
    loadPayments,
    loadDashboardStats,
    loadSuperAdminStats,
    createProperty,
    updateProperty,
    deleteProperty,
    createTenant,
    updateTenant,
    deleteTenant,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    createPayment,
    markPaymentAsPaid,
    hasPermission,
    getUserRole,
    isLoading: state.loading,
    error: state.error,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { userRoles };
