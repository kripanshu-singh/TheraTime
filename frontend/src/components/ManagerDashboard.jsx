import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, Button, AppBar, Toolbar, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import PayrollModal from './PayrollModal';

const ManagerDashboard = ({ user, onLogout }) => {
  const [pending, setPending] = useState([]);
  const [payload, setPayload] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPending = async () => {
    try {
      const res = await axios.get('http://localhost:8082/api/timesheets/pending');
      setPending(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8082/api/timesheets/approve/${id}`);
      fetchPending();
    } catch (err) {
      alert('Error approving timesheet');
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      const res = await axios.get('http://localhost:8082/api/payroll/generate');
      setPayload(res.data);
      setModalOpen(true);
    } catch (err) {
      alert('Error generating payroll');
    }
  };

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src="/thera-logo.png" alt="TheraTime Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography variant="h6" color="primary">TheraTime Manager</Typography>
          </Box>
          <Typography variant="body2" sx={{ mr: 2 }}>{user.name}</Typography>
          <IconButton onClick={onLogout}><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Pending Approvals</Typography>
          <Button variant="contained" color="primary" onClick={handleGeneratePayroll}>
            Generate Payroll Payload
          </Button>
        </Box>

        <TableContainer component={Card}>
          <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No pending timesheets</TableCell>
                </TableRow>
              ) : (
                pending.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.user?.name || 'Unknown'}</TableCell>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.hours}</TableCell>
                    <TableCell>{t.notes}</TableCell>
                    <TableCell><Chip label={t.status} color="warning" size="small" /></TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="contained" onClick={() => handleApprove(t.id)}>
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <PayrollModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        payload={payload} 
      />
    </Box>
  );
};

export default ManagerDashboard;
