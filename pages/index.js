import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Typography,
  Grid,
  CircularProgress,
  Box
} from '@mui/material';
import { motion } from 'framer-motion';

import Layout from '../components/Layout';
import SensorCard from '../components/SensorCard';
import LockControl from '../components/LockControl';
import WarningLog from '../components/WarningLog';
import MPU6050Status from '../components/MPU6050Status';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  const [sensorData, setSensorData] = useState(null);
  const [warningLog, setWarningLog] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mpu6050Safe, setMpu6050Safe] = useState(true);

  const checkMpu6050Status = (data) => {
    if (!data || data.accel_x === undefined) return true;
    const baseAccelX = -2.32;
    const baseAccelY = 0.45;
    const baseAccelZ = -9.22;
    const tolerance = 25.0;

    if (
      Math.abs(data.accel_x - baseAccelX) > tolerance ||
      Math.abs(data.accel_y - baseAccelY) > tolerance ||
      Math.abs(data.accel_z - baseAccelZ) > tolerance
    ) {
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single(); // Fetch a single object

      if (error) {
        throw error;
      }

      setSensorData(data);

      // Check for critical events
      const newWarnings = [];
      const eventTimestamp = new Date(data.timestamp).toLocaleString();

      if (data.vibration_detected === 1) {
        const message = 'Critical Alert: Hit detected!'; // Updated message
        if (!warningLog.some(w => w.message === message && w.timestamp === eventTimestamp)) {
            newWarnings.push({ timestamp: eventTimestamp, message });
        }
      }

      const isMpuSafe = checkMpu6050Status(data);
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
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [warningLog]);


  return (
    <Layout>
        {error && <Typography color="error" gutterBottom>{error}</Typography>}
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        ) : sensorData ? (
          <Grid
            container
            spacing={3}
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Sensor Data */}
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
              <SensorCard title="Hit Sensor" value={sensorData.vibration_detected === 1 ? 'DETECTED' : 'OK'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
              <SensorCard
                title="Motion (PIR)"
                value={sensorData.motion_detected === 1 ? 'Motion' : 'No Motion'}
                isWarning={sensorData.motion_detected === 1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
              <SensorCard title="Reed Switch" value={sensorData.reed_switch < 1300 ? 'Closed' : 'Opened'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
                <SensorCard title="Temperature" value={`${sensorData.temperature ?? 'N/A'}°C`} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
                <MPU6050Status isSafe={mpu6050Safe} />
            </Grid>

            {/* Lock Control */}
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
              <LockControl />
            </Grid>

            {/* Warning Log */}
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
              <WarningLog log={warningLog} />
            </Grid>
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
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
