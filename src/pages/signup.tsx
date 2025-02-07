import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  TextField, 
  Grid,
  Alert,
  Divider
} from '@mui/material';
import { HowToReg, ArrowForward } from '@mui/icons-material';
import { signIn } from 'next-auth/react';
import type { ProfileData } from '@/types/profile';

interface SignupFormData extends ProfileData {
  password: string;
}

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    companyName: '',
    phoneNumber: '',
    companyAddress: '',
    city: '',
    country: '',
    postalCode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: formData.email.toLowerCase().trim()
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      const signInResult = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      router.push('/dashboard');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(45deg, #0a1929 0%, #0f2846 100%)' }}>
      <Container maxWidth="md" sx={{ pt: 15, pb: 8 }}>
        <Box sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          borderRadius: 4,
          p: 6,
          border: '1px solid rgba(77, 208, 225, 0.2)',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <HowToReg sx={{ 
              fontSize: 48, 
              color: '#4dd0e1', 
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(77, 208, 225, 0.3))'
            }} />
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 2,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Join us to start shipping globally
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#4dd0e1', mb: 2 }}>
                  Personal Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  variant="outlined"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>

              {/* Company Information */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ color: '#4dd0e1', mb: 2 }}>
                  Company Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  variant="outlined"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  variant="outlined"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Address"
                  name="companyAddress"
                  variant="outlined"
                  required
                  multiline
                  rows={2}
                  value={formData.companyAddress}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  variant="outlined"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  variant="outlined"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  variant="outlined"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 2,
                    mt: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(77, 208, 225, 0.3)'
                    }
                  }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  Already have an account?{' '}
                  <Link href="/login" style={{ textDecoration: 'none' }}>
                    <Box component="span" sx={{ color: '#4dd0e1', cursor: 'pointer' }}>
                      Sign In
                    </Box>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
