import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  TextField, 
  Grid, 
  Link 
} from '@mui/material';
import { Lock, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (result?.error) {
      alert(result.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(45deg, #0a1929 0%, #0f2846 100%)' }}>
      <Container maxWidth="sm" sx={{ pt: 15 }}>
        <Box sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          borderRadius: 4,
          p: 6,
          border: '1px solid rgba(77, 208, 225, 0.2)',
          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Lock sx={{ 
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
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Sign in to access your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#90caf9' } }}
                  InputProps={{
                    sx: {
                      color: 'text.primary',
                      '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.3)' },
                      '&:hover fieldset': { borderColor: '#4dd0e1' }
                    }
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(77, 208, 225, 0.3)'
                    }
                  }}
                  type="submit"
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  Dont have an account?{' '}
                  <Link href="/signup" sx={{ color: '#4dd0e1', textDecoration: 'none' }}>
                    Sign Up
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
