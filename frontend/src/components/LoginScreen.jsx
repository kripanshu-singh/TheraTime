import React, { useState, useEffect } from 'react';
import { Box, Button, Card, Typography, Container, Stack, CircularProgress, Backdrop } from '@mui/material';
import axios from 'axios';

const LOADING_MESSAGES = [
  "Logging in...",
  "Wait, backend is on Free tier...",
  "Backend is waking up...",
  "Almost there...",
  "Just a moment longer..."
];

const LoginScreen = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      setMessageIndex(0);
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleLogin = async (email) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, { email });
      setUser(response.data);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column' }}
        open={loading}
      >
        <CircularProgress color="inherit" size={60} sx={{ mb: 4 }} />
        <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
          {LOADING_MESSAGES[messageIndex]}
        </Typography>
      </Backdrop>

      <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img src="/thera-logo.png" alt="TheraTime Logo" style={{ height: 60 }} />
          </Box>
          <Typography variant="h4" gutterBottom color="primary">
            TheraTime
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Select a role to continue
          </Typography>
          <Stack spacing={2}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => handleLogin('kripanshu@example.com')}
              disabled={loading}
            >
              Login as Contractor (Kripanshu)
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => handleLogin('akhil@getthera.com')}
              disabled={loading}
            >
              Login as Manager (Akhil)
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
};

export default LoginScreen;
