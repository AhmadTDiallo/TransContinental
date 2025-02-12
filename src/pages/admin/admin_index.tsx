import React, { useState } from 'react';
import { Box, Button, Container, Typography, TextField, Grid } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

const AdminIndex = () => {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });
    setLoading(false);
    if (result?.error) {
      alert(result.error);
    } else {
      router.push('/admin/admin_dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(10, 25, 41, 0.9), rgba(10, 25, 41, 0.9)), url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        pt: 8
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Admin Login
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Welcome back – please sign in to your admin account
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(77, 208, 225, 0.3)'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{ sx: { color: '#90caf9' } }}
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
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ sx: { color: '#90caf9' } }}
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
                type="submit"
                disabled={loading}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(77, 208, 225, 0.3)'
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminIndex; 