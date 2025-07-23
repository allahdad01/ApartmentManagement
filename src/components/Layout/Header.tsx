import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Select,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Settings,
  ExitToApp,
  Person,
  Business,
  Search,
  Add
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string>('all');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handlePropertyChange = (propertyId: string) => {
    if (propertyId === 'all') {
      dispatch({ type: 'SET_SELECTED_PROPERTY', payload: null });
    } else {
      const property = state.properties.find(p => p.id === propertyId);
      if (property) {
        dispatch({ type: 'SET_SELECTED_PROPERTY', payload: property });
      }
    }
    setSelectedPropertyId(propertyId);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'RESET_STATE' });
    navigate('/login');
    handleMenuClose();
  };

  const handleNotificationClick = (notification: any) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    handleMenuClose();
  };

  const unreadNotifications = state.notifications.filter(n => !n.isRead);

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: { width: 220, mt: 1 }
      }}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <ExitToApp fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(notificationAnchor)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: { width: 350, maxHeight: 400, mt: 1 }
      }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6">Notifications</Typography>
        <Typography variant="body2" color="text.secondary">
          {unreadNotifications.length} unread
        </Typography>
      </Box>
      {state.notifications.length === 0 ? (
        <MenuItem>
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </MenuItem>
      ) : (
        state.notifications.slice(0, 5).map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            sx={{
              backgroundColor: notification.isRead ? 'transparent' : theme.palette.action.hover,
              borderLeft: notification.isRead ? 'none' : `3px solid ${theme.palette.primary.main}`,
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle2" noWrap>
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(notification.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </MenuItem>
        ))
      )}
      {state.notifications.length > 5 && (
        <MenuItem onClick={() => { navigate('/notifications'); handleMenuClose(); }}>
          <Typography variant="body2" color="primary">
            View all notifications
          </Typography>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant={isMobile ? "h6" : "h6"} 
            noWrap 
            component="div" 
            sx={{ 
              mr: { xs: 1, md: 4 },
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            {isMobile ? 'PropertyPro' : 'PropertyPro'}
          </Typography>

          {/* Property Selector - Hidden on mobile */}
          {!isMobile && (
            <FormControl size="small" sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Property</InputLabel>
              <Select
                value={selectedPropertyId}
                label="Property"
                onChange={(e) => handlePropertyChange(e.target.value)}
              >
                <MenuItem value="all">All Properties</MenuItem>
                {state.properties.map((property) => (
                  <MenuItem key={property.id} value={property.id}>
                    {property.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Stats Chips */}
          {!isMobile && state.dashboardStats && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              <Chip
                icon={<Business />}
                label={`${state.dashboardStats.occupancyRate.toFixed(1)}% Occupied`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`$${(state.dashboardStats.monthlyRevenue / 1000).toFixed(0)}K Revenue`}
                size="small"
                color="success"
                variant="outlined"
              />
            </Box>
          )}

          {/* Quick Actions - Only show on desktop */}
          {!isMobile && (
            <IconButton
              color="inherit"
              onClick={() => navigate('/properties/add')}
              title="Add Property"
            >
              <Add />
            </IconButton>
          )}

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationMenuOpen}
            title="Notifications"
            size={isMobile ? 'small' : 'medium'}
          >
            <Badge badgeContent={unreadNotifications.length} color="error">
              <Notifications fontSize={isMobile ? 'small' : 'medium'} />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            size={isMobile ? 'small' : 'medium'}
            sx={{ ml: { xs: 0.5, md: 1 } }}
          >
            {state.user?.avatar ? (
              <Avatar 
                src={state.user.avatar} 
                sx={{ 
                  width: isMobile ? 28 : 32, 
                  height: isMobile ? 28 : 32 
                }}
              />
            ) : (
              <AccountCircle fontSize={isMobile ? 'small' : 'medium'} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {renderProfileMenu}
      {renderNotificationMenu}
    </>
  );
};

export default Header;