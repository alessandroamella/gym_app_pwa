import { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AuthScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/v1/auth/login', {
        username,
        password,
      });

      setToken(response.data.token);
      const profileResponse = await axios.get('/v1/auth/profile', {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      setUser(profileResponse.data);

      navigate(from, { replace: true }); // Redirect to the protected route
    } catch (err) {
      setError(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          'Login failed',
      );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Gym App
      </Typography>
      <Box sx={{ width: '80%', maxWidth: 400, mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          {' '}
          {/* Add form element */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};
