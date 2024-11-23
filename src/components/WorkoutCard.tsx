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
import {
  BaseWorkout,
  GetAllWorkoutsResponse,
  GetWorkoutResponse,
} from '../types';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // Import react-slick
import 'slick-carousel/slick/slick.css'; // Import slick-carousel styles
import 'slick-carousel/slick/slick-theme.css';
import FormatDistance from './FormatDistance';

interface WorkoutCardProps {
  workout: GetAllWorkoutsResponse;
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  return (
    <Card sx={{ marginBottom: '1rem' }}>
      <CardActionArea component={Link} to={`/workout/${workout.id}`}>
        {workout.media && workout.media.length > 0 && (
          <Box>
            {workout.media.length > 1 ? (
              <Slider {...sliderSettings}>
                {workout.media.map((media, index) => (
                  <Box key={index}>
                    {media.mime.includes('image') ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={media.url}
                        alt={`Media ${index + 1} for workout ${workout.id}`}
                      />
                    ) : (
                      <CardMedia
                        component="video"
                        height="200"
                        src={media.url}
                        controls
                      />
                    )}
                  </Box>
                ))}
              </Slider>
            ) : (
              workout.media.map((media, index) => (
                <Box key={index}>
                  {media.mime.includes('image') ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={media.url}
                      alt={`Media ${index + 1} for workout ${workout.id}`}
                    />
                  ) : (
                    <CardMedia
                      component="video"
                      height="200"
                      src={media.url}
                      controls
                    />
                  )}
                </Box>
              ))
            )}
          </Box>
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
              <FormatDistance date={new Date(workout.createdAt)} addSuffix />
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
            {(workout as BaseWorkout as GetWorkoutResponse).comments?.map(
              (comment) => (
                <ListItem
                  key={comment.id}
                  sx={{
                    padding: '0',
                    display: 'flex',
                    alignItems: 'start',
                    borderBottom: '1px solid #eee',
                  }}
                >
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
                      <FormatDistance
                        date={new Date(comment.createdAt)}
                        addSuffix
                      />
                    </Typography>
                  </Box>
                </ListItem>
              ),
            )}
          </List>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
