import { Typography, Chip, Box } from '@mui/material';
import { FC } from 'react';

interface UsernameChipProps {
  username: string;
  points: number;
  outlined?: boolean;
  size?: 'small' | 'medium';
}
const UsernameChip: FC<UsernameChipProps> = ({
  username,
  points,
  outlined,
  size,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant={size === 'small' ? 'body2' : 'h6'}>
        {username}
      </Typography>
      <Chip
        label={points || 0}
        size={outlined ? 'small' : 'medium'}
        color={outlined ? 'info' : 'default'}
        variant={outlined ? 'outlined' : 'filled'}
        sx={{
          fontWeight: 900,
          fontSize: '0.9rem',
          scale: size === 'small' ? 0.8 : 1,
          ml: size === 'small' ? -0.69 : 0,
        }}
      />
    </Box>
  );
};

export default UsernameChip;
