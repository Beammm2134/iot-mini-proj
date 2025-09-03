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
  const [hitStatus, setHitStatus] = useState('OK');

  const handleHitClick = () => {
    setHitStatus('DETECTED');
    setTimeout(() => {
      setHitStatus('OK');
    }, 2000);
  };

  const checkMpu6050Status = (data) => {
    if (data.accel_x === undefined || data.gyro_x === undefined) {
      // If data is missing, assume it's safe to not trigger false alarms
      return true;
    }

    const ax = data.accel_x;
    const ay = data.accel_y;
    const az = data.accel_z;
    const gx = data.gyro_x;
    const gy = data.gyro_y;
    const gz = data.gyro_z;

    const ACCEL_THRESHOLD = 0.8; // g
    const GYRO_THRESHOLD = 3.0;  // °/s

    // magnitude of accel
    const accelMag = Math.sqrt(ax * ax + ay * ay + az * az);
    const accelWithoutGravity = Math.abs(accelMag - 9.8);

    // magnitude of gyro
    const gyroMag = Math.sqrt(gx * gx + gy * gy + gz * gz);

    const isMoving = accelWithoutGravity > ACCEL_THRESHOLD || gyroMag > GYRO_THRESHOLD;

    return !isMoving; // Return true if safe (not moving), false if unsafe (moving)
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
              <SensorCard title="Hit Sensor" value={hitStatus} onClick={handleHitClick} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
              <SensorCard
                title="Motion (PIR)"
                value={sensorData.motion_detected === 1 ? 'Motion' : 'No Motion'}
                isWarning={sensorData.motion_detected === 1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
              <SensorCard title="Reed Switch" value={sensorData.reed_switch < 1500 ? 'Closed' : 'Opened'} />
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
