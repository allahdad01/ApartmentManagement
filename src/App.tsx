import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PropertiesList from './pages/Properties/PropertiesList';

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
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth Route component (redirects to dashboard if already authenticated)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();
  
  if (state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Simple Login component for demo
const Login: React.FC = () => {
  const { dispatch } = useAppContext();
  
  const handleLogin = () => {
    // Mock authentication
    localStorage.setItem('authToken', 'mock-token');
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
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '300px'
      }}>
        <h1 style={{ color: '#1976d2', marginBottom: '1rem' }}>PropertyPro</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Advanced Property Management SaaS
        </p>
        <button
          onClick={handleLogin}
          style={{
            background: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Enter Demo
        </button>
      </div>
    </div>
  );
};

// Placeholder components for other routes
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>This feature is coming soon!</p>
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
              
              {/* Protected Routes */}
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
                    <ComingSoon title="Add Property" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/properties/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Property Details" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/units" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Units Management" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Tenants & Leases */}
              <Route path="/tenants" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Tenants Management" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/applications" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Rental Applications" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/leases" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Lease Management" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/screening" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Tenant Screening" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Financial Management */}
              <Route path="/payments" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Rent Collection" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Invoice Management" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/expenses" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Expense Tracking" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Maintenance */}
              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Maintenance Management" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/vendors" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Vendor Management" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Mortgages */}
              <Route path="/mortgages" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Mortgage Management" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Reports */}
              <Route path="/reports/financial" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Financial Reports" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports/occupancy" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Occupancy Reports" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Other Routes */}
              <Route path="/documents" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Document Management" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Notifications" />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <ComingSoon title="Settings" />
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