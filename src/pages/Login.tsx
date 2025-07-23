import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Business, AccountCircle } from '@mui/icons-material';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      
      // Navigate based on user role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'SUPER_ADMIN') {
        navigate('/super-admin');
      } else if (user.role === 'TENANT') {
        navigate('/tenant');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Demo credentials for testing
  const demoCredentials = [
    { email: 'superadmin@propertypro.com', password: 'admin123', role: 'Super Admin' },
    { email: 'admin@sunset-pm.com', password: 'admin123', role: 'Organization Admin' },
    { email: 'manager@sunset-pm.com', password: 'manager123', role: 'Property Manager' },
    { email: 'tenant@example.com', password: 'tenant123', role: 'Tenant' },
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Business sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography component="h1" variant="h4" color="primary">
              PropertyPro
            </Typography>
          </Box>
          
          <Typography component="h2" variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Advanced Property Management SaaS
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                'Sign In'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Box>
          </Box>

          {/* Demo Credentials Section */}
          <Paper 
            elevation={1} 
            sx={{ 
              width: '100%', 
              mt: 3, 
              p: 2, 
              backgroundColor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Demo Credentials (Click to fill):
            </Typography>
            {demoCredentials.map((cred, index) => (
              <Button
                key={index}
                variant="text"
                size="small"
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
                sx={{ 
                  display: 'block', 
                  textAlign: 'left', 
                  width: '100%',
                  justifyContent: 'flex-start',
                  mb: 0.5,
                  textTransform: 'none'
                }}
              >
                <Typography variant="body2">
                  <strong>{cred.role}:</strong> {cred.email}
                </Typography>
              </Button>
            ))}
          </Paper>
        </Paper>
      </Box>
    </Container>
  );
}
