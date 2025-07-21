import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PropertiesList from './pages/Properties/PropertiesList';
import AddProperty from './pages/Properties/AddProperty';
import TenantsList from './pages/Tenants/TenantsList';
import MaintenanceList from './pages/Maintenance/MaintenanceList';
import PaymentsList from './pages/Financial/PaymentsList';
import PlatformDashboard from './pages/SuperAdmin/PlatformDashboard';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string }> = ({ 
  children, 
  requiredRole 
}) => {
  const { state } = useAppContext();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && state.user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (state.user?.role === 'super_admin') {
      return <Navigate to="/super-admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

// Auth Route component (redirects to dashboard if already authenticated)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  
  if (state.isAuthenticated) {
    // Redirect based on user role
    if (state.user?.role === 'super_admin') {
      return <Navigate to="/super-admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

// Enhanced Login component with role selection
const Login: React.FC = () => {
  const { dispatch } = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<'admin' | 'super_admin'>('admin');
  
  const handleLogin = async (role: 'admin' | 'super_admin') => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('userRole', role);
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    
    setIsLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '500px',
        maxWidth: '600px'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#1976d2', 
            marginBottom: '0.5rem',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            PropertyPro
          </h1>
          <p style={{ 
            color: '#666', 
            marginBottom: '0',
            fontSize: '1.1rem'
          }}>
            Multi-Tenant Property Management SaaS
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>Choose Demo Role:</h3>
          
          {/* Super Admin Option */}
          <div style={{
            border: selectedRole === 'super_admin' ? '2px solid #1976d2' : '2px solid #e0e0e0',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: selectedRole === 'super_admin' ? '#f3f7ff' : 'white'
          }} onClick={() => setSelectedRole('super_admin')}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #1976d2',
                backgroundColor: selectedRole === 'super_admin' ? '#1976d2' : 'white',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedRole === 'super_admin' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                )}
              </div>
              <h4 style={{ margin: 0, color: '#1976d2' }}>🔧 Super Admin</h4>
            </div>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', paddingLeft: '32px' }}>
              Manage the entire SaaS platform, organizations, subscriptions, and system settings
            </p>
          </div>
          
          {/* Organization Admin Option */}
          <div style={{
            border: selectedRole === 'admin' ? '2px solid #1976d2' : '2px solid #e0e0e0',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: selectedRole === 'admin' ? '#f3f7ff' : 'white'
          }} onClick={() => setSelectedRole('admin')}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #1976d2',
                backgroundColor: selectedRole === 'admin' ? '#1976d2' : 'white',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedRole === 'admin' && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />
                )}
              </div>
              <h4 style={{ margin: 0, color: '#1976d2' }}>🏢 Organization Admin</h4>
            </div>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', paddingLeft: '32px' }}>
              Manage your organization's properties, tenants, maintenance, and finances
            </p>
          </div>
        </div>
        
        <button
          onClick={() => handleLogin(selectedRole)}
          disabled={isLoading}
          style={{
            background: isLoading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            width: '100%',
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading ? 'Loading...' : `Login as ${selectedRole === 'super_admin' ? 'Super Admin' : 'Organization Admin'}`}
        </button>
        
        <p style={{ 
          color: '#999', 
          fontSize: '0.9rem', 
          marginTop: '1.5rem',
          marginBottom: '0'
        }}>
          No registration required • Switch between roles anytime
        </p>
      </div>
    </div>
  );
};

// Enhanced placeholder components
const ComingSoon: React.FC<{ title: string; description?: string }> = ({ 
  title, 
  description = 'This feature is being developed and will be available soon!' 
}) => (
  <div style={{ 
    padding: '4rem 2rem', 
    textAlign: 'center',
    background: 'white',
    borderRadius: '12px',
    margin: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }}>
    <div style={{ 
      fontSize: '4rem', 
      marginBottom: '1rem',
      opacity: 0.3 
    }}>
      🚧
    </div>
    <h2 style={{ 
      color: '#333', 
      marginBottom: '1rem',
      fontSize: '2rem'
    }}>
      {title}
    </h2>
    <p style={{ 
      color: '#666', 
      fontSize: '1.1rem',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {description}
    </p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              
              {/* Super Admin Routes */}
              <Route path="/super-admin" element={
                <ProtectedRoute requiredRole="super_admin">
                  <Layout>
                    <PlatformDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/super-admin/organizations" element={
                <ProtectedRoute requiredRole="super_admin">
                  <Layout>
                    <ComingSoon title="Organizations Management" description="Comprehensive organization management with billing, users, and settings." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/super-admin/organizations/add" element={
                <ProtectedRoute requiredRole="super_admin">
                  <Layout>
                    <ComingSoon title="Add Organization" description="Create new organizations with subscription plans and initial setup." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/super-admin/organizations/:id" element={
                <ProtectedRoute requiredRole="super_admin">
                  <Layout>
                    <ComingSoon title="Organization Details" description="Detailed view of organization with usage analytics and management tools." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/super-admin/billing" element={
                <ProtectedRoute requiredRole="super_admin">
                  <Layout>
                    <ComingSoon title="Platform Billing" description="Manage subscriptions, invoices, and revenue analytics." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/super-admin/users" element={
                <ProtectedRoute requiredRole="super_admin">
                  <Layout>
                    <ComingSoon title="Platform Users" description="Manage all users across organizations with role-based permissions." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/super-admin/analytics" element={
                <ProtectedRoute requiredRole="super_admin">
                  <Layout>
                    <ComingSoon title="Platform Analytics" description="Advanced analytics and reporting for the entire platform." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/super-admin/settings" element={
                <ProtectedRoute requiredRole="super_admin">
                  <Layout>
                    <ComingSoon title="Platform Settings" description="Configure platform-wide settings, integrations, and system preferences." />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Organization Admin Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Properties */}
              <Route path="/properties" element={
                <ProtectedRoute>
                  <Layout>
                    <PropertiesList />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/properties/add" element={
                <ProtectedRoute>
                  <Layout>
                    <AddProperty />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/properties/edit/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Edit Property" description="Property editing functionality will be available soon." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/properties/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Property Details" description="Detailed property view with units, financials, and analytics." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/units" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Units Management" description="Manage individual units, availability, and specifications." />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Tenants & Leases */}
              <Route path="/tenants" element={
                <ProtectedRoute>
                  <Layout>
                    <TenantsList />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tenants/add" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Add Tenant" description="Add new tenant with screening and documentation." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tenants/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Tenant Details" description="Comprehensive tenant profile with lease history and communications." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Rental Applications" description="Process and manage rental applications with digital screening." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/leases" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Lease Management" description="Create, manage, and track lease agreements with e-signatures." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/screening" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Tenant Screening" description="Comprehensive background checks and credit verification." />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Financial Management */}
              <Route path="/payments" element={
                <ProtectedRoute>
                  <Layout>
                    <PaymentsList />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Invoice Management" description="Generate and track invoices for rent, fees, and services." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Expense Tracking" description="Categorize and track all property-related expenses." />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Maintenance */}
              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <Layout>
                    <MaintenanceList />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/maintenance/add" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Create Work Order" description="Create new maintenance requests and assign to vendors." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/maintenance/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Maintenance Details" description="Detailed work order view with progress tracking and vendor communication." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/vendors" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Vendor Management" description="Manage contractor database with ratings and insurance tracking." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/maintenance/preventive" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Preventive Maintenance" description="Schedule and track routine maintenance tasks." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/maintenance/calendar" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Maintenance Calendar" description="Visual calendar for scheduling and tracking maintenance." />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Mortgages */}
              <Route path="/mortgages" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Mortgage Management" description="Track mortgage payments, balances, and schedules." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/mortgages/calculator" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Loan Calculator" description="Built-in calculators for loan analysis and comparisons." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/mortgages/schedule" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Payment Schedule" description="Track and manage mortgage payment schedules." />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Reports */}
              <Route path="/reports/financial" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Financial Reports" description="Income statements, cash flow analysis, and profitability reports." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports/occupancy" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Occupancy Reports" description="Track vacancy rates, turnover metrics, and occupancy trends." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports/rent-roll" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Rent Roll" description="Comprehensive rent roll with tenant details and payment status." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports/tax" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Tax Reports" description="Generate reports for tax preparation and compliance." />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Other Routes */}
              <Route path="/documents" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Document Management" description="Secure cloud-based document storage and organization." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Messages" description="Built-in messaging system for tenant and vendor communication." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Notifications" description="Manage all system notifications and alerts." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/templates" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Email Templates" description="Customize email templates for automated communications." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Settings" description="Configure system settings, integrations, and preferences." />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Profile" description="Manage your user profile and account settings." />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AppProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;