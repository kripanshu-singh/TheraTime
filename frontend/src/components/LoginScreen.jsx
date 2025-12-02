import React from 'react';
import { Box, Button, Card, Typography, Container, Stack } from '@mui/material';
import axios from 'axios';

const LoginScreen = ({ setUser }) => {
  const handleLogin = async (email) => {
    try {
      const response = await axios.post('http://localhost:8082/api/auth/login', { email });
      setUser(response.data);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Ensure backend is running.');
    }
  };

  return (
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
          >
            Login as Contractor (Kripanshu)
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            onClick={() => handleLogin('akhil@getthera.com')}
          >
            Login as Manager (Akhil)
          </Button>
        </Stack>
      </Card>
    </Container>
  );
};

export default LoginScreen;
