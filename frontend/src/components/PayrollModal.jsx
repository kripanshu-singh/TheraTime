import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const PayrollModal = ({ open, onClose, payload }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Payroll Payload Generated</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Ready for export to Thera Financial OS.
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontSize: '0.85rem', fontFamily: 'monospace' }}>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
          alert('Copied to clipboard!');
        }}>
          Copy to Clipboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollModal;
