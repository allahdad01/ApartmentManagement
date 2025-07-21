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
  useMediaQuery
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
  TrendingUp
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'temporary';
}

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/'
  },
  {
    text: 'Properties',
    icon: <Business />,
    children: [
      { text: 'All Properties', icon: <Apartment />, path: '/properties' },
      { text: 'Add Property', icon: <Home />, path: '/properties/add' },
      { text: 'Units', icon: <Inventory />, path: '/units' },
      { text: 'Property Analytics', icon: <TrendingUp />, path: '/properties/analytics' }
    ]
  },
  {
    text: 'Tenants & Leases',
    icon: <People />,
    children: [
      { text: 'All Tenants', icon: <People />, path: '/tenants' },
      { text: 'Applications', icon: <PersonAdd />, path: '/applications' },
      { text: 'Leases', icon: <Description />, path: '/leases' },
      { text: 'Tenant Screening', icon: <Security />, path: '/screening' }
    ]
  },
  {
    text: 'Financial Management',
    icon: <AttachMoney />,
    children: [
      { text: 'Rent Collection', icon: <Payment />, path: '/payments' },
      { text: 'Invoices', icon: <Receipt />, path: '/invoices' },
      { text: 'Expenses', icon: <AccountBalance />, path: '/expenses' },
      { text: 'Financial Reports', icon: <Assessment />, path: '/reports/financial' }
    ]
  },
  {
    text: 'Maintenance',
    icon: <Build />,
    children: [
      { text: 'Work Orders', icon: <Build />, path: '/maintenance' },
      { text: 'Vendors', icon: <Engineering />, path: '/vendors' },
      { text: 'Preventive Maintenance', icon: <CalendarMonth />, path: '/maintenance/preventive' },
      { text: 'Maintenance Calendar', icon: <CalendarMonth />, path: '/maintenance/calendar' }
    ]
  },
  {
    text: 'Mortgage & Loans',
    icon: <AccountBalance />,
    children: [
      { text: 'Mortgages', icon: <AccountBalance />, path: '/mortgages' },
      { text: 'Loan Calculator', icon: <Analytics />, path: '/mortgages/calculator' },
      { text: 'Payment Schedule', icon: <CalendarMonth />, path: '/mortgages/schedule' }
    ]
  },
  {
    text: 'Reports & Analytics',
    icon: <Assessment />,
    children: [
      { text: 'Financial Reports', icon: <Assessment />, path: '/reports/financial' },
      { text: 'Occupancy Reports', icon: <Analytics />, path: '/reports/occupancy' },
      { text: 'Rent Roll', icon: <Receipt />, path: '/reports/rent-roll' },
      { text: 'Tax Reports', icon: <Description />, path: '/reports/tax' }
    ]
  },
  {
    text: 'Documents',
    icon: <Description />,
    path: '/documents'
  },
  {
    text: 'Communications',
    icon: <Notifications />,
    children: [
      { text: 'Messages', icon: <Notifications />, path: '/messages' },
      { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
      { text: 'Email Templates', icon: <Assignment />, path: '/templates' }
    ]
  },
  {
    text: 'Settings',
    icon: <Settings />,
    path: '/settings'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onClose, 
  variant = 'temporary' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const handleItemClick = (item: NavItem) => {
    if (item.children) {
      const isExpanded = expandedItems.includes(item.text);
      if (isExpanded) {
        setExpandedItems(expandedItems.filter(text => text !== item.text));
      } else {
        setExpandedItems([...expandedItems, item.text]);
      }
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) {
        onClose();
      }
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some(child => child.path && isActive(child.path));
    }
    return false;
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.text);
    const active = item.path ? isActive(item.path) : isParentActive(item);

    return (
      <React.Fragment key={item.text}>
        <ListItem disablePadding sx={{ pl: level * 2 }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={active}
            sx={{
              minHeight: 48,
              backgroundColor: active ? theme.palette.primary.main + '20' : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.primary.main + '10',
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '20',
                borderRight: `3px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '30',
                }
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: active ? theme.palette.primary.main : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                opacity: open ? 1 : 0,
                color: active ? theme.palette.primary.main : 'inherit',
                fontWeight: active ? 600 : 400
              }} 
            />
            {hasChildren && open && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderNavItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          minHeight: 64,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        {open && (
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            PropertyPro
          </Typography>
        )}
        {variant === 'permanent' && (
          <IconButton onClick={onClose} size="small">
            <MenuOpen />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List>
          {navigationItems.map(item => renderNavItem(item))}
        </List>
      </Box>

      {/* Footer */}
      {open && (
        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary">
            PropertyPro v1.0.0
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: open ? 280 : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : 72,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;