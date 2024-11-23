import { FC } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Box,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FormatDistance from './FormatDistance';
import { GetAllWorkoutsResponse } from '../types';
import { useTranslation } from 'react-i18next';
import { AccessTime, Star } from '@mui/icons-material';

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

const WorkoutCard: FC<WorkoutCardProps> = ({ workout }) => {
  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <Card
      sx={{
        marginBottom: 3,
        borderRadius: 0,
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        component={Link}
        to={`/workout/${workout.id}`}
        sx={{
          '&:hover': {
            boxShadow: 4,
          },
        }}
      >
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

        <CardContent
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: 3.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar
              alt={workout.user.username}
              src={workout.user.profilePicUrl || ''}
              sx={{
                width: 48,
                height: 48,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                }}
              >
                {workout.user.username}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                <FormatDistance date={new Date(workout.createdAt)} addSuffix />
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ mr: 0.5, fill: theme.palette.primary.light }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'medium',
                  color: theme.palette.text.primary,
                }}
              >
                {t('workout.points', { count: workout.points })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime
                sx={{
                  scale: 0.69,
                  fill: theme.palette.text.secondary,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 'medium',
                  color: theme.palette.text.secondary,
                }}
              >
                {t('workout.nMinutes', { count: workout.durationMin })}
              </Typography>
            </Box>
          </Box>

          {workout.notes && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
              }}
              className="line-clamp-2"
            >
              {workout.notes}
            </Typography>
          )}

          {workout._count.comments > 0 && (
            <Typography
              variant="body2"
              sx={{
                marginTop: 1,
                fontWeight: 'medium',
                color: theme.palette.primary.main,
              }}
            >
              {t('comment.comments', { count: workout._count.comments })}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default WorkoutCard;
