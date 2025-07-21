import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  Dashboard,
  Business,
  Home,
  People,
  Description,
  Payment,
  AccountBalance,
  Build,
  Assessment,
  Settings,
  Notifications,
  Assignment,
  ExpandLess,
  ExpandMore,
  MenuOpen,
  Apartment,
  AttachMoney,
  Receipt,
  Engineering,
  Analytics,
  PersonAdd,
  CalendarMonth,
  Inventory,
  Security,
  TrendingUp,
  SupervisorAccount,
  CorporateFare,
  AccountBalanceWallet,
  PeopleAlt,
  BarChart,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'temporary';
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItem[];
  badge?: string | number;
  roles?: string[]; // Roles that can see this menu item
}

// Super Admin Menu Items
const superAdminMenuItems: MenuItem[] = [
  {
    id: 'platform-dashboard',
    label: 'Platform Dashboard',
    icon: <Dashboard />,
    path: '/super-admin',
    roles: ['super_admin']
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: <CorporateFare />,
    roles: ['super_admin'],
    children: [
      {
        id: 'organizations-list',
        label: 'All Organizations',
        icon: <Business />,
        path: '/super-admin/organizations',
        roles: ['super_admin']
      },
      {
        id: 'add-organization',
        label: 'Add Organization',
        icon: <PersonAdd />,
        path: '/super-admin/organizations/add',
        roles: ['super_admin']
      }
    ]
  },
  {
    id: 'platform-billing',
    label: 'Billing & Revenue',
    icon: <AccountBalanceWallet />,
    path: '/super-admin/billing',
    roles: ['super_admin']
  },
  {
    id: 'platform-users',
    label: 'Platform Users',
    icon: <PeopleAlt />,
    path: '/super-admin/users',
    roles: ['super_admin']
  },
  {
    id: 'platform-analytics',
    label: 'Platform Analytics',
    icon: <BarChart />,
    path: '/super-admin/analytics',
    roles: ['super_admin']
  },
  {
    id: 'platform-settings',
    label: 'Platform Settings',
    icon: <AdminPanelSettings />,
    path: '/super-admin/settings',
    roles: ['super_admin']
  }
];

// Organization Admin Menu Items
const organizationMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/',
    roles: ['admin', 'property_manager', 'landlord']
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: <Home />,
    roles: ['admin', 'property_manager', 'landlord'],
    children: [
      {
        id: 'properties-list',
        label: 'All Properties',
        icon: <Business />,
        path: '/properties',
        roles: ['admin', 'property_manager', 'landlord']
      },
      {
        id: 'add-property',
        label: 'Add Property',
        icon: <Apartment />,
        path: '/properties/add',
        roles: ['admin', 'property_manager']
      },
      {
        id: 'units',
        label: 'Units Management',
        icon: <Inventory />,
        path: '/units',
        roles: ['admin', 'property_manager']
      }
    ]
  },
  {
    id: 'tenants',
    label: 'Tenants & Leases',
    icon: <People />,
    roles: ['admin', 'property_manager', 'landlord'],
    children: [
      {
        id: 'tenants-list',
        label: 'All Tenants',
        icon: <People />,
        path: '/tenants',
        roles: ['admin', 'property_manager', 'landlord']
      },
      {
        id: 'applications',
        label: 'Applications',
        icon: <Assignment />,
        path: '/applications',
        badge: '3',
        roles: ['admin', 'property_manager']
      },
      {
        id: 'leases',
        label: 'Lease Management',
        icon: <Description />,
        path: '/leases',
        roles: ['admin', 'property_manager']
      },
      {
        id: 'screening',
        label: 'Tenant Screening',
        icon: <Security />,
        path: '/screening',
        roles: ['admin', 'property_manager']
      }
    ]
  },
  {
    id: 'financial',
    label: 'Financial',
    icon: <AttachMoney />,
    roles: ['admin', 'property_manager', 'landlord'],
    children: [
      {
        id: 'payments',
        label: 'Rent Collection',
        icon: <Payment />,
        path: '/payments',
        badge: '2',
        roles: ['admin', 'property_manager', 'landlord']
      },
      {
        id: 'invoices',
        label: 'Invoices',
        icon: <Receipt />,
        path: '/invoices',
        roles: ['admin', 'property_manager']
      },
      {
        id: 'expenses',
        label: 'Expenses',
        icon: <TrendingUp />,
        path: '/expenses',
        roles: ['admin', 'property_manager']
      }
    ]
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: <Build />,
    roles: ['admin', 'property_manager', 'landlord'],
    children: [
      {
        id: 'maintenance-requests',
        label: 'Work Orders',
        icon: <Engineering />,
        path: '/maintenance',
        badge: '5',
        roles: ['admin', 'property_manager', 'landlord']
      },
      {
        id: 'vendors',
        label: 'Vendors',
        icon: <SupervisorAccount />,
        path: '/vendors',
        roles: ['admin', 'property_manager']
      },
      {
        id: 'preventive',
        label: 'Preventive',
        icon: <CalendarMonth />,
        path: '/maintenance/preventive',
        roles: ['admin', 'property_manager']
      },
      {
        id: 'calendar',
        label: 'Calendar',
        icon: <CalendarMonth />,
        path: '/maintenance/calendar',
        roles: ['admin', 'property_manager']
      }
    ]
  },
  {
    id: 'mortgages',
    label: 'Mortgages',
    icon: <AccountBalance />,
    roles: ['admin', 'landlord'],
    children: [
      {
        id: 'mortgage-list',
        label: 'All Mortgages',
        icon: <AccountBalance />,
        path: '/mortgages',
        roles: ['admin', 'landlord']
      },
      {
        id: 'calculator',
        label: 'Loan Calculator',
        icon: <Analytics />,
        path: '/mortgages/calculator',
        roles: ['admin', 'landlord']
      },
      {
        id: 'schedule',
        label: 'Payment Schedule',
        icon: <CalendarMonth />,
        path: '/mortgages/schedule',
        roles: ['admin', 'landlord']
      }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <Assessment />,
    roles: ['admin', 'property_manager', 'landlord'],
    children: [
      {
        id: 'financial-reports',
        label: 'Financial Reports',
        icon: <TrendingUp />,
        path: '/reports/financial',
        roles: ['admin', 'property_manager', 'landlord']
      },
      {
        id: 'occupancy',
        label: 'Occupancy Reports',
        icon: <Home />,
        path: '/reports/occupancy',
        roles: ['admin', 'property_manager', 'landlord']
      },
      {
        id: 'rent-roll',
        label: 'Rent Roll',
        icon: <Receipt />,
        path: '/reports/rent-roll',
        roles: ['admin', 'property_manager', 'landlord']
      },
      {
        id: 'tax-reports',
        label: 'Tax Reports',
        icon: <Assessment />,
        path: '/reports/tax',
        roles: ['admin', 'landlord']
      }
    ]
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <Description />,
    path: '/documents',
    roles: ['admin', 'property_manager', 'landlord']
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <Notifications />,
    path: '/messages',
    badge: '12',
    roles: ['admin', 'property_manager', 'landlord']
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    path: '/settings',
    roles: ['admin']
  }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onClose, 
  variant = 'temporary' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppContext();

  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  // Get appropriate menu items based on user role
  const menuItems = state.user?.role === 'super_admin' 
    ? superAdminMenuItems 
    : organizationMenuItems;

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
      if (isMobile) {
        onClose();
      }
    } else if (item.children) {
      toggleExpanded(item.id);
    }
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const hasPermission = (item: MenuItem): boolean => {
    if (!item.roles || !state.user) return true;
    return item.roles.includes(state.user.role);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!hasPermission(item)) return null;

    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              pl: level * 2 + 2,
              pr: 2,
              py: 1,
              backgroundColor: isActive ? 'primary.main' : 'transparent',
              color: isActive ? 'white' : 'text.primary',
              '&:hover': {
                backgroundColor: isActive ? 'primary.dark' : 'action.hover',
              },
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive ? 'white' : 'text.secondary',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
              }}
            />
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                color="error"
                sx={{ ml: 1, fontSize: '0.75rem', height: 20 }}
              />
            )}
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            PropertyPro
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {state.user?.role === 'super_admin' ? 'Super Admin Panel' : state.currentOrganization?.name || 'Property Management'}
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <MenuOpen />
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <Typography variant="body2" color="white" fontWeight="bold">
              {state.user?.firstName?.[0]}{state.user?.lastName?.[0]}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {state.user?.firstName} {state.user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {state.user?.role === 'super_admin' ? 'Super Administrator' : 'Organization Admin'}
            </Typography>
          </Box>
        </Box>
        {state.user?.role !== 'super_admin' && state.currentOrganization && (
          <Chip
            label={state.currentOrganization.subscriptionPlan.displayName}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List sx={{ pt: 1 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          PropertyPro v2.0.0
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          {state.user?.role === 'super_admin' ? 'Platform Management' : 'Multi-Tenant SaaS'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
          backgroundColor: 'background.paper',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;