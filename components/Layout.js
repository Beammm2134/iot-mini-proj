import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button
} from '@mui/material';
import Link from 'next/link';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    success: {
        main: '#66bb6a',
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
    },
    h4: {
        fontWeight: 600,
    }
  }
});

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Safe Dashboard
          </Typography>
          <Box>
            <Link href="/" passHref>
              <Button color="inherit">Dashboard</Button>
            </Link>
            <Link href="/log" passHref>
              <Button color="inherit">Sensor Log</Button>
            </Link>
          </Box>
          <Typography variant="body2" sx={{ ml: 4 }}>
            Project Owner: Doikham Strawberry Flavor
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
