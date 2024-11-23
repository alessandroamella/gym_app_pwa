import { useState, useEffect, FC, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  Typography,
  Box,
  Card,
  CardContent,
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
import {
  ArrowBack,
  Delete as DeleteIcon,
  FitnessCenter,
  AccessTime,
  Comment as CommentIcon,
  Send as SendIcon,
  Favorite,
  Share,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { GetWorkoutResponse, WorkoutMedia } from '../types';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FormatDistance from '../components/FormatDistance';

const WorkoutScreen: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<GetWorkoutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const { token, user } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true);
        if (!token) throw new Error('Not logged in.');
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

    if (id) fetchWorkout();
  }, [id, token]);

  const handleGoBack = () => navigate('/');

  const handleCommentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await axios.post(
        `/v1/comment/workout/${id}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCommentText('');
      if (id) {
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
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error deleting workout:', error);
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`/v1/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh workout data to get updated comments
      if (id) {
        const response = await axios.get(`/v1/workout/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkout(response.data);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const renderMediaItem = (mediaItem: WorkoutMedia) => {
    if (mediaItem.mime.includes('video')) {
      return (
        <video
          controls
          className="w-full h-[400px] object-cover"
          src={mediaItem.url}
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    return (
      <img
        src={mediaItem.url}
        alt="Workout media"
        className="w-full h-[400px] object-cover"
      />
    );
  };

  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!workout)
    return <Typography variant="body1">Workout not found.</Typography>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mx: 'auto', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 1 }}>
          <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <FitnessCenter sx={{ mr: 1 }} />
            {t('workout.workout')} #{workout.id}
          </Typography>
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

        <Card
          component={motion.div}
          whileHover={{ y: -5 }}
          sx={{ mb: 3, borderRadius: 0 }}
        >
          {workout.media && workout.media.length > 0 && (
            <Box sx={{ position: 'relative' }}>
              <Slider
                dots
                infinite
                speed={500}
                slidesToShow={workout.media.length > 1 ? 1.2 : 1}
                slidesToScroll={1}
                adaptiveHeight
              >
                {workout.media.map((media, index) => (
                  <Box key={index}>{renderMediaItem(media)}</Box>
                ))}
              </Slider>
            </Box>
          )}

          <CardContent>
            <Box sx={{ px: 1, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  alt={workout.user.username}
                  src={workout.user.profilePicUrl || ''}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{workout.user.username}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    <FormatDistance
                      date={new Date(workout.createdAt)}
                      addSuffix
                    />
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {workout.durationMin} minutes
                </Typography>
              </Box>

              {workout.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Notes
                  </Typography>
                  <Typography variant="body1">{workout.notes}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <IconButton
                  onClick={() => setLiked(!liked)}
                  color={liked ? 'primary' : 'default'}
                >
                  <Favorite />
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                >
                  <CommentIcon sx={{ mr: 1 }} />
                  {t('comment.comments', { count: workout.comments.length })}
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleCommentSubmit}
                  sx={{ display: 'flex', gap: 1 }}
                >
                  <TextField
                    label={t('comment.addComment')}
                    fullWidth
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    size="small"
                  />
                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={!commentText}
                    sx={{ alignSelf: 'center' }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>

                <List className="mt-4">
                  <div className="h-2" />
                  {workout.comments.map((comment) => (
                    <ListItem
                      key={comment.id}
                      component={motion.div}
                      whileHover={{ x: 5 }}
                      sx={{
                        bgcolor: 'background.paper',
                        mt: -2,
                        mb: -2,
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 1,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              alt={comment.user.username}
                              src={comment.user.profilePicUrl || ''}
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1,
                                marginTop: '1rem',
                              }}
                            />
                            <Typography variant="body2" fontWeight="medium">
                              {comment.user.username}
                            </Typography>
                            <div className="w-2" />
                            <Typography
                              sx={{ marginTop: '1px' }}
                              variant="caption"
                              color="textSecondary"
                            >
                              <FormatDistance
                                date={new Date(comment.createdAt)}
                                addSuffix
                              />
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              sx={{
                                p: 0.5,
                                marginTop: '-1rem',
                                marginLeft: '2.28rem',
                              }}
                            >
                              {comment.text}
                            </Typography>
                          </>
                        }
                      />
                      {comment.user.id === user?.id && (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => setDeleteCommentId(comment.id)}
                          sx={{ ml: 1 }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Dialog
          open={deleteCommentId !== null}
          onClose={() => setDeleteCommentId(null)}
        >
          <DialogTitle>
            <DeleteIcon color="error" sx={{ mr: 1 }} />
            {t('workout.dialogs.deleteComment.title')}
          </DialogTitle>
          <DialogContent>
            {t('workout.dialogs.deleteComment.confirmation')}
            <Typography
              sx={{ marginLeft: '-0.5px', marginTop: '4px' }}
              variant="body2"
              color="textSecondary"
            >
              {t('workout.dialogs.warning')}
            </Typography>
          </DialogContent>
          <DialogActions className="mx-1">
            <Button onClick={() => setDeleteCommentId(null)}>
              {t('buttons.cancel')}
            </Button>
            <div className="grow" />
            <Button
              onClick={() => handleDeleteComment(deleteCommentId!)}
              color="error"
              startIcon={<DeleteIcon />}
            >
              {t('buttons.delete')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteConfirmationOpen}
          onClose={() => setDeleteConfirmationOpen(false)}
        >
          <DialogTitle>
            <DeleteIcon color="error" sx={{ mr: 1 }} />
            {t('workout.dialogs.deleteWorkout.title')}
          </DialogTitle>
          <DialogContent>
            {t('workout.dialogs.deleteWorkout.confirmation')}
            <Typography
              sx={{ marginLeft: '-0.5px', marginTop: '4px' }}
              variant="body2"
              color="textSecondary"
            >
              {t('workout.dialogs.warning')}
            </Typography>
          </DialogContent>
          <DialogActions className="mx-1">
            <Button onClick={() => setDeleteConfirmationOpen(false)}>
              {t('buttons.cancel')}
            </Button>
            <div className="grow" />
            <Button
              onClick={handleDeleteWorkout}
              color="error"
              startIcon={<DeleteIcon />}
            >
              {t('buttons.delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default WorkoutScreen;
