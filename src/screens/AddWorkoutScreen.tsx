import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BaseWorkout } from '../types';

export const AddWorkoutScreen: React.FC = () => {
  const [duration, setDuration] = useState<number | undefined>();
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null); // For file uploads
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      // const formData = new FormData();
      // formData.append('durationMin', duration!.toString()); // Append duration
      // formData.append('notes', notes);

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

      if (file) {
        // POST to /v1/workout/:id/media
        const mediaFormData = new FormData();
        mediaFormData.append('file', file);
        await axios.post(`/v1/workout/${data.id}/media`, mediaFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // If successful, redirect to the feed
      navigate('/', { replace: true });
    } catch (error) {
      // Handle errors
      console.error('Error adding workout:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
      <input type="file" onChange={handleFileChange} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add Workout
      </Button>
    </Box>
  );
};
