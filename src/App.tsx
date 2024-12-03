import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAuthStore } from './store/authStore';
import { useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import Layout from './components/Layout';
import { darkTheme, lightTheme } from './themes';
import LogoutScreen from './screens/LogoutScreen';
import useDarkModeStore from './store/darkModeStore';
import AuthScreen from './screens/AuthScreen';
import FeedScreen from './screens/FeedScreen';
import AddWorkoutScreen from './screens/AddWorkoutScreen';
import ProtectedRoute from './ProtectedRoute';
import WorkoutScreen from './screens/WorkoutScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import { useTranslation } from 'react-i18next';
import firebase from './firebase';

const App = () => {
  const { setUser, logout, token } = useAuthStore();

  function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });
  }

  const { t } = useTranslation();

  const isFetching = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isFetching.current) {
        return;
      }
      isFetching.current = true;

      try {
        if (token) {
          const { data } = await axios.get('/v1/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('User authenticated:', data);
          setUser(data);
        }
      } catch (err) {
        console.error(
          'Authentication check failed:',
          (err as AxiosError)?.response?.data || err,
        );
        isFetching.current = false;
        logout();
      }

      try {
        switch (Notification.permission) {
          case 'default':
            window.alert(t('notifications.alert'));
            requestPermission();
            break;
          case 'denied':
            window.alert(t('notifications.denied'));
            break;
          case 'granted':
            break;
        }

        const deviceToken = await firebase.getDeviceToken();

        await axios.patch(
          '/v1/device-token',
          {
            token: deviceToken,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log('Device token updated:', deviceToken);
      } catch (err) {
        console.error(
          'Failed to update device token:',
          (err as AxiosError)?.response?.data || err,
        );
      }
    };

    checkAuth();
  }, [setUser, logout, token, t]);

  const darkMode = useDarkModeStore((state) => state.darkMode);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/logout" element={<LogoutScreen />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <FeedScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-workout"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddWorkoutScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <WorkoutScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditProfileScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
