import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
    Thermostat, Opacity, VpnKey, Sensors,
    Report, NotificationsActive
} from '@mui/icons-material';

const getIcon = (title) => {
    switch (title) {
        case 'Vibration':
            return <Report fontSize="large" />;
        case 'Motion (PIR)':
            return <Sensors fontSize="large" />;
        case 'LDR Sensor':
            return <Opacity fontSize="large" />;
        case 'Reed Switch':
            return <VpnKey fontSize="large" />;
        case 'Temperature':
            return <Thermostat fontSize="large" />;
        default:
            return <NotificationsActive fontSize="large" />;
    }
}

const SensorCard = ({ title, value, isWarning = false }) => {
  const theme = useTheme();

  const getValueColor = () => {
    if (title === 'Vibration' && value === 'DETECTED') {
      return theme.palette.error.main;
    }
    if (title === 'Reed Switch' && value === 'Open') {
        return theme.palette.warning.main;
    }
    if (isWarning) {
        return theme.palette.warning.main;
    }
    return theme.palette.text.primary;
  };

  const getIconColor = () => {
      if (isWarning) {
          return theme.palette.warning.main;
      }
      return 'text.secondary';
  }

  return (
    <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out',
        backgroundColor: isWarning ? 'rgba(255, 167, 38, 0.2)' : 'inherit',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 0 20px ${isWarning ? theme.palette.warning.main : theme.palette.primary.main}`,
        }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, color: getIconColor() }}>
            {getIcon(title)}
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              {title}
            </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: getValueColor() }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
