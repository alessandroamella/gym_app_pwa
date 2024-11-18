// src/screens/WorkoutScreen.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import { useAuthStore } from '../store/authStore';
import { GetWorkoutResponse } from '../types';

export const WorkoutScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<GetWorkoutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);

        if (!token) {
          throw new Error('Not logged in.');
        }

        const response = await axios.get(`/v1/workout/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkout(response.data);
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

    if (id) {
      fetchWorkout();
    }
  }, [id, token]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post(
        `/v1/comment/workout/${id}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCommentText(''); // Clear the comment input

      if (id) {
        // Refresh the workout details after posting comment:

        const response = await axios.get(`/v1/workout/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkout(response.data);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteWorkout = async () => {
    try {
      await axios.delete(`/v1/workout/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/', { replace: true }); // Redirect to feed after successful deletion
    } catch (error) {
      console.error('Error deleting workout:', error);
      // Handle error, e.g., show an error message to the user
    } finally {
      setDeleteConfirmationOpen(false); // Close the confirmation dialog
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!workout) {
    return <Typography variant="body1">Workout not found.</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5">Workout Details</Typography>

        {/* Delete button only if it's the user's workout */}
        {workout.user.id === user?.id && (
          <IconButton
            onClick={() => setDeleteConfirmationOpen(true)}
            color="error"
            sx={{ ml: 'auto' }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <Card>
        {workout.media && workout.media.length > 0 && (
          <CardMedia
            component="img"
            height="300"
            image={workout.media[0].url}
            alt={`Workout Media for ${workout.id}`}
          />
        )}
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              alt={workout.user.username}
              src={workout.user.profilePicUrl || ''}
              sx={{ mr: 1 }}
            />
            <Typography variant="subtitle1">{workout.user.username}</Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ ml: 'auto' }}
            >
              {formatDistanceToNow(new Date(workout.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Duration: {workout.durationMin} minutes
          </Typography>

          {workout.notes && (
            <Typography variant="body1" paragraph>
              {workout.notes}
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Comments</Typography>
            <List>
              {workout.comments.map((comment) => (
                <ListItem key={comment.id}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {comment.user.profilePicUrl && (
                          <Avatar
                            alt={comment.user.username}
                            src={comment.user.profilePicUrl || ''}
                            sx={{ marginRight: '0.5rem' }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          component="span"
                        >
                          {' '}
                          {comment.user.username}{' '}
                        </Typography>
                        <Typography variant="body2" ml={1} component="span">
                          {comment.text}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Comment Input */}
            <Box component="form" onSubmit={handleCommentSubmit}>
              <TextField
                label="Add a comment"
                fullWidth
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                margin="normal"
              />
              <Button type="submit" variant="contained" disabled={!commentText}>
                Post Comment
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this workout? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmationOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteWorkout} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
