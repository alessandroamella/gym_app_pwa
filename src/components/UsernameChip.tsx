import { Typography, Chip, Box } from '@mui/material';
import { FC } from 'react';

interface UsernameChipProps {
  username: string;
  points: number;
  outlined?: boolean;
}
const UsernameChip: FC<UsernameChipProps> = ({
  username,
  points,
  outlined,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="h6">{username}</Typography>
      <Chip
        label={points || 0}
        size={outlined ? 'small' : 'medium'}
        color={outlined ? 'info' : 'default'}
        variant={outlined ? 'outlined' : 'filled'}
        sx={{
          fontWeight: 900,
          fontSize: '0.9rem',
        }}
      />
    </Box>
  );
};

export default UsernameChip;
