import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

const AdminSignupPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const response = await fetch('/api/admin_auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                // Optionally redirect to login after a delay
                setTimeout(() => {
                    router.push('/admin');
                }, 2000);
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err: any) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(45deg, #0a1929 0%, #0f2846 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography variant="h4" gutterBottom>
                Admin Signup
            </Typography>
            {message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box component="form" onSubmit={handleSignup} sx={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                />
                <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </Button>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={() => router.push('/admin')}>
                    Back to Login
                </Button>
            </Box>
        </Box>
    );
};

export default AdminSignupPage; 