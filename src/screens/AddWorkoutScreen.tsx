import { FC, FormEvent, useCallback, useEffect, useState } from 'react';
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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { parse, differenceInMinutes } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { WorkoutData } from '../types/workoutData';

const ConfirmDialog: FC<{
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: (open: boolean) => void;
  pendingSubmission: WorkoutData | null;
  submitWorkout: (data: WorkoutData) => void;
}> = ({
  isConfirmDialogOpen,
  pendingSubmission,
  setIsConfirmDialogOpen,
  submitWorkout,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isConfirmDialogOpen}
      onClose={() => setIsConfirmDialogOpen(false)}
      aria-labelledby="long-workout-dialog-title"
      aria-describedby="long-workout-dialog-description"
    >
      <DialogTitle id="long-workout-dialog-title">
        {t('workout.longWorkoutDialog.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="long-workout-dialog-description">
          {t('workout.longWorkoutDialog.text')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsConfirmDialogOpen(false)} color="primary">
          {t('buttons.cancel')}
        </Button>
        <Button
          onClick={() => {
            if (pendingSubmission) {
              submitWorkout(pendingSubmission);
              setIsConfirmDialogOpen(false);
            }
          }}
          color="primary"
          autoFocus
          variant="contained"
        >
          {t('buttons.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddWorkoutScreen = () => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] =
    useState<WorkoutData | null>(null);
  const [startHour, setStartHour] = useState<string>('');
  const [endHour, setEndHour] = useState<string>('');
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

  const [points, setPoints] = useState<number | null>(null);

  const getDurationMin = useCallback(() => {
    const startDate = parse(startHour, 'HH:mm', new Date());
    const endDate = parse(endHour, 'HH:mm', new Date());
    const durationMin = differenceInMinutes(endDate, startDate);

    return { startDate, endDate, durationMin };
  }, [startHour, endHour]);

  useEffect(() => {
    if (startHour && endHour) {
      const { durationMin } = getDurationMin();

      if (durationMin > 0) {
        setPoints(Math.floor(durationMin / 45));
      } else {
        setPoints(null); // Reset points if duration is invalid
      }
    } else {
      setPoints(null); // Reset points if times are not entered
    }
  }, [startHour, endHour, getDurationMin]);

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const { startDate, endDate, durationMin } = getDurationMin();

    if (durationMin <= 0) {
      setAlert(t('workout.invalidTimeRange'));
      return;
    }

    // Check for extremely long workouts (over 3 hours)
    if (durationMin > 180) {
      setPendingSubmission({ startDate, endDate, notes });
      setIsConfirmDialogOpen(true);
      return;
    }

    await submitWorkout({ startDate, endDate, notes });
  };

  const submitWorkout = async ({ startDate, endDate, notes }: WorkoutData) => {
    setIsUploading(true);

    try {
      const { data } = await axios.post(
        '/v1/workout',
        { startDate, endDate, notes },
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

  const [placeholder, setPlaceholder] = useState<string>('--');

  const changePlaceholder = useCallback(
    (_e: unknown, noDelay = false) => {
      setTimeout(
        () => {
          const placeholder = _.sample(
            t('workout.placeholders', { returnObjects: true }) as string[],
          )!;
          setPlaceholder(placeholder);
        },
        noDelay ? 0 : 300,
      );
    },
    [t],
  );

  useEffect(() => {
    changePlaceholder(undefined, true);
  }, [changePlaceholder]);

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
      <ConfirmDialog
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmDialogOpen={setIsConfirmDialogOpen}
        pendingSubmission={pendingSubmission}
        submitWorkout={submitWorkout}
      />

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
          <Box display="flex" gap={2}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="startHour"
              label={t('workout.startTime')}
              name="startHour"
              type="time"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="endHour"
              label={t('workout.endTime')}
              name="endHour"
              type="time"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ marginBottom: 2 }}
            />
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            {points !== null ? (
              <Chip
                label={t('workout.points', { count: points })}
                color="success"
                variant="outlined"
                sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}
              />
            ) : startHour && endHour ? (
              <Chip
                label={t('workout.invalidTimeRange')}
                color="error"
                variant="outlined"
              />
            ) : (
              <Typography
                className="text-center"
                variant="body2"
                color="textSecondary"
              >
                {t('workout.pointsInfo')}
              </Typography>
            )}
          </Box>
        </motion.div>

        <motion.div variants={itemVariants}>
          <TextField
            margin="normal"
            fullWidth
            name="notes"
            label={t('workout.notes')}
            id="notes"
            multiline
            placeholder={placeholder}
            onBlur={changePlaceholder}
            rows={4}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ marginBottom: 2 }}
            onKeyDown={(e) => {
              // on ctrl+enter submit
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmit();
              }
            }}
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
