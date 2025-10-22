import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Business,
  People,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Block,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Add,
  Assessment,
  AccountBalance,
  PersonAdd,
  Settings,
  Security,
  Notifications,
  Schedule
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Organization, PlatformStats, SubscriptionPlan } from '../../types';

// Mock data for super admin dashboard
const mockPlatformStats: PlatformStats = {
  totalOrganizations: 247,
  activeOrganizations: 231,
  totalUsers: 1849,
  totalProperties: 3420,
  totalRevenue: 89750,
  monthlyRevenue: 12450,
  churnRate: 3.2,
  averagePropertiesPerOrg: 13.8,
  subscriptionBreakdown: {
    'Starter': 89,
    'Professional': 124,
    'Enterprise': 34
  },
  recentSignups: [],
  topPerformingOrgs: []
};

const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Sunset Property Management',
    slug: 'sunset-pm',
    description: 'Luxury residential property management',
    address: {
      street: '123 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    subscriptionPlan: {
      id: 'pro',
      name: 'professional',
      displayName: 'Professional',
      price: 149,
      billingCycle: 'monthly',
      maxProperties: 50,
      maxUsers: 10,
      features: ['Advanced Analytics', 'API Access', 'Custom Branding'],
      isActive: true
    },
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date('2023-01-15'),
    maxProperties: 50,
    maxUsers: 10,
    features: ['Advanced Analytics', 'API Access', 'Custom Branding'],
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      allowTenantPortal: true,
      allowOnlinePayments: true,
      autoLateFeesEnabled: true,
      lateFeeAmount: 50,
      lateFeeGracePeriod: 5,
      maintenanceAutoAssignment: false,
      emailNotifications: true,
      smsNotifications: false,
      customBranding: {
        primaryColor: '#1976d2',
        companyName: 'Sunset PM'
      }
    },
    ownerId: 'user1',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '2',
    name: 'Metro Real Estate Group',
    slug: 'metro-reg',
    description: 'Commercial and residential properties',
    address: {
      street: '456 Downtown St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    subscriptionPlan: {
      id: 'ent',
      name: 'enterprise',
      displayName: 'Enterprise',
      price: 299,
      billingCycle: 'monthly',
      maxProperties: 200,
      maxUsers: 50,
      features: ['All Features', 'White Label', 'Priority Support'],
      isActive: true
    },
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date('2022-08-10'),
    maxProperties: 200,
    maxUsers: 50,
    features: ['All Features', 'White Label', 'Priority Support'],
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      allowTenantPortal: true,
      allowOnlinePayments: true,
      autoLateFeesEnabled: true,
      lateFeeAmount: 75,
      lateFeeGracePeriod: 3,
      maintenanceAutoAssignment: true,
      emailNotifications: true,
      smsNotifications: true,
      customBranding: {
        primaryColor: '#2e7d32',
        secondaryColor: '#4caf50',
        companyName: 'Metro REG'
      }
    },
    ownerId: 'user2',
    createdAt: new Date('2022-08-10'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '3',
    name: 'Coastal Properties LLC',
    slug: 'coastal-props',
    description: 'Beachfront vacation rentals',
    address: {
      street: '789 Ocean Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    subscriptionPlan: {
      id: 'starter',
      name: 'starter',
      displayName: 'Starter',
      price: 49,
      billingCycle: 'monthly',
      maxProperties: 10,
      maxUsers: 3,
      features: ['Basic Features', 'Email Support'],
      isActive: true
    },
    subscriptionStatus: 'trial',
    subscriptionStartDate: new Date('2024-01-01'),
    subscriptionEndDate: new Date('2024-01-31'),
    maxProperties: 10,
    maxUsers: 3,
    features: ['Basic Features', 'Email Support'],
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      allowTenantPortal: false,
      allowOnlinePayments: true,
      autoLateFeesEnabled: false,
      lateFeeAmount: 25,
      lateFeeGracePeriod: 7,
      maintenanceAutoAssignment: false,
      emailNotifications: true,
      smsNotifications: false,
      customBranding: {}
    },
    ownerId: 'user3',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    isActive: true
  }
];

// Mock revenue data
const revenueData = [
  { month: 'Jan', revenue: 8500, organizations: 220 },
  { month: 'Feb', revenue: 9200, organizations: 225 },
  { month: 'Mar', revenue: 9800, organizations: 232 },
  { month: 'Apr', revenue: 10100, organizations: 238 },
  { month: 'May', revenue: 10800, organizations: 241 },
  { month: 'Jun', revenue: 11200, organizations: 245 },
  { month: 'Jul', revenue: 11800, organizations: 247 },
];

const subscriptionData = [
  { name: 'Starter', value: 89, color: '#8884d8' },
  { name: 'Professional', value: 124, color: '#82ca9d' },
  { name: 'Enterprise', value: 34, color: '#ffc658' },
];

const PlatformDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(null);
  const [suspendDialogOpen, setSuspendDialogOpen] = React.useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, org: Organization) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrg(org);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrg(null);
  };

  const handleSuspendOrg = () => {
    setSuspendDialogOpen(true);
    handleMenuClose();
  };

  const confirmSuspend = () => {
    // Implementation would suspend the organization
    console.log('Suspending organization:', selectedOrg?.name);
    setSuspendDialogOpen(false);
    setSelectedOrg(null);
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', color: 'success' as const, icon: <CheckCircle /> },
      trial: { label: 'Trial', color: 'info' as const, icon: <Schedule /> },
      suspended: { label: 'Suspended', color: 'error' as const, icon: <Block /> },
      inactive: { label: 'Inactive', color: 'default' as const, icon: <Warning /> },
      cancelled: { label: 'Cancelled', color: 'error' as const, icon: <Block /> }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  const getPlanChip = (planName: string) => {
    const planConfig = {
      starter: { label: 'Starter', color: 'default' as const },
      professional: { label: 'Professional', color: 'primary' as const },
      enterprise: { label: 'Enterprise', color: 'secondary' as const }
    };
    
    const config = planConfig[planName as keyof typeof planConfig] || planConfig.starter;
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Platform Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Super Admin - Manage SaaS platform and organizations
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => navigate('/super-admin/settings')}
          >
            Platform Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/super-admin/organizations/add')}
          >
            Add Organization
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Organizations
                  </Typography>
                  <Typography variant="h4">
                    {mockPlatformStats.totalOrganizations}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    +12 this month
                  </Typography>
                </Box>
                <Business color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    ${mockPlatformStats.monthlyRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    +8.5% from last month
                  </Typography>
                </Box>
                <AttachMoney color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {mockPlatformStats.totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    Across all orgs
                  </Typography>
                </Box>
                <People color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Churn Rate
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {mockPlatformStats.churnRate}%
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
                    Target: <3%
                  </Typography>
                </Box>
                <Assessment color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue & Growth Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `$${value}` : value,
                      name === 'revenue' ? 'Revenue' : 'Organizations'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="#1976d2" 
                    fill="#1976d2" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="organizations" 
                    stackId="2"
                    stroke="#2e7d32" 
                    fill="#2e7d32" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Subscription Plans
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health Alerts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              System Status: All services operational. Next maintenance window: Jan 28, 2024 2:00 AM UTC
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Organizations Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Organizations Management
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => navigate('/super-admin/organizations/add')}
            >
              Add Organization
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organization</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Properties</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockOrganizations.map((org) => (
                  <TableRow key={org.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {org.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {org.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {org.slug}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {getPlanChip(org.subscriptionPlan.name)}
                      <Typography variant="caption" color="text.secondary" display="block">
                        ${org.subscriptionPlan.price}/{org.subscriptionPlan.billingCycle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(org.subscriptionStatus)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        12/{org.maxProperties}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(12 / org.maxProperties) * 100} 
                        sx={{ mt: 0.5, height: 4 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        5/{org.maxUsers}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(5 / org.maxUsers) * 100} 
                        sx={{ mt: 0.5, height: 4 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        ${org.subscriptionPlan.price}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        per month
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {org.createdAt.toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, org)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/super-admin/organizations/${selectedOrg?.id}`)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate(`/super-admin/organizations/${selectedOrg?.id}/edit`)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Organization</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate(`/super-admin/organizations/${selectedOrg?.id}/impersonate`)}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>Impersonate Admin</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSuspendOrg} sx={{ color: 'warning.main' }}>
          <ListItemIcon>
            <Block fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Suspend Organization</ListItemText>
        </MenuItem>
      </Menu>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={suspendDialogOpen} onClose={() => setSuspendDialogOpen(false)}>
        <DialogTitle>Suspend Organization</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to suspend "{selectedOrg?.name}"? This will prevent all users in this organization from accessing the platform.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmSuspend} color="warning" variant="contained">
            Suspend
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlatformDashboard;