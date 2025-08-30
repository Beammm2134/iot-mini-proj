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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="warning log table">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Event Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {log.length > 0 ? (
                log.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.timestamp}</TableCell>
                    <TableCell>{entry.message}</TableCell>
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
