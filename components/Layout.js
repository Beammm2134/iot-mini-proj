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

// A more professional and refined dark theme
const professionalDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b0ff', // A brighter, more vibrant blue
    },
    secondary: {
      main: '#ff4081', // A vibrant pink for contrast
    },
    background: {
      default: '#0a1929', // A deep navy blue instead of black
      paper: 'rgba(17, 34, 51, 0.75)', // A semi-transparent paper color for cards
    },
    success: {
      main: '#66bb6a',
    },
    warning: {
      main: '#ffa726', // An amber/orange for warnings
    },
    error: {
        main: '#f44336',
    },
    text: {
        primary: '#e0e0e0',
        secondary: '#b0bec5',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
        fontWeight: 700,
        fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 25, 41, 0.7)', // Semi-transparent app bar
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(135, 206, 250, 0.12)',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                border: '1px solid rgba(135, 206, 250, 0.12)',
                borderRadius: '12px', // Softer corners
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }
        }
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '8px',
            }
        }
    }
  }
});

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={professionalDarkTheme}>
      <CssBaseline />
      {/* Adding a global style for the body background */}
      <style jsx global>{`
        body {
          background: linear-gradient(180deg, #0a1929 0%, #172a45 100%);
          background-attachment: fixed;
        }
      `}</style>
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
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
