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
      main: '#00b0ff',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#0a1929',
      paper: 'rgba(17, 34, 51, 0.5)', // Adjusted for glassmorphism
    },
    success: {
      main: '#66bb6a',
    },
    warning: {
      main: '#ffa726',
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
          backgroundColor: 'rgba(10, 25, 41, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(135, 206, 250, 0.12)',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(17, 34, 51, 0.5)',
                backdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(135, 206, 250, 0.2)',
                borderRadius: '12px',
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
