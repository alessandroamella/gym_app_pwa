import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';

const AddWorkoutScreen = () => {
  const [duration, setDuration] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setFiles(acceptedFiles);
    } else {
      setAlert(t('workout.max5Files'));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 5,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!duration) {
      setAlert(t('workout.durationRequired'));
      return;
    }
    setIsUploading(true);
    try {
      const { data } = await axios.post(
        '/v1/workout',
        { durationMin: duration, notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (files) {
        for (const file of files) {
          const mediaFormData = new FormData();
          mediaFormData.append('file', file);
          await axios.post(`/v1/workout/${data.id}/media`, mediaFormData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      }
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error adding workout:', error);
      setAlert(
        t('workout.errorAdding', {
          error: JSON.stringify((error as AxiosError)?.response?.data || error),
        }),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        padding: '24px',
      }}
    >
      <Box
        component={motion.form}
        variants={containerVariants}
        noValidate
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 500,
          margin: '0 auto',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 3,
          padding: 4,
        }}
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 'bold',
              marginBottom: 2,
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('workout.addWorkout')}
          </Typography>
        </motion.div>

        <motion.div variants={itemVariants}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="duration"
            label={t('workout.durationMinutes')}
            name="duration"
            type="number"
            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            sx={{ marginBottom: 2 }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TextField
            margin="normal"
            fullWidth
            name="notes"
            label={t('workout.notes')}
            id="notes"
            multiline
            rows={4}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <div
            {...getRootProps()}
            style={{
              padding: '16px',
              border: `2px dashed ${
                isDragActive
                  ? theme.palette.primary.main
                  : theme.palette.divider
              }`,
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease-in-out',
              backgroundColor: isDragActive
                ? theme.palette.action.hover
                : theme.palette.background.default,
            }}
          >
            <input {...getInputProps()} />
            {files ? (
              <Typography variant="body2" color="textSecondary">
                {files.map((file) => file.name).join(', ')}
              </Typography>
            ) : (
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Typography variant="body2" color="textSecondary">
                  {t('workout.dragAndDrop')}
                </Typography>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isUploading}
            sx={{
              marginTop: 2,
              paddingY: 1.5,
              borderRadius: 2,
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            {isUploading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              t('workout.addWorkout')
            )}
          </Button>
        </motion.div>
      </Box>

      <Snackbar
        open={!!alert}
        autoHideDuration={3000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert(null)}
          severity="warning"
          variant="filled"
        >
          {alert}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default AddWorkoutScreen;
