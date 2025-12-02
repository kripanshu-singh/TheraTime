import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, Button, AppBar, Toolbar, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import InboxIcon from '@mui/icons-material/Inbox';
import axios from 'axios';
import PayrollModal from './PayrollModal';

const ManagerDashboard = ({ user, onLogout }) => {
  const [pending, setPending] = useState([]);
  const [payload, setPayload] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/timesheets/pending`);
      setPending(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/timesheets/approve/${id}`);
      fetchPending();
    } catch (err) {
      alert('Error approving timesheet');
    } finally {
      setProcessingId(null);
    }
  };

  const handleGeneratePayroll = async () => {
    setGenerating(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/payroll/generate`);
      setPayload(res.data);
      setModalOpen(true);
    } catch (err) {
      alert('Error generating payroll');
    } finally {
      setGenerating(false);
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
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGeneratePayroll}
            disabled={generating}
            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {generating ? 'Generating...' : 'Generate Payroll Payload'}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : pending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
                      <InboxIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                        No pending timesheets
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        All caught up! New submissions will appear here.
                      </Typography>
                    </Box>
                  </TableCell>
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
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleApprove(t.id)}
                        disabled={processingId === t.id}
                        startIcon={processingId === t.id ? <CircularProgress size={16} color="inherit" /> : null}
                      >
                        {processingId === t.id ? 'Approving...' : 'Approve'}
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
