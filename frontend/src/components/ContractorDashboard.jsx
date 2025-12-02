import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, TextField, Button, Grid, Chip, AppBar, Toolbar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

const ContractorDashboard = ({ user, onLogout }) => {
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [timesheets, setTimesheets] = useState([]);

  const fetchTimesheets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/timesheets/user/${user.id}`);
      setTimesheets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/timesheets/submit/${user.id}`, {
        date,
        hours: parseFloat(hours),
        notes
      });
      setHours('');
      setNotes('');
      fetchTimesheets();
    } catch (err) {
      alert('Error submitting timesheet: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src="/thera-logo.png" alt="TheraTime Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography variant="h6" color="primary">TheraTime</Typography>
          </Box>
          <Typography variant="body2" sx={{ mr: 2 }}>{user.name}</Typography>
          <IconButton onClick={onLogout}><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Log Hours</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Hours"
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.5, max: 24 }}
                />
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button fullWidth variant="contained" type="submit">Submit</Button>
              </form>
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>Recent Submissions</Typography>
            {timesheets.map((t) => (
              <Card key={t.id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1">{t.date}</Typography>
                  <Typography variant="body2" color="text.secondary">{t.hours} Hours • {t.notes}</Typography>
                </Box>
                <Chip 
                  label={t.status} 
                  color={t.status === 'APPROVED' ? 'success' : t.status === 'PENDING' ? 'warning' : 'error'} 
                  size="small" 
                />
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContractorDashboard;
