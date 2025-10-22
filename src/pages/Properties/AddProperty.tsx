import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch,
  Autocomplete,
  Divider,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Add,
  Delete,
  LocationOn,
  AttachMoney,
  Home,
  Business
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Property } from '../../types';

interface PropertyFormData {
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'mixed_use' | 'industrial';
  propertyClass: 'single_family' | 'multi_family' | 'apartment' | 'condo' | 'townhouse' | 'office' | 'retail' | 'warehouse';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalUnits: number;
  yearBuilt: number | '';
  squareFootage: number | '';
  lotSize: number | '';
  purchasePrice: number | '';
  purchaseDate: string;
  marketValue: number | '';
  amenities: string[];
  images: string[];
  managerId: string;
  ownerId: string;
  isActive: boolean;
}

const steps = ['Basic Information', 'Property Details', 'Financial Information', 'Amenities & Images'];

const amenityOptions = [
  'Pool', 'Gym', 'Parking', 'Laundry', 'Elevator', 'Balcony', 'Garden',
  'Security System', 'Air Conditioning', 'Heating', 'Dishwasher', 'Microwave',
  'In-unit Washer/Dryer', 'Walk-in Closet', 'Fireplace', 'Hardwood Floors',
  'Carpet', 'Tile Floors', 'High Ceilings', 'Large Windows', 'Storage Unit',
  'Concierge', 'Doorman', 'Rooftop Access', 'Business Center', 'Conference Room'
];

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [errors, setErrors] = React.useState<{[key: string]: string}>({});
  const [formData, setFormData] = React.useState<PropertyFormData>({
    name: '',
    description: '',
    type: 'residential',
    propertyClass: 'apartment',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    totalUnits: 1,
    yearBuilt: '',
    squareFootage: '',
    lotSize: '',
    purchasePrice: '',
    purchaseDate: '',
    marketValue: '',
    amenities: [],
    images: [],
    managerId: 'mgr1', // Mock manager ID
    ownerId: 'owner1', // Mock owner ID
    isActive: true
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.name.trim()) newErrors.name = 'Property name is required';
        if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
        if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
        if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
        if (!formData.address.zipCode.trim()) newErrors['address.zipCode'] = 'ZIP code is required';
        break;
      
      case 1: // Property Details
        if (formData.totalUnits < 1) newErrors.totalUnits = 'Total units must be at least 1';
        if (formData.yearBuilt && (formData.yearBuilt < 1800 || formData.yearBuilt > new Date().getFullYear())) {
          newErrors.yearBuilt = 'Please enter a valid year';
        }
        break;
      
      case 2: // Financial Information
        if (formData.purchasePrice && formData.purchasePrice < 0) {
          newErrors.purchasePrice = 'Purchase price cannot be negative';
        }
        if (formData.marketValue && formData.marketValue < 0) {
          newErrors.marketValue = 'Market value cannot be negative';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      const newProperty: Property = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        propertyClass: formData.propertyClass,
        address: formData.address,
        totalUnits: formData.totalUnits,
        yearBuilt: formData.yearBuilt || undefined,
        squareFootage: formData.squareFootage || undefined,
        lotSize: formData.lotSize || undefined,
        purchasePrice: formData.purchasePrice || undefined,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
        marketValue: formData.marketValue || undefined,
        amenities: formData.amenities,
        images: formData.images,
        managerId: formData.managerId,
        ownerId: formData.ownerId,
        units: [], // Will be populated separately
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: formData.isActive
      };

      dispatch({ type: 'ADD_PROPERTY', payload: newProperty });
      navigate('/properties');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to a cloud storage service
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Property Type"
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <MenuItem value="residential">Residential</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="mixed_use">Mixed Use</MenuItem>
                  <MenuItem value="industrial">Industrial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Property Class</InputLabel>
                <Select
                  value={formData.propertyClass}
                  label="Property Class"
                  onChange={(e) => handleInputChange('propertyClass', e.target.value)}
                >
                  {formData.type === 'residential' ? (
                    <>
                      <MenuItem value="single_family">Single Family</MenuItem>
                      <MenuItem value="multi_family">Multi Family</MenuItem>
                      <MenuItem value="apartment">Apartment</MenuItem>
                      <MenuItem value="condo">Condo</MenuItem>
                      <MenuItem value="townhouse">Townhouse</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem value="office">Office</MenuItem>
                      <MenuItem value="retail">Retail</MenuItem>
                      <MenuItem value="warehouse">Warehouse</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                error={!!errors['address.street']}
                helperText={errors['address.street']}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                error={!!errors['address.city']}
                helperText={errors['address.city']}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                error={!!errors['address.state']}
                helperText={errors['address.state']}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={formData.address.zipCode}
                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                error={!!errors['address.zipCode']}
                helperText={errors['address.zipCode']}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Units"
                type="number"
                value={formData.totalUnits}
                onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value) || 1)}
                error={!!errors.totalUnits}
                helperText={errors.totalUnits}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year Built"
                type="number"
                value={formData.yearBuilt}
                onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value) || '')}
                error={!!errors.yearBuilt}
                helperText={errors.yearBuilt}
                InputProps={{ inputProps: { min: 1800, max: new Date().getFullYear() } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Square Footage"
                type="number"
                value={formData.squareFootage}
                onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value) || '')}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Lot Size (sq ft)"
                type="number"
                value={formData.lotSize}
                onChange={(e) => handleInputChange('lotSize', parseInt(e.target.value) || '')}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                }
                label="Property is Active"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purchase Price"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || '')}
                error={!!errors.purchasePrice}
                helperText={errors.purchasePrice}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purchase Date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Market Value"
                type="number"
                value={formData.marketValue}
                onChange={(e) => handleInputChange('marketValue', parseFloat(e.target.value) || '')}
                error={!!errors.marketValue}
                helperText={errors.marketValue}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Amenities
              </Typography>
              <Autocomplete
                multiple
                options={amenityOptions}
                value={formData.amenities}
                onChange={(_, newValue) => handleInputChange('amenities', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select amenities"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Property Images
              </Typography>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    Upload Images
                  </Button>
                </label>
              </Box>
              {formData.images.length > 0 && (
                <Grid container spacing={2}>
                  {formData.images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <Box sx={{ position: 'relative' }}>
                          <img
                            src={image}
                            alt={`Property ${index + 1}`}
                            style={{ width: '100%', height: 200, objectFit: 'cover' }}
                          />
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.8)'
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/properties')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" gutterBottom>
            Add New Property
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the details below to add a new property to your portfolio
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Form Content */}
      <Paper sx={{ p: 4 }}>
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Please correct the errors below before proceeding.
          </Alert>
        )}
        
        {renderStepContent(activeStep)}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/properties')}
            >
              Cancel
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                size="large"
              >
                Create Property
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddProperty;