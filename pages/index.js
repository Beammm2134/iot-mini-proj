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
import MPU6050Chart from '../components/MPU6050Chart'; // Import the new chart

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

  const LDR_THRESHOLD = 500;

  const checkMpu6050Status = (data) => {
    if (!data || data.accel_x === undefined) return true;
    const baseAccelX = -2.32;
    const baseAccelY = 0.45;
    const baseAccelZ = -9.22;
    const tolerance = 1.0;

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
      const [sensorResult, vibrationResult, pirResult] = await Promise.all([
        supabase.from('sensor_data').select('*').order('timestamp', { ascending: false }).limit(1).single(),
        supabase.from('vibration_data').select('*').order('timestamp', { ascending: false }).limit(1).single(),
        supabase.from('gpio_sensor_data').select('*').eq('sensor_type', 'PIR').order('timestamp', { ascending: false }).limit(1).single()
      ]);

      const combinedData = {
        ...(sensorResult.data || {}),
        hit: vibrationResult.data?.value,
        pir: pirResult.data?.value,
        timestamp: sensorResult.data?.timestamp || new Date().toISOString(),
      };

      setSensorData(combinedData);

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
              <SensorCard title="Hit Sensor" value={sensorData.hit === 1 ? 'HIT!' : 'OK'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
              <SensorCard title="PIR Sensor" value={sensorData.pir === 1 ? 'Motion' : 'No Motion'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
              <SensorCard title="LDR Sensor" value={sensorData.ldr_value ?? 'N/A'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
              <SensorCard title="Reed Switch" value={sensorData.reed_switch === 1 ? 'Open' : 'Closed'} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4} component={motion.div} variants={itemVariants}>
                <SensorCard title="Temperature" value={`${sensorData.temperature ?? 'N/A'}°C`} />
            </Grid>

            {/* MPU6050 Chart */}
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
                <MPU6050Chart latestData={sensorData} isSafe={mpu6050Safe} />
            </Grid>

            {/* Lock Control */}
            <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
              <LockControl />
            </Grid>

            {/* Warning Log */}
            <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
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
