import { motion } from 'framer-motion';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, SentimentVeryDissatisfied } from '@mui/icons-material';

const NotFoundScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.3, type: 'spring', stiffness: 300 },
    },
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md text-center"
      >
        <motion.div
          variants={imageVariants}
          whileHover="hover"
          className="mb-8"
        >
          {/* <img
            src="/404.png" // Replace with your 404 image
            alt="404 Not Found"
            className="w-64 h-64 mx-auto object-contain"
          /> */}
          <SentimentVeryDissatisfied className="text-white" />
        </motion.div>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="text-white font-bold mb-4"
        >
          {t('notFound.title')}
        </Typography>
        <Typography variant="body1" className="text-white mb-8">
          {t('notFound.message')}
        </Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 12 }}
          >
            <Home />
          </Button>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default NotFoundScreen;
