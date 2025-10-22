import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import {
  Dashboard,
  Home,
  People,
  Build,
  Payment,
  Assessment
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const MobileNavigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppContext();

  if (!isMobile) return null;

  const getActiveIndex = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 0;
    if (path.startsWith('/properties')) return 1;
    if (path.startsWith('/tenants')) return 2;
    if (path.startsWith('/maintenance')) return 3;
    if (path.startsWith('/payments')) return 4;
    if (path.startsWith('/reports')) return 5;
    return 0;
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/properties');
        break;
      case 2:
        navigate('/tenants');
        break;
      case 3:
        navigate('/maintenance');
        break;
      case 4:
        navigate('/payments');
        break;
      case 5:
        navigate('/reports');
        break;
    }
  };

  const pendingMaintenance = state.maintenanceRequests?.filter(
    req => req.status === 'SUBMITTED' || req.status === 'ACKNOWLEDGED'
  ).length || 0;

  const overduePayments = state.payments?.filter(
    payment => payment.status === 'OVERDUE'
  ).length || 0;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderRadius: 0,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
      elevation={8}
    >
      <BottomNavigation
        value={getActiveIndex()}
        onChange={handleChange}
        showLabels
        sx={{
          height: 70,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 8px',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              marginTop: '4px',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          icon={<Dashboard />}
        />
        <BottomNavigationAction
          label="Properties"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="Tenants"
          icon={<People />}
        />
        <BottomNavigationAction
          label="Maintenance"
          icon={
            <Badge badgeContent={pendingMaintenance} color="error" max={99}>
              <Build />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Payments"
          icon={
            <Badge badgeContent={overduePayments} color="warning" max={99}>
              <Payment />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Reports"
          icon={<Assessment />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNavigation;