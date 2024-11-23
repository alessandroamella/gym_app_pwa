import { Box, Avatar, Typography, Card, useTheme } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FitnessCenter, Star } from '@mui/icons-material';

const ProfileCard = () => {
  const { user } = useAuthStore();

  const { t } = useTranslation();

  const theme = useTheme();

  return user ? (
    <Card className="mb-4 p-3 flex">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link to="/edit-profile">
          <Avatar
            alt={user.username}
            src={user.profilePicUrl || ''}
            className="scale-150 ml-2 mr-8 border-2 border-[#BA55D3] drop-shadow-md"
          />
        </Link>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary">
          <Star sx={{ mr: 0.5, fill: theme.palette.primary.light }} />
          {user.points}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('workout.points', {
            count: user.points,
          })}
        </Typography>
      </Box>
      <div className="grow" />
      <Box
        sx={{
          alignItems: 'center',
          marginRight: '0.5rem',
        }}
      >
        <Typography variant="h5" fontWeight={700} color="textPrimary">
          <FitnessCenter sx={{ mr: 0.5, fill: theme.palette.text.primary }} />
          {user._count.workouts}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('profile.workouts', {
            count: user._count.workouts,
          })}
        </Typography>
      </Box>
    </Card>
  ) : (
    <div>Not logged in...</div>
  );
};

export default ProfileCard;
