import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { Shield, MotionPhotosAuto } from '@mui/icons-material';

const MPU6050Status = ({ isSafe }) => {
  const theme = useTheme();
  return (
    <Card sx={{
        height: '100%',
        backgroundColor: isSafe ? theme.palette.success.dark : theme.palette.error.dark,
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
        {isSafe ? <Shield sx={{ fontSize: 40, mb:1 }} /> : <MotionPhotosAuto sx={{ fontSize: 40, mb:1 }} />}
        <Typography variant="h6" component="div">
          MPU6050 Status
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {isSafe ? 'Safe' : 'Unsafe'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MPU6050Status;
