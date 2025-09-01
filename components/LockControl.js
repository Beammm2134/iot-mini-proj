import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Snackbar, Alert, Chip } from '@mui/material';
import { Lock, LockOpen, VpnKey } from '@mui/icons-material';

const CORRECT_PASSWORD = 'iloveiot';

// This function will send the notification without waiting for a response
const notifyPasswordAttempt = async (success, passwordAttempt) => {
    try {
        await fetch('/api/notify-password-attempt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ success, passwordAttempt }),
        });
        // We don't need to do anything with the response, just fire and forget.
    } catch (error) {
        // Also swallow errors on the client-side, but log them.
        console.error('Failed to send password attempt notification:', error);
    }
};

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
      notifyPasswordAttempt(true); // Notify on success
    } else {
      setError('Incorrect password. Please try again.');
      notifyPasswordAttempt(false, password); // Notify on failure with the attempted password
      setPassword('');
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
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Typography variant="h5" gutterBottom>
          Lock Control
        </Typography>
        {!isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <TextField
              type="password"
              label="Enter Password"
              variant="outlined"
              size="small"
              value={password}
              onChange={handlePasswordChange}
              error={!!error}
              helperText={error}
              fullWidth
            />
            <Button
                variant="contained"
                onClick={handlePasswordSubmit}
                startIcon={<VpnKey />}
                sx={{ height: '40px' }}
            >
              Unlock Access
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip
                icon={lockStatus === 'Locked' ? <Lock /> : <LockOpen />}
                label={`Status: ${lockStatus}`}
                color={lockStatus === 'Locked' ? 'default' : 'success'}
                variant="outlined"
                sx={{ fontSize: '1rem', p: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Lock />}
                    onClick={handleLock}
                    disabled={loading || lockStatus === 'Locked'}
                >
                    Lock
                </Button>
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
