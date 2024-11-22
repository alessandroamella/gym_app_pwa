import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { BaseWorkout } from '../types';
import { useAuthStore } from '../store/authStore';

export const AddWorkoutScreen: React.FC = () => {
  const [duration, setDuration] = useState<number | undefined>();
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false); // State to manage the alert
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleDrop = (acceptedFiles: File[]) => {
    console.log('Accepted files:', acceptedFiles);
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
    } else {
      setAlertOpen(true); // Open the alert if no files are provided
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 5,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!duration) {
      setAlertOpen(true); // Open the alert if duration is not provided
      return;
    }

    setIsUploading(true);

    try {
      const { data } = await axios.post<BaseWorkout>(
        '/v1/workout',
        {
          durationMin: duration,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (files) {
        for (const file of files) {
          console.log('Uploading file:', file);
          const mediaFormData = new FormData();
          mediaFormData.append('files', file);

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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg"
    >
      <Typography variant="h4" className="text-center font-bold mb-6">
        Add Workout
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="duration"
        label="Duration (minutes)"
        name="duration"
        type="number"
        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
      />
      <TextField
        margin="normal"
        fullWidth
        name="notes"
        label="Notes"
        id="notes"
        multiline
        rows={4}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div
        {...getRootProps()}
        className={`my-4 p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {files ? (
          <Typography className="text-gray-700">
            {files.map((file) => file.name).join(', ')}
          </Typography>
        ) : (
          <Typography className="text-gray-500">
            Drag & drop an image or video here, or click to select files
          </Typography>
        )}
      </div>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className="mt-6"
        disabled={isUploading}
      >
        {isUploading ? (
          <CircularProgress size={24} className="text-white" />
        ) : (
          'Add Workout'
        )}
      </Button>

      {/* Snackbar Alert */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="warning"
          variant="filled"
        >
          Puoi caricare da 1 a 5 filessz
        </Alert>
      </Snackbar>
    </Box>
  );
};
