import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import LoginScreen from './components/LoginScreen';
import ContractorDashboard from './components/ContractorDashboard';
import ManagerDashboard from './components/ManagerDashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Routes>
            <Route path="/" element={!user ? <LoginScreen setUser={setUser} /> : <Navigate to={user.role === 'CONTRACTOR' ? '/contractor' : '/manager'} />} />
            <Route path="/contractor" element={user && user.role === 'CONTRACTOR' ? <ContractorDashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" />} />
            <Route path="/manager" element={user && user.role === 'MANAGER' ? <ManagerDashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
