import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import type { ProfileData } from '@/types/profile';

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState<boolean>(true);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: session?.user?.email || '',
    companyName: '',
    phoneNumber: '',
    companyAddress: '',
    city: '',
    country: '',
    postalCode: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile.ts');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfileData({
          name: data.name || '',
          email: data.email || session?.user?.email || '',
          companyName: data.companyName || '',
          phoneNumber: data.phoneNumber || '',
          companyAddress: data.companyAddress || '',
          city: data.city || '',
          country: data.country || '',
          postalCode: data.postalCode || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Failed to load profile data');
        setSeverity('error');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchUserData();
    }
  }, [session?.user?.email, setLoading, setMessage, setSeverity]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          email: session?.user?.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      setSeverity('success');
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to update profile');
      setSeverity('error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(45deg, #0a1929 0%, #0f2846 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" sx={{ color: '#4dd0e1' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(45deg, #0a1929 0%, #0f2846 100%)',
      pt: 8,
      pb: 8
    }}>
      <Container maxWidth="md">
        <Paper sx={{
          p: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(77, 208, 225, 0.2)',
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4,
              color: '#4dd0e1',
              fontWeight: 700
            }}
          >
            Profile Settings
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
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
                  value={profileData.email}
                  disabled
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  required
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
                  label="Company Name"
                  name="companyName"
                  value={profileData.companyName || ''}
                  onChange={handleChange}
                  required
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
                  value={profileData.companyAddress}
                  onChange={handleChange}
                  required
                  multiline
                  rows={2}
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
                  value={profileData.city}
                  onChange={handleChange}
                  required
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
                  value={profileData.country}
                  onChange={handleChange}
                  required
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
                  value={profileData.postalCode}
                  onChange={handleChange}
                  required
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
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                sx={{
                  borderColor: '#4dd0e1',
                  color: '#4dd0e1',
                  '&:hover': {
                    borderColor: '#26c6da'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(77, 208, 225, 0.3)'
                  }
                }}
              >
                Save Changes
              </Button>
            </Box>
          </form>
        </Paper>

        <Snackbar
          open={!!message}
          autoHideDuration={6000}
          onClose={() => setMessage('')}
        >
          <Alert
            onClose={() => setMessage('')}
            severity={severity}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
} 