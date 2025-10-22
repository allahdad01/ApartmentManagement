import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Person,
  Phone,
  Email,
  Home,
  AttachMoney,
  Warning,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Tenant } from '../../types';

// Mock tenant data
const mockTenants: Tenant[] = [
  {
    id: '1',
    userId: 'user1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: new Date('1985-03-15'),
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    },
    employment: {
      employer: 'Tech Corp',
      position: 'Software Engineer',
      monthlyIncome: 8500,
      employmentStartDate: new Date('2020-01-15')
    },
    creditScore: 750,
    backgroundCheckStatus: 'approved',
    documents: [],
    currentLeases: ['lease1'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    isActive: true
  },
  {
    id: '2',
    userId: 'user2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: new Date('1990-07-22'),
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '(555) 876-5432',
      relationship: 'Father'
    },
    employment: {
      employer: 'Design Studio',
      position: 'UX Designer',
      monthlyIncome: 6500,
      employmentStartDate: new Date('2021-06-01')
    },
    creditScore: 720,
    backgroundCheckStatus: 'approved',
    documents: [],
    currentLeases: ['lease2'],
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-10'),
    isActive: true
  },
  {
    id: '3',
    userId: 'user3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '(555) 345-6789',
    dateOfBirth: new Date('1988-11-08'),
    emergencyContact: {
      name: 'Lisa Brown',
      phone: '(555) 765-4321',
      relationship: 'Sister'
    },
    employment: {
      employer: 'Marketing Agency',
      position: 'Marketing Manager',
      monthlyIncome: 7200,
      employmentStartDate: new Date('2019-09-15')
    },
    creditScore: 680,
    backgroundCheckStatus: 'pending',
    documents: [],
    currentLeases: [],
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05'),
    isActive: true
  },
  {
    id: '4',
    userId: 'user4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 456-7890',
    dateOfBirth: new Date('1992-12-03'),
    emergencyContact: {
      name: 'Robert Davis',
      phone: '(555) 654-3210',
      relationship: 'Father'
    },
    employment: {
      employer: 'Healthcare Plus',
      position: 'Nurse',
      monthlyIncome: 5800,
      employmentStartDate: new Date('2022-01-10')
    },
    creditScore: 710,
    backgroundCheckStatus: 'approved',
    documents: [],
    currentLeases: ['lease3'],
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2023-04-12'),
    isActive: true
  }
];

const TenantsList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [tenants, setTenants] = React.useState<Tenant[]>(mockTenants);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [leaseFilter, setLeaseFilter] = React.useState<string>('all');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTenant, setSelectedTenant] = React.useState<Tenant | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'cards' | 'table'>('cards');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, tenant: Tenant) => {
    setAnchorEl(event.currentTarget);
    setSelectedTenant(tenant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTenant(null);
  };

  const handleEdit = () => {
    if (selectedTenant) {
      navigate(`/tenants/edit/${selectedTenant.id}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedTenant) {
      navigate(`/tenants/${selectedTenant.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedTenant) {
      setTenants(prev => prev.filter(t => t.id !== selectedTenant.id));
      setDeleteDialogOpen(false);
      setSelectedTenant(null);
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = 
      tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || tenant.backgroundCheckStatus === statusFilter;
    const matchesLease = leaseFilter === 'all' || 
      (leaseFilter === 'active' && tenant.currentLeases.length > 0) ||
      (leaseFilter === 'inactive' && tenant.currentLeases.length === 0);
    
    return matchesSearch && matchesStatus && matchesLease;
  });

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Not Required" color="default" size="small" />;
    }
  };

  const getLeaseStatusChip = (currentLeases: string[]) => {
    if (currentLeases.length > 0) {
      return <Chip label="Active Lease" color="success" size="small" />;
    }
    return <Chip label="No Active Lease" color="default" size="small" />;
  };

  const renderCardsView = () => (
    <Grid container spacing={3}>
      {filteredTenants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tenant) => (
        <Grid item xs={12} md={6} lg={4} key={tenant.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Header with Avatar and Menu */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {tenant.firstName[0]}{tenant.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" noWrap>
                      {tenant.firstName} {tenant.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {tenant.id}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, tenant)}
                >
                  <MoreVert />
                </IconButton>
              </Box>

              {/* Contact Information */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" noWrap>
                    {tenant.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {tenant.phone}
                  </Typography>
                </Box>
              </Box>

              {/* Employment Info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Employment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tenant.employment.position} at {tenant.employment.employer}
                </Typography>
                <Typography variant="body2" color="success.main">
                  ${tenant.employment.monthlyIncome.toLocaleString()}/month
                </Typography>
              </Box>

              {/* Credit Score */}
              {tenant.creditScore && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Credit Score
                  </Typography>
                  <Typography variant="h6" color={tenant.creditScore >= 700 ? 'success.main' : tenant.creditScore >= 600 ? 'warning.main' : 'error.main'}>
                    {tenant.creditScore}
                  </Typography>
                </Box>
              )}

              {/* Status Chips */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {getStatusChip(tenant.backgroundCheckStatus)}
                {getLeaseStatusChip(tenant.currentLeases)}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Added: {tenant.createdAt.toLocaleDateString()}
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate(`/tenants/${tenant.id}`)}
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tenant</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Employment</TableCell>
            <TableCell>Credit Score</TableCell>
            <TableCell>Background Check</TableCell>
            <TableCell>Lease Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTenants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tenant) => (
            <TableRow key={tenant.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                    {tenant.firstName[0]}{tenant.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {tenant.firstName} {tenant.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {tenant.id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{tenant.email}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {tenant.phone}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {tenant.employment.position}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {tenant.employment.employer}
                </Typography>
                <Typography variant="caption" color="success.main" display="block">
                  ${tenant.employment.monthlyIncome.toLocaleString()}/mo
                </Typography>
              </TableCell>
              <TableCell>
                {tenant.creditScore ? (
                  <Typography 
                    variant="body2" 
                    color={tenant.creditScore >= 700 ? 'success.main' : tenant.creditScore >= 600 ? 'warning.main' : 'error.main'}
                    fontWeight="medium"
                  >
                    {tenant.creditScore}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    N/A
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {getStatusChip(tenant.backgroundCheckStatus)}
              </TableCell>
              <TableCell>
                {getLeaseStatusChip(tenant.currentLeases)}
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, tenant)}
                >
                  <MoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Tenants
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage tenant profiles and information
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/tenants/add')}
          size="large"
        >
          Add Tenant
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Background Check</InputLabel>
              <Select
                value={statusFilter}
                label="Background Check"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="not_required">Not Required</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Lease Status</InputLabel>
              <Select
                value={leaseFilter}
                label="Lease Status"
                onChange={(e) => setLeaseFilter(e.target.value)}
              >
                <MenuItem value="all">All Tenants</MenuItem>
                <MenuItem value="active">Active Lease</MenuItem>
                <MenuItem value="inactive">No Active Lease</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {filteredTenants.length} tenants
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              >
                {viewMode === 'cards' ? 'Table' : 'Cards'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Content */}
      {viewMode === 'cards' ? renderCardsView() : renderTableView()}

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredTenants.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{ mt: 2 }}
      />

      {/* Empty State */}
      {filteredTenants.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No tenants found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'all' || leaseFilter !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by adding your first tenant.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/tenants/add')}
          >
            Add Tenant
          </Button>
        </Paper>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add tenant"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => navigate('/tenants/add')}
      >
        <Add />
      </Fab>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Tenant</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Tenant</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Tenant</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedTenant?.firstName} {selectedTenant?.lastName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantsList;