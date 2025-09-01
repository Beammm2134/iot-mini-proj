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

// This is a simplified version of the LogTable, as we only need one now.
const LogTable = ({ headers, data }) => (
    <TableContainer component={Paper} sx={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}>
      <Table sx={{ minWidth: 650 }} aria-label="Sensor Log Table">
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
                key={row.id} // Assuming 'id' is a unique key
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}
            >
              {headers.map((header) => (
                <TableCell key={`${row.id}-${header.key}`} align={header.align || 'left'}>
                  {header.key === 'timestamp' ? new Date(row[header.key]).toLocaleString() : row[header.key]}
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
);


const SensorLogPage = () => {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('sensor_data')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);

        if (error) throw error;

        setLogData(data);
        setError(null);

      } catch (err) {
        console.error("Error fetching log data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogData();
  }, []);

  const tableHeaders = [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'vibration_detected', label: 'Vibration', align: 'right' },
    { key: 'motion_detected', label: 'Motion', align: 'right' },
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
        <LogTable headers={tableHeaders} data={logData} />
      )}
    </Layout>
  );
};

export default SensorLogPage;
