import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Home,
  People,
  AttachMoney,
  Build,
  Warning,
  CheckCircle,
  Schedule,
  Notifications,
  Add,
  ArrowForward
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
  Bar
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 120000, expenses: 45000 },
  { month: 'Feb', revenue: 125000, expenses: 48000 },
  { month: 'Mar', revenue: 118000, expenses: 42000 },
  { month: 'Apr', revenue: 132000, expenses: 50000 },
  { month: 'May', revenue: 128000, expenses: 46000 },
  { month: 'Jun', revenue: 135000, expenses: 52000 },
];

const occupancyData = [
  { name: 'Occupied', value: 44, color: '#4caf50' },
  { name: 'Vacant', value: 4, color: '#ff9800' },
  { name: 'Maintenance', value: 2, color: '#f44336' },
];

const maintenanceData = [
  { category: 'Plumbing', count: 12 },
  { category: 'HVAC', count: 8 },
  { category: 'Electrical', count: 5 },
  { category: 'Appliances', count: 10 },
  { category: 'Other', count: 7 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  onClick 
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-2px)' } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {change !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {change >= 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography 
                  variant="body2" 
                  color={change >= 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {Math.abs(change)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              backgroundColor: theme.palette[color].main,
              color: 'white',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const stats = state.dashboardStats;

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your properties.
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            change={5.2}
            icon={<Home />}
            color="primary"
            onClick={() => navigate('/properties')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            change={2.1}
            icon={<People />}
            color="success"
            onClick={() => navigate('/reports/occupancy')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={`$${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
            change={8.5}
            icon={<AttachMoney />}
            color="info"
            onClick={() => navigate('/reports/financial')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Maintenance"
            value={stats.pendingMaintenance}
            icon={<Build />}
            color="warning"
            onClick={() => navigate('/maintenance')}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`$${(value / 1000).toFixed(0)}K`, '']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  name="Revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke={theme.palette.error.main}
                  strokeWidth={3}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Occupancy Chart */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Unit Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {occupancyData.map((entry) => (
                <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: entry.color,
                      borderRadius: '50%',
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">
                    {entry.name}: {entry.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Activity
              </Typography>
              <Button 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/notifications')}
              >
                View All
              </Button>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Maintenance completed at Sunset Apartments #205"
                  secondary="2 hours ago"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AttachMoney color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Rent payment received from John Smith"
                  secondary="4 hours ago"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="New maintenance request submitted"
                  secondary="6 hours ago"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <People color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="New rental application received"
                  secondary="1 day ago"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Maintenance Requests by Category */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Maintenance by Category
              </Typography>
              <Button 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/maintenance')}
              >
                View All
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/properties/add')}
          >
            Add Property
          </Button>
          <Button
            variant="contained"
            startIcon={<People />}
            onClick={() => navigate('/tenants/add')}
          >
            Add Tenant
          </Button>
          <Button
            variant="contained"
            startIcon={<Build />}
            onClick={() => navigate('/maintenance/add')}
          >
            Create Work Order
          </Button>
          <Button
            variant="outlined"
            startIcon={<AttachMoney />}
            onClick={() => navigate('/expenses/add')}
          >
            Record Expense
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;