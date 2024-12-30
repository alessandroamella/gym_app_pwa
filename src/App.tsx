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
import WorkoutFeedScreen from './screens/WorkoutFeedScreen';
import AddWorkoutScreen from './screens/AddWorkoutScreen';
import ProtectedRoute from './ProtectedRoute';
import WorkoutScreen from './screens/WorkoutScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import { useTranslation } from 'react-i18next';
import firebase from './firebase';
import MotivationFeedScreen from './screens/MotivationFeedScreen';
import RankingScreen from './screens/RankingScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import AddPostScreen from './screens/AddPostScreen';

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
          <Route element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <WorkoutFeedScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/motivation"
              element={
                <ProtectedRoute>
                  <MotivationFeedScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ranking"
              element={
                <ProtectedRoute>
                  <RankingScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-post"
              element={
                <ProtectedRoute>
                  <AddPostScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-workout"
              element={
                <ProtectedRoute>
                  <AddWorkoutScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout/:id"
              element={
                <ProtectedRoute>
                  <WorkoutScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfileScreen />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
