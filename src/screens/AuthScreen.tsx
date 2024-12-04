import { FormEvent, useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Person } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AuthScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('/v1/auth/login', {
        username,
        password,
      });
      setToken(response.data.token);
      const { data } = await axios.get('/v1/auth/profile', {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      setUser(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        (err as AxiosError<{ message: string }>)?.response?.data?.message ||
          'Login failed',
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.5, rotate: 0, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 360,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
        opacity: { duration: 0.3 },
      },
    },
  };

  const { t } = useTranslation();

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex flex-col items-center mb-8">
            <motion.img
              src="/logo.png"
              alt="Gym App Logo"
              variants={logoVariants}
              className="w-32 h-32 object-contain mb-4"
              drag
              dragConstraints={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              whileHover={{
                scale: 1.1,
                rotate: 10,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <TextField
                label={t('auth.username')}
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <Person className="mr-2 text-gray-400" />,
                  },
                }}
                className="bg-gray-50 rounded-lg"
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <TextField
                label={t('auth.password')}
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <Lock className="mr-2 text-gray-400" />,
                  },
                }}
                className="bg-gray-50 rounded-lg"
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                sx={{
                  mt: 1,
                }}
                type="submit"
                variant="contained"
                fullWidth
                disabled={!username || !password}
                className="bg-blue-500 hover:bg-blue-600 py-3 text-lg font-semibold rounded-lg"
              >
                {t('auth.login')}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default AuthScreen;
