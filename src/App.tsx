import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import axios from 'axios';
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

const App = () => {
  const { setUser, logout, token } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const response = await axios.get('/v1/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        logout();
      }
    };

    checkAuth();
  }, [setUser, logout, token]);

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
