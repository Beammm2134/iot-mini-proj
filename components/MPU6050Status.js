import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { Shield, MotionPhotosAuto } from '@mui/icons-material';

const MPU6050Status = ({ isSafe }) => {
  const theme = useTheme();
  return (
    <Card sx={{
        height: '100%',
        backgroundColor: isSafe ? 'rgba(102, 187, 106, 0.2)' : 'rgba(244, 67, 54, 0.2)', // Use transparent success/error colors
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 0 20px ${isSafe ? theme.palette.success.main : theme.palette.error.main}`,
        }
    }}>
      <CardContent>
        {isSafe ? <Shield sx={{ fontSize: 40, mb:1, color: theme.palette.success.main }} /> : <MotionPhotosAuto sx={{ fontSize: 40, mb:1, color: theme.palette.error.main }} />}
        <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
          MPU6050 Status
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: isSafe ? theme.palette.success.main : theme.palette.error.main }}>
          {isSafe ? 'Safe' : 'Unsafe'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MPU6050Status;
