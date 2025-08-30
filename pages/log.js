import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Grid
} from '@mui/material';

const LogTable = ({ title, headers, data, keyField = 'timestamp' }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h5" gutterBottom>{title}</Typography>
    <TableContainer component={Paper} sx={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}>
      <Table sx={{ minWidth: 650 }} aria-label={`${title} table`}>
        <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header.key} align={header.align || 'left'} sx={{ fontWeight: 'bold' }}>{header.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? data.map((row) => (
            <TableRow
                key={row[keyField]}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}
            >
              {headers.map((header) => (
                <TableCell key={`${row[keyField]}-${header.key}`} align={header.align || 'left'}>
                  {header.key === 'timestamp' || header.key === 'created_at' ? new Date(row[header.key]).toLocaleString() : row[header.key]}
                </TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={headers.length} align="center">No data available.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);


const SensorLogPage = () => {
  const [logs, setLogs] = useState({ sensor: [], vibration: [], gpio: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllLogs = async () => {
      setLoading(true);
      try {
        const [sensorRes, vibrationRes, gpioRes] = await Promise.all([
          supabase.from('sensor_data').select('*').order('timestamp', { ascending: false }).limit(10),
          supabase.from('vibration_data').select('*').order('timestamp', { ascending: false }).limit(10),
          supabase.from('gpio_sensor_data').select('*').order('timestamp', { ascending: false }).limit(10)
        ]);

        if (sensorRes.error) throw new Error(`Sensor Data Error: ${sensorRes.error.message}`);
        if (vibrationRes.error) throw new Error(`Vibration Data Error: ${vibrationRes.error.message}`);
        if (gpioRes.error) throw new Error(`GPIO Data Error: ${gpioRes.error.message}`);

        setLogs({
          sensor: sensorRes.data,
          vibration: vibrationRes.data,
          gpio: gpioRes.data
        });
        setError(null);

      } catch (err) {
        console.error("Error fetching logs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLogs();
  }, []);

  const sensorHeaders = [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'ldr_value', label: 'LDR', align: 'right' },
    { key: 'reed_switch', label: 'Reed', align: 'right' },
    { key: 'temperature', label: 'Temp (°C)', align: 'right' },
    { key: 'accel_x', label: 'Accel X', align: 'right' },
    { key: 'accel_y', label: 'Accel Y', align: 'right' },
    { key: 'accel_z', label: 'Accel Z', align: 'right' },
    { key: 'gyro_x', label: 'Gyro X', align: 'right' },
    { key: 'gyro_y', label: 'Gyro Y', align: 'right' },
    { key: 'gyro_z', label: 'Gyro Z', align: 'right' },
  ];

  const vibrationHeaders = [
      { key: 'timestamp', label: 'Timestamp' },
      { key: 'value', label: 'Value', align: 'right' },
  ];

  const gpioHeaders = [
      { key: 'timestamp', label: 'Timestamp' },
      { key: 'sensor_type', label: 'Sensor Type' },
      { key: 'value', label: 'Value', align: 'right' },
  ];

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Sensor Data Logs (Last 10 Records Each)
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <LogTable title="Analog Sensor Data" headers={sensorHeaders} data={logs.sensor} keyField="id" />
            </Grid>
            <Grid item xs={12}>
                <LogTable title="Vibration (Hit) Sensor Data" headers={vibrationHeaders} data={logs.vibration} />
            </Grid>
            <Grid item xs={12}>
                <LogTable title="GPIO Sensor Data (PIR)" headers={gpioHeaders} data={logs.gpio} keyField="id" />
            </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default SensorLogPage;
