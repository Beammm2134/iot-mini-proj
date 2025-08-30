import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    Thermostat, AcUnit, Opacity, VpnKey, Sensors,
    Report, NotificationsActive, LockOpen, Lock, Warning
} from '@mui/icons-material';


const getIcon = (title) => {
    switch (title) {
        case 'Hit Sensor':
            return <Report fontSize="large" color="error" />;
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
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'background.paper' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            {getIcon(title)}
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
            </Typography>
        </Box>
        <Typography variant="h3" component="div" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
