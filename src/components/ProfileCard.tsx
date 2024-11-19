import { Box, Avatar, Typography, Card } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const ProfileCard = () => {
  const { user } = useAuthStore();

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
          marginRight: '1.5rem',
        }}
      >
        <Typography variant="h5" fontWeight={700} color="textPrimary">
          {user._count.workouts}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          workout
        </Typography>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary">
          {user.points}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          points
        </Typography>
      </Box>
    </Card>
  ) : (
    <div>Not logged in...</div>
  );
};

export default ProfileCard;
