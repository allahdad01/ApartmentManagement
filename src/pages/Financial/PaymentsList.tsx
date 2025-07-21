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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  AttachMoney,
  Schedule,
  Warning,
  CheckCircle,
  AccessTime,
  Receipt,
  TrendingUp,
  TrendingDown,
  AccountBalance
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Payment } from '../../types';

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: '1',
    leaseId: 'lease1',
    tenantId: 'tenant1',
    type: 'rent',
    amount: 2500,
    dueDate: new Date('2024-01-01'),
    paidDate: new Date('2024-01-01'),
    paymentMethod: 'ach',
    status: 'paid',
    reference: 'ACH-001',
    notes: 'January rent payment',
    fees: { processingFee: 5 },
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    leaseId: 'lease2',
    tenantId: 'tenant2',
    type: 'rent',
    amount: 1800,
    dueDate: new Date('2024-01-01'),
    paidDate: new Date('2024-01-03'),
    paymentMethod: 'credit_card',
    status: 'paid',
    reference: 'CC-002',
    notes: 'January rent payment - paid late',
    fees: { processingFee: 25, lateFee: 50 },
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: '3',
    leaseId: 'lease3',
    tenantId: 'tenant3',
    type: 'rent',
    amount: 2200,
    dueDate: new Date('2024-01-01'),
    paymentMethod: 'online',
    status: 'overdue',
    notes: 'January rent payment - overdue',
    fees: { lateFee: 75 },
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    leaseId: 'lease4',
    tenantId: 'tenant4',
    type: 'deposit',
    amount: 2500,
    dueDate: new Date('2023-12-01'),
    paidDate: new Date('2023-12-01'),
    paymentMethod: 'check',
    status: 'paid',
    reference: 'DEP-001',
    notes: 'Security deposit',
    fees: {},
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: '5',
    leaseId: 'lease5',
    tenantId: 'tenant5',
    type: 'late_fee',
    amount: 100,
    dueDate: new Date('2024-01-15'),
    paymentMethod: 'online',
    status: 'pending',
    notes: 'Late fee for December rent',
    fees: {},
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '6',
    leaseId: 'lease6',
    tenantId: 'tenant6',
    type: 'rent',
    amount: 1950,
    dueDate: new Date('2024-02-01'),
    paymentMethod: 'ach',
    status: 'pending',
    notes: 'February rent payment',
    fees: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

const PaymentsList: React.FC = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const [payments, setPayments] = React.useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, payment: Payment) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const handleEdit = () => {
    if (selectedPayment) {
      navigate(`/payments/edit/${selectedPayment.id}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedPayment) {
      navigate(`/payments/${selectedPayment.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedPayment) {
      setPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
      setDeleteDialogOpen(false);
      setSelectedPayment(null);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tenantId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusChip = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'warning' as const, icon: <Schedule /> },
      paid: { label: 'Paid', color: 'success' as const, icon: <CheckCircle /> },
      overdue: { label: 'Overdue', color: 'error' as const, icon: <Warning /> },
      partial: { label: 'Partial', color: 'info' as const, icon: <AccessTime /> },
      refunded: { label: 'Refunded', color: 'default' as const, icon: <Receipt /> }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  const getTypeChip = (type: string) => {
    const typeConfig = {
      rent: { label: 'Rent', color: 'primary' as const },
      deposit: { label: 'Deposit', color: 'info' as const },
      late_fee: { label: 'Late Fee', color: 'warning' as const },
      pet_fee: { label: 'Pet Fee', color: 'secondary' as const },
      utility: { label: 'Utility', color: 'default' as const },
      other: { label: 'Other', color: 'default' as const }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
  };

  // Calculate summary statistics
  const totalReceived = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const collectionRate = payments.length > 0 
    ? ((payments.filter(p => p.status === 'paid').length / payments.length) * 100)
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Rent Collection & Payments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track rent payments, fees, and collection activities
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/payments/add')}
          size="large"
        >
          Record Payment
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
                    Total Received
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    ${totalReceived.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    This month
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
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
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    ${totalPending.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {payments.filter(p => p.status === 'pending').length} payments
                  </Typography>
                </Box>
                <Schedule color="warning" sx={{ fontSize: 40 }} />
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
                    Overdue
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    ${totalOverdue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
                    Needs attention
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
                    Collection Rate
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {collectionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This month
                  </Typography>
                </Box>
                <AccountBalance color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Overdue Payments Alert */}
      {totalOverdue > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            You have ${totalOverdue.toLocaleString()} in overdue payments from {payments.filter(p => p.status === 'overdue').length} tenant(s). 
            Consider sending payment reminders or following up directly.
          </Typography>
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search payments..."
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
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
                <MenuItem value="deposit">Deposit</MenuItem>
                <MenuItem value="late_fee">Late Fee</MenuItem>
                <MenuItem value="pet_fee">Pet Fee</MenuItem>
                <MenuItem value="utility">Utility</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredPayments.length} payments
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tenant</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {payment.tenantId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Lease: {payment.leaseId}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {getTypeChip(payment.type)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    ${payment.amount.toLocaleString()}
                  </Typography>
                  {(payment.fees.processingFee || payment.fees.lateFee) && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      +${((payment.fees.processingFee || 0) + (payment.fees.lateFee || 0)).toFixed(2)} fees
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {payment.dueDate.toLocaleDateString()}
                  </Typography>
                  {payment.status === 'overdue' && (
                    <Typography variant="caption" color="error.main" display="block">
                      {Math.floor((Date.now() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24))} days overdue
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {payment.paidDate ? (
                    <Typography variant="body2">
                      {payment.paidDate.toLocaleDateString()}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not paid
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusChip(payment.status)}
                </TableCell>
                <TableCell>
                  {payment.paymentMethod ? (
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {payment.paymentMethod.replace('_', ' ')}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                  {payment.reference && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {payment.reference}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, payment)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredPayments.length}
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
      {filteredPayments.length === 0 && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <AttachMoney sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No payments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by recording your first payment.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/payments/add')}
          >
            Record Payment
          </Button>
        </Paper>
      )}

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
          <ListItemText>Edit Payment</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Payment</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Payment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payment record? This action cannot be undone.
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

export default PaymentsList;