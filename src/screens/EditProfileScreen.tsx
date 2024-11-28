import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
  Alert,
  Snackbar,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera, Save, Close } from '@mui/icons-material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../types';

const EditProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { token, user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxSize: 5242880,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        console.log('dropped file', acceptedFiles[0]);
        setProfilePic(acceptedFiles[0]);
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
        setHasChanges(true);
      }
    },
  });

  useEffect(() => {
    // Cleanup preview URL on unmount
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    // Check for unsaved changes
    if (username || password || profilePic) {
      setHasChanges(true);
    }
  }, [username, password, profilePic]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (username || password) {
        await axios.patch(
          '/v1/auth/profile',
          { username, password },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

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

      setSuccess(true);
      setHasChanges(false);

      const profileResponse = await axios.get<Profile>('/v1/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(profileResponse.data);

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 400,
          margin: 'auto',
          marginTop: 4,
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 4,
          }}
        >
          Edit Profile
        </Typography>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setError('')}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Box
          {...getRootProps()}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Avatar
              alt={user?.username || 'User'}
              src={previewUrl || user?.profilePicUrl || ''}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: (theme) => `4px solid ${theme.palette.primary.main}`,
                boxShadow: 3,
              }}
            />
          </motion.div>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.secondary',
            }}
          >
            <PhotoCamera />
            <Typography variant="body2">
              {isDragActive
                ? 'Drop your image here...'
                : 'Click or drag to change profile picture'}
            </Typography>
          </Box>
        </Box>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSave}
            disabled={loading || !hasChanges}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>
      </Paper>

      <Snackbar
        open={hasChanges}
        message="You have unsaved changes"
        action={
          <Button color="secondary" size="small" onClick={handleSave}>
            SAVE NOW
          </Button>
        }
      />

      <Snackbar
        open={success}
        autoHideDuration={1500}
        message="Profile updated successfully!"
      />
    </motion.div>
  );
};

export default EditProfileScreen;
