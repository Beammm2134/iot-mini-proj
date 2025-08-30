import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';


const WarningLog = ({ log }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <WarningAmber color="warning" />
            <Typography variant="h5" gutterBottom component="div" sx={{ mb: 0, ml: 1 }}>
                Warning Log
            </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Table sx={{ minWidth: 650 }} aria-label="warning log table">
            <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Event Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {log.length > 0 ? (
                log.map((entry, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}
                  >
                    <TableCell>{entry.timestamp}</TableCell>
                    <TableCell sx={{ color: 'warning.main' }}>{entry.message}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No warnings to display. System is clear.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default WarningLog;
