// src/screens/EditProfileScreen.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const EditProfileScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // State for success message
  const auth = useAuthStore();
  const navigate = useNavigate();

  const handleSave = async () => {
    setError('');
    setSuccess(false); // Reset success message

    try {
      const token = localStorage.getItem('token');

      // Update profile details
      if (username || password) {
        await axios.patch(
          '/v1/auth/profile',
          { username, password },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      // Update profile picture
      if (profilePic) {
        const formData = new FormData();
        formData.append('file', profilePic);
        await axios.patch('/v1/auth/profile-pic', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // if successful, redirect to the feed or show a success message
      setSuccess(true);
      // Update Zustand store after successful update.
      const profileResponse = await axios.get('/v1/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      auth.setUser(profileResponse.data);

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfilePic(event.target.files[0]);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', marginTop: 4, padding: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Edit Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      {/* Current Profile Picture */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Avatar
          alt={auth.user?.username || 'User'}
          src={auth.user?.profilePicUrl || ''}
          sx={{ width: 100, height: 100 }}
        />
      </Box>

      <input type="file" onChange={handleProfilePicChange} accept="image/*" />

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

      <Button variant="contained" fullWidth onClick={handleSave} sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};
