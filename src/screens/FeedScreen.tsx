import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkoutCard } from '../components/WorkoutCard';
import { GetAllWorkoutsResponse } from '../types';
import { useAuthStore } from '../store/authStore';
import ProfileCard from '../components/ProfileCard';
import SplashScreen from '../components/SplashScreen';
import { useSplashStore } from '../store/splashStore';
import { useTranslation } from 'react-i18next';

export const FeedScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<GetAllWorkoutsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const splash = useSplashStore((state) => state.splash);
  const setSplash = useSplashStore((state) => state.setSplash);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/v1/workout', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(response.data);
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

    fetchWorkouts();
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
        when: 'beforeChildren',
        staggerChildren: 0.1,
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

  const { t } = useTranslation();

  if (loading && !splash) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Typography variant="body1">{t('app.loadingWorkouts')}</Typography>
      </motion.div>
    );
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
      {splash ? (
        <SplashScreen onAnimationComplete={() => setSplash(false)} />
      ) : (
        <motion.div
          key="main-content"
          variants={mainContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Box sx={{ position: 'relative', p: 2 }}>
            <motion.div variants={itemVariants}>
              <ProfileCard />
            </motion.div>

            {workouts.map((workout) => (
              <motion.div key={workout.id} variants={itemVariants}>
                <WorkoutCard workout={workout} />
              </motion.div>
            ))}

            {workouts.length === 0 && (
              <motion.div variants={itemVariants}>
                <Typography variant="body1">
                  {t('app.noWorkoutsFound')}
                </Typography>
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
            >
              <Fab
                color="primary"
                aria-label="add"
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                }}
                onClick={() => navigate('/add-workout')}
              >
                <AddIcon />
              </Fab>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
