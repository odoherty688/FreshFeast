import React from 'react';
import { Box, Button, Card, CardContent, Stack } from '@mui/material';
import logo from '../FreshFeast.png';
import theme from '../components/Theme';
import { useAuth0 } from '@auth0/auth0-react';

const LoginScreen = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 23 }}>
        <CardContent sx={{ backgroundColor: theme.palette.primary.main, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={1} direction="column">
              <Box>
                <img src={logo} width={400} height={230} alt="Logo" />
              </Box>
              <Button variant="contained" style={{ backgroundColor: theme.palette.secondary.main, padding: 10, paddingLeft: 10 }} onClick={handleLogin}>
                Login
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginScreen;
