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
import { useTranslation } from 'react-i18next';
import { AccessTime, Star } from '@mui/icons-material';
import { FormatDistanceRelative, FormatDuration } from './DateComponents';
import UsernameChip from './UsernameChip';
import { GetAllWorkoutsResponse } from '../types/workout';

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

  const renderMedia = () => {
    return workout.media.map((media, index) => (
      <Box key={index}>
        {media.mime.includes('image') ? (
          <CardMedia
            component="img"
            height="200"
            className="min-h-80 h-full w-full object-cover"
            image={media.url}
            alt={`Media ${index + 1} for workout ${workout.id}`}
          />
        ) : (
          <CardMedia component="video" height="200" src={media.url} controls />
        )}
      </Box>
    ));
  };

  return (
    <Card
      sx={{
        marginBottom: 3,
        borderRadius: 0,
        boxShadow: 3,
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
              <Slider {...sliderSettings}>{renderMedia()}</Slider>
            ) : (
              renderMedia()
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
              src={workout.user.profilePic?.url || ''}
              sx={{
                width: 48,
                height: 48,
                border: `2px solid ${theme.palette.primary.main}`,
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <UsernameChip
                points={workout.user.points || 0}
                username={workout.user.username}
                outlined
              />
              <Typography variant="caption" color="textSecondary">
                <FormatDistanceRelative
                  date={new Date(workout.createdAt)}
                  addSuffix
                />
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
                  color:
                    workout.points > 0
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                }}
              >
                +{t('workout.points', { count: workout.points })}
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
                <FormatDuration
                  startDate={workout.startDate}
                  endDate={workout.endDate}
                />
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
