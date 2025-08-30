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
  Box
} from '@mui/material';

const SensorLogPage = () => {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching log data:', error);
        setError('Failed to fetch sensor log data.');
      } else {
        setLogData(data);
      }
      setLoading(false);
    };

    fetchLogData();
  }, []);

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Sensor Data Log (Last 10 Records)
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="sensor data log table">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell align="right">Hit</TableCell>
                <TableCell align="right">PIR</TableCell>
                <TableCell align="right">LDR</TableCell>
                <TableCell align="right">Reed</TableCell>
                <TableCell align="right">Temp (°C)</TableCell>
                <TableCell align="right">Accel X</TableCell>
                <TableCell align="right">Accel Y</TableCell>
                <TableCell align="right">Accel Z</TableCell>
                <TableCell align="right">Gyro X</TableCell>
                <TableCell align="right">Gyro Y</TableCell>
                <TableCell align="right">Gyro Z</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logData.map((row) => (
                <TableRow key={row.timestamp}>
                  <TableCell component="th" scope="row">
                    {new Date(row.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{row.hit}</TableCell>
                  <TableCell align="right">{row.pir}</TableCell>
                  <TableCell align="right">{row.ldr}</TableCell>
                  <TableCell align="right">{row.reed}</TableCell>
                  <TableCell align="right">{row.temp}</TableCell>
                  <TableCell align="right">{row.accel_x}</TableCell>
                  <TableCell align="right">{row.accel_y}</TableCell>
                  <TableCell align="right">{row.accel_z}</TableCell>
                  <TableCell align="right">{row.gyro_x}</TableCell>
                  <TableCell align="right">{row.gyro_y}</TableCell>
                  <TableCell align="right">{row.gyro_z}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
};

export default SensorLogPage;
