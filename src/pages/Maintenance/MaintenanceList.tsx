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
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Build,
  Person,
  Schedule,
  AttachMoney,
  Warning,
  CheckCircle,
  Assignment,
  Priority,
  Emergency
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MaintenanceRequest } from '../../types';

// Mock maintenance data
const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    unitId: 'unit1',
    tenantId: 'tenant1',
    title: 'Leaking Kitchen Faucet',
    description: 'The kitchen faucet has been leaking for the past few days. Water is dripping constantly.',
    category: 'plumbing',
    priority: 'medium',
    status: 'in_progress',
    images: [],
    assignedTo: 'vendor1',
    estimatedCost: 150,
    actualCost: 125,
    scheduledDate: new Date('2024-01-20'),
    notes: ['Vendor contacted', 'Parts ordered'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '2',
    unitId: 'unit2',
    tenantId: 'tenant2',
    title: 'HVAC System Not Working',
    description: 'The heating system is not working properly. Temperature is not reaching the set point.',
    category: 'hvac',
    priority: 'high',
    status: 'submitted',
    images: [],
    estimatedCost: 350,
    scheduledDate: new Date('2024-01-22'),
    notes: ['Emergency request', 'Tenant reported cold apartment'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    unitId: 'unit3',
    tenantId: 'tenant3',
    title: 'Broken Window Lock',
    description: 'The window lock in the bedroom is broken and cannot be secured properly.',
    category: 'structural',
    priority: 'low',
    status: 'completed',
    images: [],
    assignedTo: 'vendor2',
    estimatedCost: 75,
    actualCost: 80,
    scheduledDate: new Date('2024-01-16'),
    completedDate: new Date('2024-01-17'),
    notes: ['Lock replaced', 'Tenant satisfied'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '4',
    unitId: 'unit4',
    title: 'Electrical Outlet Not Working',
    description: 'The electrical outlet in the living room is not working. No power to the outlet.',
    category: 'electrical',
    priority: 'high',
    status: 'acknowledged',
    images: [],
    assignedTo: 'vendor3',
    estimatedCost: 200,
    scheduledDate: new Date('2024-01-21'),
    notes: ['Safety concern', 'Electrician scheduled'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '5',
    unitId: 'unit5',
    tenantId: 'tenant4',
    title: 'Dishwasher Making Strange Noise',
    description: 'The dishwasher is making unusual grinding noises during the wash cycle.',
    category: 'appliance',
    priority: 'medium',
    status: 'in_progress',
    images: [],
    assignedTo: 'vendor4',
    estimatedCost: 180,
    scheduledDate: new Date('2024-01-23'),
    notes: ['Diagnostic scheduled', 'May need replacement'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-19')
  }
];

const MaintenanceList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [maintenanceRequests, setMaintenanceRequests] = React.useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRequest, setSelectedRequest] = React.useState<MaintenanceRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, request: MaintenanceRequest) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const handleEdit = () => {
    if (selectedRequest) {
      navigate(`/maintenance/edit/${selectedRequest.id}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedRequest) {
      navigate(`/maintenance/${selectedRequest.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedRequest) {
      setMaintenanceRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
      setDeleteDialogOpen(false);
      setSelectedRequest(null);
    }
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusChip = (status: string) => {
    const statusConfig = {
      submitted: { label: 'Submitted', color: 'info' as const },
      acknowledged: { label: 'Acknowledged', color: 'warning' as const },
      in_progress: { label: 'In Progress', color: 'primary' as const },
      completed: { label: 'Completed', color: 'success' as const },
      cancelled: { label: 'Cancelled', color: 'error' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.submitted;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getPriorityChip = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Low', color: 'success' as const },
      medium: { label: 'Medium', color: 'warning' as const },
      high: { label: 'High', color: 'error' as const },
      emergency: { label: 'Emergency', color: 'error' as const }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      plumbing: <Build />,
      electrical: <Build />,
      hvac: <Build />,
      appliance: <Build />,
      structural: <Build />,
      cosmetic: <Build />,
      pest_control: <Build />,
      other: <Build />
    };
    
    return iconMap[category as keyof typeof iconMap] || <Build />;
  };

  const getStatusProgress = (status: string) => {
    const progressMap = {
      submitted: 25,
      acknowledged: 50,
      in_progress: 75,
      completed: 100,
      cancelled: 0
    };
    
    return progressMap[status as keyof typeof progressMap] || 0;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Maintenance Requests
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage work orders and maintenance requests
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/maintenance/add')}
          size="large"
        >
          Create Work Order
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Open Requests
                  </Typography>
                  <Typography variant="h4">
                    {maintenanceRequests.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length}
                  </Typography>
                </Box>
                <Assignment color="primary" sx={{ fontSize: 40 }} />
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
                    In Progress
                  </Typography>
                  <Typography variant="h4">
                    {maintenanceRequests.filter(r => r.status === 'in_progress').length}
                  </Typography>
                </Box>
                <Build color="warning" sx={{ fontSize: 40 }} />
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
                    High Priority
                  </Typography>
                  <Typography variant="h4">
                    {maintenanceRequests.filter(r => r.priority === 'high' || r.priority === 'emergency').length}
                  </Typography>
                </Box>
                <Warning color="error" sx={{ fontSize: 40 }} />
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
                    Completed Today
                  </Typography>
                  <Typography variant="h4">
                    {maintenanceRequests.filter(r => 
                      r.status === 'completed' && 
                      r.completedDate && 
                      new Date(r.completedDate).toDateString() === new Date().toDateString()
                    ).length}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search requests..."
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
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="acknowledged">Acknowledged</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="plumbing">Plumbing</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
                <MenuItem value="hvac">HVAC</MenuItem>
                <MenuItem value="appliance">Appliance</MenuItem>
                <MenuItem value="structural">Structural</MenuItem>
                <MenuItem value="cosmetic">Cosmetic</MenuItem>
                <MenuItem value="pest_control">Pest Control</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              {filteredRequests.length} requests found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Maintenance Requests Grid */}
      <Grid container spacing={3}>
        {filteredRequests.map((request) => (
          <Grid item xs={12} md={6} lg={4} key={request.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {getCategoryIcon(request.category)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" noWrap>
                        {request.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        #{request.id}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, request)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                  {request.description}
                </Typography>

                {/* Status and Priority */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {getStatusChip(request.status)}
                  {getPriorityChip(request.priority)}
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getStatusProgress(request.status)} 
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>

                {/* Details */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {request.category.replace('_', ' ')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Unit
                    </Typography>
                    <Typography variant="body2">
                      {request.unitId}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Cost Information */}
                {(request.estimatedCost || request.actualCost) && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Cost
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      {request.estimatedCost && (
                        <Typography variant="body2">
                          Est: ${request.estimatedCost}
                        </Typography>
                      )}
                      {request.actualCost && (
                        <Typography variant="body2" color="success.main">
                          Actual: ${request.actualCost}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Assigned Vendor */}
                {request.assignedTo && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Assigned To
                    </Typography>
                    <Typography variant="body2">
                      {request.assignedTo}
                    </Typography>
                  </Box>
                )}

                {/* Dates */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Created: {request.createdAt.toLocaleDateString()}
                  </Typography>
                  {request.scheduledDate && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Scheduled: {request.scheduledDate.toLocaleDateString()}
                    </Typography>
                  )}
                  {request.completedDate && (
                    <Typography variant="caption" color="success.main" display="block">
                      Completed: {request.completedDate.toLocaleDateString()}
                    </Typography>
                  )}
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {request.notes.length} notes
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate(`/maintenance/${request.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Build sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No maintenance requests found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by creating your first work order.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/maintenance/add')}
          >
            Create Work Order
          </Button>
        </Paper>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="create work order"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => navigate('/maintenance/add')}
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
          <ListItemText>Edit Request</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Request</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Maintenance Request</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedRequest?.title}"? This action cannot be undone.
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

export default MaintenanceList;