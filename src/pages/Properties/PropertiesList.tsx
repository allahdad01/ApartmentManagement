import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
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
  ListItemText
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  LocationOn,
  Home,
  Business,
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types';

const PropertiesList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, property: Property) => {
    setAnchorEl(event.currentTarget);
    setSelectedProperty(property);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProperty(null);
  };

  const handleEdit = () => {
    if (selectedProperty) {
      navigate(`/properties/edit/${selectedProperty.id}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedProperty) {
      navigate(`/properties/${selectedProperty.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedProperty) {
      dispatch({ type: 'DELETE_PROPERTY', payload: selectedProperty.id });
      setDeleteDialogOpen(false);
      setSelectedProperty(null);
    }
  };

  const filteredProperties = state.properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || property.isActive.toString() === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'commercial':
        return <Business />;
      case 'residential':
        return <Home />;
      default:
        return <Business />;
    }
  };

  const getOccupancyRate = (property: Property) => {
    // Mock calculation - in real app, this would be calculated from actual data
    return Math.floor(Math.random() * 30) + 70; // 70-100%
  };

  const getMonthlyRevenue = (property: Property) => {
    // Mock calculation - in real app, this would be calculated from actual data
    return property.totalUnits * 1200 + Math.floor(Math.random() * 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Properties
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your property portfolio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/properties/add')}
          size="large"
        >
          Add Property
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search properties..."
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
              <InputLabel>Property Type</InputLabel>
              <Select
                value={typeFilter}
                label="Property Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="residential">Residential</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
                <MenuItem value="mixed_use">Mixed Use</MenuItem>
                <MenuItem value="industrial">Industrial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredProperties.length} properties
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Properties Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {filteredProperties.map((property) => {
          const occupancyRate = getOccupancyRate(property);
          const monthlyRevenue = getMonthlyRevenue(property);
          
          return (
            <Grid item xs={12} sm={6} md={6} lg={4} key={property.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Property Image */}
                <CardMedia
                  sx={{ 
                    height: { xs: 160, sm: 180, md: 200 }, 
                    position: 'relative' 
                  }}
                  image={property.images?.[0] || '/api/placeholder/400/200'}
                  title={property.name}
                >
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, property)}
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                  <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                    <Chip
                      icon={getPropertyIcon(property.type)}
                      label={property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                    />
                  </Box>
                </CardMedia>

                <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                  {/* Property Name and Address */}
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    noWrap
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    {property.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        ml: 0.5,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {property.address.city}, {property.address.state}
                    </Typography>
                  </Box>

                  {/* Key Metrics */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {property.totalUnits}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Units
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main">
                          {occupancyRate}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Occupied
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Revenue */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Revenue
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      ${monthlyRevenue.toLocaleString()}
                    </Typography>
                  </Box>

                  {/* Property Class */}
                  <Chip
                    label={property.propertyClass.replace('_', ' ').toUpperCase()}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  {/* Amenities */}
                  {property.amenities.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Amenities:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <Chip
                            key={amenity}
                            label={amenity}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {property.amenities.length > 3 && (
                          <Chip
                            label={`+${property.amenities.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Status */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={property.isActive ? 'Active' : 'Inactive'}
                      color={property.isActive ? 'success' : 'error'}
                      size="small"
                    />
                    <Button
                      size="small"
                      onClick={() => navigate(`/properties/${property.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Business sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No properties found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by adding your first property.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/properties/add')}
          >
            Add Property
          </Button>
        </Paper>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add property"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => navigate('/properties/add')}
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
          <ListItemText>Edit Property</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Property</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProperty?.name}"? This action cannot be undone.
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

export default PropertiesList;