import { FC } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { GetApp, MobileOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const WallScreen: FC = () => {
  const { t } = useTranslation();

  const mainVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const iconVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={mainVariants}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f4ff',
        padding: '16px',
        textAlign: 'center',
      }}
    >
      <motion.div variants={iconVariants}>
        <MobileOff style={{ fontSize: 80, color: '#ff1744' }} />
      </motion.div>

      <motion.div variants={textVariants}>
        <Typography variant="h4" gutterBottom sx={{ mt: 2, color: '#333' }}>
          {t('wall.title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
          {t('wall.instructions')}
        </Typography>
      </motion.div>

      <motion.div variants={textVariants}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ color: '#777' }}>
            {t('wall.stepsTitle')}
          </Typography>
          <ol
            className="list-decimal"
            style={{ textAlign: 'left', color: '#555', margin: '16px 0' }}
          >
            <li>{t('wall.step1')}</li>
            <li>{t('wall.step2')}</li>
            <li>{t('wall.step3')}</li>
          </ol>
        </Box>
      </motion.div>

      <motion.div variants={iconVariants}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GetApp />}
          onClick={() => {
            window.alert(t('wall.redirectMessage'));
          }}
        >
          {t('wall.installButton')}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default WallScreen;
