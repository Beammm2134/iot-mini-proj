import { Card, CardContent, Typography, Box } from '@mui/material';
import { Shield, MotionPhotosAuto } from '@mui/icons-material';

const MPU6050Status = ({ isSafe }) => {
  return (
    <Card sx={{
        height: '100%',
        backgroundColor: isSafe ? 'success.dark' : 'error.dark',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
      <CardContent sx={{ textAlign: 'center' }}>
        {isSafe ? <Shield sx={{ fontSize: 40 }} /> : <MotionPhotosAuto sx={{ fontSize: 40 }} />}
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
