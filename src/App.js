// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box, Container, Paper, Typography, CssBaseline } from '@mui/material';
import store from './store';
import Tabs from './components/Tabs';
import FileUpload from './components/FileUpload';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern blue
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#7c3aed', // Purple shade
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    }
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#1e293b',
    },
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: 'background.default',
            pt: 4,
            pb: 6,
          }}
        >
          <Container maxWidth="lg">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                align="center"
                sx={{
                  mb: 1,
                  background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Swipe Invoice Manager
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                Upload, manage, and analyze your invoices efficiently
              </Typography>
              <FileUpload />
            </Paper>
            
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
              }}
            >
              <Tabs />
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
