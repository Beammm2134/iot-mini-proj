import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';

const CORRECT_PASSWORD = 'iloveiot';

const LockControl = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [lockStatus, setLockStatus] = useState('Locked');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError('');
  };

  const handlePasswordSubmit = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleApiCall = async (endpoint, successStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/${endpoint}`, { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
      }

      setLockStatus(successStatus);
      setSnackbar({ open: true, message: `Safe successfully ${successStatus.toLowerCase()}!`, severity: 'success' });

    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLock = () => handleApiCall('lock', 'Locked');
  const handleUnlock = () => handleApiCall('unlock', 'Unlocked');


  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Lock Control
        </Typography>
        {!isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="password"
              label="Enter Password"
              variant="outlined"
              size="small"
              value={password}
              onChange={handlePasswordChange}
              error={!!error}
              helperText={error}
            />
            <Button variant="contained" onClick={handlePasswordSubmit}>
              Submit
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Typography variant="h6">
              Status: <strong>{lockStatus}</strong>
            </Typography>
            <Box sx={{ position: 'relative' }}>
                <Button
                variant="contained"
                color="secondary"
                startIcon={<Lock />}
                onClick={handleLock}
                disabled={loading || lockStatus === 'Locked'}
                >
                Lock
                </Button>
                {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                    color: 'secondary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                    }}
                />
                )}
            </Box>
            <Box sx={{ position: 'relative' }}>
                <Button
                variant="contained"
                color="primary"
                startIcon={<LockOpen />}
                onClick={handleUnlock}
                disabled={loading || lockStatus === 'Unlocked'}
                >
                Unlock
                </Button>
                {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                    color: 'primary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                    }}
                />
                )}
            </Box>
          </Box>
        )}
      </CardContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default LockControl;
