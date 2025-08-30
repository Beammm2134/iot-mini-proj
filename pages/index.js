import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Typography,
  Grid,
  CircularProgress,
  Box
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
  const [loading, setLoading] = useState(true);
  const [mpu6050Safe, setMpu6050Safe] = useState(true);

  const LDR_THRESHOLD = 500; // Example threshold, adjust as needed

  const checkMpu6050Status = (data) => {
    if (!data || data.accel_x === undefined) return true; // Not enough data to determine
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
    try {
      // Fetch the latest row from each table concurrently
      const [sensorResult, vibrationResult, pirResult] = await Promise.all([
        supabase.from('sensor_data').select('*').order('timestamp', { ascending: false }).limit(1).single(),
        supabase.from('vibration_data').select('*').order('timestamp', { ascending: false }).limit(1).single(),
        supabase.from('gpio_sensor_data').select('*').eq('sensor_type', 'PIR').order('timestamp', { ascending: false }).limit(1).single()
      ]);

      // Combine the results. Handle cases where a table might not have data.
      const combinedData = {
        ...(sensorResult.data || {}),
        hit: vibrationResult.data?.value,
        pir: pirResult.data?.value,
        // Use the main sensor_data timestamp as the primary one for display
        timestamp: sensorResult.data?.timestamp || new Date().toISOString(),
      };

      setSensorData(combinedData);

      // Check for critical events
      const newWarnings = [];
      const eventTimestamp = new Date(combinedData.timestamp).toLocaleString();

      if (combinedData.hit === 1) {
        const message = 'Critical Alert: Hit detected!';
        if (!warningLog.some(w => w.message === message && w.timestamp === eventTimestamp)) {
            newWarnings.push({ timestamp: eventTimestamp, message });
        }
      }

      if (combinedData.ldr_value > LDR_THRESHOLD) {
        const message = `Critical Alert: LDR threshold exceeded (${combinedData.ldr_value})!`;
         if (!warningLog.some(w => w.message === message && w.timestamp === eventTimestamp)) {
            newWarnings.push({ timestamp: eventTimestamp, message });
        }
      }

      const isMpuSafe = checkMpu6050Status(combinedData);
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
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch sensor data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on initial load
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [warningLog]); // re-run effect if warningLog changes to avoid duplicates on fast refreshes

  return (
    <Layout>
        {error && <Typography color="error" gutterBottom>{error}</Typography>}
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        ) : sensorData ? (
          <Grid container spacing={3}>
            {/* Sensor Data */}
            <Grid item xs={12} sm={6} md={4}>
              <SensorCard title="Hit Sensor" value={sensorData.hit === 1 ? 'HIT!' : 'OK'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SensorCard title="PIR Sensor" value={sensorData.pir === 1 ? 'Motion' : 'No Motion'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SensorCard title="LDR Sensor" value={sensorData.ldr_value ?? 'N/A'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SensorCard title="Reed Switch" value={sensorData.reed_switch === 1 ? 'Open' : 'Closed'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <SensorCard title="Temperature" value={`${sensorData.temperature ?? 'N/A'}°C`} />
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
          <Typography>Could not load dashboard data.</Typography>
        )}
    </Layout>
  );
}
