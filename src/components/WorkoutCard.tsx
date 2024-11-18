import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItem,
  Avatar,
  Box,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { GetAllWorkoutsResponse, GetWorkoutResponse } from '../types';
import { Link } from 'react-router-dom';

interface WorkoutCardProps {
  workout: GetAllWorkoutsResponse;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  return (
    <Card sx={{ marginBottom: '1rem', maxWidth: 400 }}>
      {' '}
      {/* Add maxWidth */}
      <CardActionArea component={Link} to={`/workout/${workout.id}`}>
        {workout.media && workout.media.length > 0 && (
          <CardMedia
            component="img"
            height="200" // Adjust as needed
            image={workout.media[0].url} // Display the first image
            alt={`Workout media for ${workout.id}`}
          />
        )}
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <Avatar
              alt={workout.user.username}
              src={workout.user.profilePicUrl || ''}
              sx={{ marginRight: '0.5rem' }}
            />
            <Typography variant="subtitle1">{workout.user.username}</Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ marginLeft: 'auto' }}
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
            <Typography variant="body2">{workout.notes}</Typography>
          )}

          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Comments ({workout._count.comments})
          </Typography>

          <List>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(workout as any as GetWorkoutResponse).comments?.map((comment) => (
              <ListItem
                key={comment.id}
                sx={{
                  padding: '0', // Reduce default padding
                  display: 'flex',
                  alignItems: 'start',
                  borderBottom: '1px solid #eee', // Add a separator line
                }}
              >
                {/* Left side for avatar and username */}
                {comment.user.profilePicUrl && (
                  <Box
                    sx={{
                      mr: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                    }}
                  >
                    <Avatar
                      src={comment.user.profilePicUrl}
                      sx={{ width: 24, height: 24, mb: 0.5 }}
                    />
                  </Box>
                )}

                {/* Right side for comment text and timestamp */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography
                      variant="body2"
                      component="span"
                      fontWeight="medium"
                    >
                      {comment.user.username}
                    </Typography>
                    <Typography variant="body2" component="span" ml={1}>
                      {comment.text}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
