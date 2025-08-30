import { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';

const CORRECT_PASSWORD = 'iloveiot';

const LockControl = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [lockStatus, setLockStatus] = useState('Locked');

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

  const handleLock = () => {
    setLockStatus('Locked');
    // Here you would typically make an API call to the safe
  };

  const handleUnlock = () => {
    setLockStatus('Unlocked');
    // Here you would typically make an API call to the safe
  };

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
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Lock />}
              onClick={handleLock}
              disabled={lockStatus === 'Locked'}
            >
              Lock
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LockOpen />}
              onClick={handleUnlock}
              disabled={lockStatus === 'Unlocked'}
            >
              Unlock
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LockControl;
