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
  IconButton,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera, Save, Close } from '@mui/icons-material';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import { Profile } from '../types/user';

const EditProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { token, user, setUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

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
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if ((username && user && username !== user.username) || profilePic) {
      console.log('username', username, 'u', user?.username, 'p', profilePic);
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [username, profilePic, user]);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handleSavePassword = async (
    oldPassword: string,
    newPassword: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      await axios.patch(
        '/v1/auth/password',
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      handleClosePasswordDialog();
      setSuccess(true);

      const profileResponse = await axios.get<Profile>('/v1/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(profileResponse.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || err.message);
      } else {
        setError(t('editProfile.errorUpdating'));
      }
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (username) {
        await axios.patch(
          '/v1/auth/profile',
          _.omitBy({ username }, _.isEmpty),
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      if (profilePic) {
        const formData = new FormData();
        formData.append('file', profilePic);
        await axios.patch('/v1/media/profile-pic', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setHasChanges(false);
      setSuccess(true);

      const profileResponse = await axios.get<Profile>('/v1/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(profileResponse.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || err.message);
      } else {
        setError(t('editProfile.errorUpdating'));
      }
      setLoading(false);
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <ChangePasswordDialog
        onClose={handleClosePasswordDialog}
        open={openPasswordDialog}
        onSave={handleSavePassword}
      />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ p: 4, mb: -4 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 4,
            }}
          >
            {t('profile.profile')}
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
                      onClick={() => setError(null)}
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
                src={previewUrl || user?.profilePic?.url || ''}
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
              <Typography variant="body2" className="text-center">
                {t(
                  isDragActive
                    ? 'media.dropImage'
                    : 'editProfile.changeProfilePicture',
                )}
              </Typography>
            </Box>
          </Box>

          <TextField
            label={t('editProfile.username')}
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              onClick={handleSave}
              disabled={loading || !hasChanges}
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              {t(loading ? 'editProfile.saving' : 'buttons.saveChanges')}
            </Button>
          </motion.div>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <Button
              variant="text"
              color="primary"
              onClick={handleOpenPasswordDialog}
            >
              {t('editProfile.changePassword')}
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={hasChanges}
          message={t('warn.unsavedChanges')}
          action={
            <Button
              color="secondary"
              className="uppercase"
              size="small"
              onClick={handleSave}
            >
              {t('buttons.saveChanges')}
            </Button>
          }
        />

        <Snackbar
          open={success}
          autoHideDuration={1500}
          onClose={() => setSuccess(false)}
          message={t('editProfile.success')}
        />
      </motion.form>
    </>
  );
};

export default EditProfileScreen;
