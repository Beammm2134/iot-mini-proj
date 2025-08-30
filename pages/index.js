import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Typography,
  Grid,
} from '@mui/material';

import Layout from '../components/Layout';
import SensorCard from '../components/SensorCard';
import MPU6050Status from '../components/MPU6050Status';
import LockControl from '../components/LockControl';
import WarningLog from '../components/WarningLog';

export default function Home() {
  const [sensorData, setSensorData] = useState(null);
  const [warningLog, setWarningLog] = useState([]);
  const [error, setError] = useState(null);
  const [mpu6050Safe, setMpu6050Safe] = useState(true);

  const LDR_THRESHOLD = 500; // Example threshold, adjust as needed

  const checkMpu6050Status = (data) => {
    // Baseline from mock data, with some tolerance
    const baseAccelX = -2.32;
    const baseAccelY = 0.45;
    const baseAccelZ = -9.22;
    const tolerance = 1.0; // Adjust as needed

    if (
      Math.abs(data.accel_x - baseAccelX) > tolerance ||
      Math.abs(data.accel_y - baseAccelY) > tolerance ||
      Math.abs(data.accel_z - baseAccelZ) > tolerance
    ) {
      return false; // Unsafe
    }
    return true; // Safe
  };


  const fetchData = async () => {
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      return;
    }

    if (data && data.length > 0) {
      const latestData = data[0];
      setSensorData(latestData);

      // Check for critical events
      const newWarnings = [];
      const eventTimestamp = new Date(latestData.timestamp).toLocaleString();

      if (latestData.hit === 1) {
        const message = 'Critical Alert: Hit detected!';
        // Avoid duplicate log entries for the same timestamp
        if (!warningLog.some(w => w.message === message && w.timestamp === eventTimestamp)) {
            newWarnings.push({ timestamp: eventTimestamp, message });
        }
      }

      if (latestData.ldr > LDR_THRESHOLD) {
        const message = `Critical Alert: LDR threshold exceeded (${latestData.ldr})!`;
         if (!warningLog.some(w => w.message === message && w.timestamp === eventTimestamp)) {
            newWarnings.push({ timestamp: eventTimestamp, message });
        }
      }

      const isMpuSafe = checkMpu6050Status(latestData);
      if (!isMpuSafe) {
        const message = 'Critical Alert: Safe is being moved!';
        if (!warningLog.some(w => w.message === message && w.timestamp === eventTimestamp)) {
            newWarnings.push({ timestamp: eventTimestamp, message });
        }
      }
      setMpu6050Safe(isMpuSafe);


      if (newWarnings.length > 0) {
        setWarningLog(prevLog => [...newWarnings, ...prevLog]);
      }
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on initial load
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [warningLog]); // re-run effect if warningLog changes to avoid duplicates on fast refreshes

  return (
    <Layout>
        {error && <Typography color="error">{error}</Typography>}
        {sensorData ? (
          <Grid container spacing={3}>
            {/* Sensor Data */}
            <Grid item xs={12} sm={6} md={4}>
              <SensorCard title="Hit Sensor" value={sensorData.hit === 1 ? 'HIT!' : 'OK'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SensorCard title="PIR Sensor" value={sensorData.pir === 1 ? 'Motion' : 'No Motion'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SensorCard title="LDR Sensor" value={sensorData.ldr} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SensorCard title="Reed Switch" value={sensorData.reed === 1 ? 'Open' : 'Closed'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <SensorCard title="Temperature" value={`${sensorData.temp}°C`} />
            </Grid>
             <Grid item xs={12} sm={6} md={4}>
                <MPU6050Status isSafe={mpu6050Safe} />
            </Grid>

            {/* Lock Control */}
            <Grid item xs={12}>
              <LockControl />
            </Grid>

            {/* Warning Log */}
            <Grid item xs={12}>
              <WarningLog log={warningLog} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption" align="center" sx={{ display: 'block', mt: 2 }}>
                    Last updated: {new Date(sensorData.timestamp).toLocaleString()}
                </Typography>
            </Grid>
          </Grid>
        ) : (
          <Typography>Loading sensor data...</Typography>
        )}
    </Layout>
  );
}
