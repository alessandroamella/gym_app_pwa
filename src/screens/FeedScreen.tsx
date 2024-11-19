// src/screens/FeedScreen.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { WorkoutCard } from '../components/WorkoutCard';
import { GetAllWorkoutsResponse } from '../types';
import { useAuthStore } from '../store/authStore';
import ProfileCard from '../components/ProfileCard';

export const FeedScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<GetAllWorkoutsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/v1/workout', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(response.data);
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

    fetchWorkouts();
  }, [token]);

  if (loading) {
    return <Typography variant="body1">Loading workouts...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <ProfileCard />
      {/* Container for relative positioning */}
      {/* Workout List */}
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
      {workouts.length === 0 && (
        <Typography variant="body1">No workouts found.</Typography>
      )}
      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate('/add-workout')} // Navigate to add workout screen
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
