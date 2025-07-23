import React from 'react';
import { Box, useTheme, useMediaQuery, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Update sidebar state when screen size changes
  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const sidebarWidth = isMobile ? 280 : isTablet ? 240 : 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header onMenuClick={handleSidebarToggle} />
      
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        variant={isMobile ? 'temporary' : 'permanent'}
        width={sidebarWidth}
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
          mt: { xs: 7, sm: 8 }, // Account for header height on mobile
          ml: isMobile ? 0 : (sidebarOpen ? `${sidebarWidth}px` : 0),
          width: isMobile ? '100%' : (sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%'),
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
          overflow: 'auto', // Ensure scrolling on mobile
          paddingBottom: isMobile ? '70px' : 0, // Space for mobile navigation
        }}
      >
        {children}
      </Box>
      
      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </Box>
  );
};

export default Layout;