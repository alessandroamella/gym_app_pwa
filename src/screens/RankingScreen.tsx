import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { FormatDuration } from '../components/DateComponents';
import { addSeconds } from 'date-fns';

// Define a type for user data we expect from the API
interface UserRanking {
  id: string;
  username: string;
  totalWorkoutDuration: number;
  totalPoints: number;
}

const RankingScreen = () => {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRankings = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await axios.get<UserRanking[]>('/v1/ranking', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRankings(response.data);
        setError('');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err?.response?.data?.message || err.message);
        } else {
          console.error('An unknown error occurred:', err);
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [token]);

  const mainContentVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return <LoadingSpinner message={t('rankings.loading')} />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main-content"
        variants={mainContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Box sx={{ p: 2, minHeight: '70vh' }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h5" gutterBottom>
              {t('rankings.title')}
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="rankings table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('rankings.user')}</TableCell>
                    <TableCell align="right">
                      {t('rankings.totalDuration')}
                    </TableCell>
                    <TableCell align="right">{t('rankings.points')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankings.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell component="th" scope="row">
                        {user.username}
                      </TableCell>
                      <TableCell align="right">
                        <FormatDuration
                          startDate={addSeconds(
                            new Date(),
                            -user.totalWorkoutDuration,
                          )}
                          endDate={new Date()}
                        />
                      </TableCell>
                      <TableCell align="right">{user.totalPoints}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {rankings.length === 0 && (
              <Typography variant="body1" mt={2}>
                {t('rankings.noRankings')}
              </Typography>
            )}
          </motion.div>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default RankingScreen;
