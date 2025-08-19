import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import './App.css';
import './responsive.css';
import { GlobalStateProvider } from './contexts/GlobalStateContext';
import { appRoutes } from './Routes/MainRoutes';


function AppWrapper() {
  const element = useRoutes(appRoutes); 
  return element;
}

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                textAlign: 'center',
                bgcolor: 'background.default',
              }}
            >
              <CircularProgress size={80} color="primary" />
              <Typography
                variant="h6"
                sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}
              >
                Loading...
              </Typography>
            </Box>
          }
        >
          <AppWrapper />
        </Suspense>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
