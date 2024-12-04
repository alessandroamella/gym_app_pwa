import { useState, useEffect, FC } from 'react';
import axios from 'axios';
import { Typography, Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import WorkoutCard from '../components/WorkoutCard';
import { useAuthStore } from '../store/authStore';
import ProfileCard from '../components/ProfileCard';
import SplashScreen from '../components/SplashScreen';
import { useSplashStore } from '../store/splashStore';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import { GetAllWorkoutsResponse } from '../types/workout';

const ITEMS_PER_PAGE = 10;

const feedScreen: FC = () => {
  const [workouts, setWorkouts] = useState<GetAllWorkoutsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { t } = useTranslation();

  const splash = useSplashStore((state) => state.splash);

  const fetchWorkouts = async (pageNumber: number) => {
    if (!token) {
      return;
    }

    try {
      const skip = pageNumber * ITEMS_PER_PAGE;
      const response = await axios.get<GetAllWorkoutsResponse[]>(
        `/v1/workout?limit=${ITEMS_PER_PAGE}&skip=${skip}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const newWorkouts = response.data;
      if (pageNumber === 0) {
        setWorkouts(newWorkouts);
      } else {
        setWorkouts((prev) => [...prev, ...newWorkouts]);
      }

      setHasMore(newWorkouts.length === ITEMS_PER_PAGE);
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

  useEffect(() => {
    fetchWorkouts(0);
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

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWorkouts(nextPage);
  };

  if (loading && !splash) {
    return <LoadingSpinner message={t('feed.loadingPosts')} />;
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
        <SplashScreen />
      ) : (
        <motion.div
          key="main-content"
          variants={mainContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Box sx={{ position: 'relative', p: 2, minHeight: '91.5vh' }}>
            <motion.div variants={itemVariants}>
              <ProfileCard />
            </motion.div>

            <InfiniteScroll
              dataLength={workouts.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<LoadingSpinner message={t('feed.loadingMorePosts')} />}
              endMessage={
                <Typography variant="body2" textAlign="center" sx={{ my: 2 }}>
                  {t('feed.noMorePosts')}
                </Typography>
              }
            >
              {workouts.map((workout) => (
                <motion.div key={workout.id} variants={itemVariants}>
                  <WorkoutCard workout={workout} />
                </motion.div>
              ))}

              {workouts.length === 0 && (
                <motion.div variants={itemVariants}>
                  <Typography variant="body1">
                    {t('feed.noPostsFound')}
                  </Typography>
                </motion.div>
              )}
            </InfiniteScroll>

            <Fab
              color="primary"
              aria-label="add"
              sx={{
                position: 'fixed',
                bottom: 64,
                right: 16,
              }}
              onClick={() => navigate('/add-workout')}
            >
              <AddIcon />
            </Fab>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default feedScreen;
