import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
    Thermostat, Opacity, VpnKey, Sensors,
    Report, NotificationsActive
} from '@mui/icons-material';

const getIcon = (title) => {
    switch (title) {
        case 'Hit Sensor':
            return <Report fontSize="large" />;
        case 'PIR Sensor':
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

const SensorCard = ({ title, value }) => {
  const theme = useTheme();

  // Determine color based on value and title
  const getValueColor = () => {
    if (title === 'Hit Sensor' && value === 'HIT!') {
      return theme.palette.error.main;
    }
    if (title === 'Reed Switch' && value === 'Open') {
        return theme.palette.warning.main;
    }
    return theme.palette.text.primary;
  };

  return (
    <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 0 20px ${theme.palette.primary.main}`,
        }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, color: 'text.secondary' }}>
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
