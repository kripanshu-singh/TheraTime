import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Chip, 
  AppBar, 
  Toolbar, 
  IconButton, 
  CircularProgress,
  Avatar,
  useTheme,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NoteIcon from '@mui/icons-material/Note';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const ContractorDashboard = ({ user, onLogout }) => {
  const theme = useTheme();
  const [hours, setHours] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/timesheets/user/${user.id}`);
      setTimesheets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChipProps = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Approved',
          icon: <CheckCircleIcon style={{ fontSize: 16 }} />,
          color: 'success',
          variant: 'filled'
        };
      case 'PENDING':
        return {
          label: 'Pending',
          icon: <PendingIcon style={{ fontSize: 16 }} />,
          color: 'warning',
          variant: 'filled'
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          icon: <CancelIcon style={{ fontSize: 16 }} />,
          color: 'error',
          variant: 'filled'
        };
      default:
        return {
          label: status,
          icon: null,
          color: 'default',
          variant: 'filled'
        };
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#F9FAFB', // Soft gray background
      pb: 8
    }}>
      {/* Clean White Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ height: 70 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img src="/thera-logo.png" alt="TheraTime Logo" style={{ height: 32, marginRight: 12 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: '-0.5px' }}>
              TheraTime
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Contractor
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: '1rem' }}>
              {user.name.charAt(0)}
            </Avatar>
            <IconButton
              onClick={onLogout}
              size="small"
              sx={{
                ml: 1,
                color: 'text.secondary',
                '&:hover': { color: 'error.main', bgcolor: 'error.50' }
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={6} justifyContent="center">
          {/* Left Column: Log Hours */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Log Time
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Record your daily work hours and notes.
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                }}
              >
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                        Date
                      </Typography>
                      <TextField
                        fullWidth
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        size="small"
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                        Hours Worked
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="e.g. 8.0"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        size="small"
                        InputProps={{
                          endAdornment: <Typography variant="caption" color="text.secondary">HRS</Typography>,
                          inputProps: { step: 0.5, max: 24 },
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                        Notes
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="What did you work on today?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        size="small"
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={submitting}
                      disableElevation
                      sx={{
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }}
                    >
                      {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit Entry'}
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Box>
          </Grid>

          {/* Right Column: Recent Submissions */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 days
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                <CircularProgress size={32} />
              </Box>
            ) : timesheets.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '1px dashed',
                  borderColor: 'grey.300',
                  bgcolor: 'grey.50'
                }}
              >
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  No timesheets found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Your submitted hours will appear here.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {timesheets.map((t) => {
                  const chipProps = getStatusChipProps(t.status);
                  return (
                    <Paper
                      key={t.id}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={2}>
                          <Box sx={{
                            bgcolor: 'white',
                            border: '1px solid',
                            borderColor: 'grey.200',
                            borderRadius: 2,
                            p: 1,
                            textAlign: 'center'
                          }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
                              {t.hours}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', display: 'block', mt: 0.5 }}>
                              HOURS
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={7}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {new Date(t.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                            {t.notes || <span style={{ fontStyle: 'italic', opacity: 0.7 }}>No notes provided</span>}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={3} sx={{ textAlign: { sm: 'right' } }}>
                          <Chip 
                            icon={chipProps.icon}
                            label={chipProps.label}
                            color={chipProps.color}
                            variant={chipProps.variant}
                            size="small"
                            sx={{ 
                              fontWeight: 600,
                              borderRadius: 1.5,
                              height: 28,
                              '& .MuiChip-icon': {
                                color: 'inherit',
                                marginLeft: '8px'
                              }
                            }} 
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContractorDashboard;
