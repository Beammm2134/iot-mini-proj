import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, MotionPhotosAuto } from '@mui/icons-material';

const MAX_DATA_POINTS = 20; // Number of data points to show on the chart

const MPU6050Chart = ({ latestData, isSafe }) => {
  const theme = useTheme();
  const [dataHistory, setDataHistory] = useState([]);

  useEffect(() => {
    if (latestData) {
      setDataHistory(prevHistory => {
        const newHistory = [...prevHistory, {
          name: new Date(latestData.timestamp).toLocaleTimeString(),
          accel_x: latestData.accel_x,
          accel_y: latestData.accel_y,
          accel_z: latestData.accel_z,
        }];
        // Keep the history at a fixed length
        if (newHistory.length > MAX_DATA_POINTS) {
          return newHistory.slice(newHistory.length - MAX_DATA_POINTS);
        }
        return newHistory;
      });
    }
  }, [latestData]); // This effect runs every time new data arrives

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">MPU6050 Real-time Data</Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isSafe ? theme.palette.success.main : theme.palette.error.main
                }}
            >
                {isSafe ? <Shield /> : <MotionPhotosAuto />}
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {isSafe ? 'Safe' : 'Unsafe'}
                </Typography>
            </Box>
        </Box>
        <Box sx={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={dataHistory}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.text.secondary} strokeOpacity={0.2} />
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary}/>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.primary.main}`
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="accel_x" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="accel_y" stroke={theme.palette.secondary.main} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="accel_z" stroke={theme.palette.success.main} strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MPU6050Chart;
