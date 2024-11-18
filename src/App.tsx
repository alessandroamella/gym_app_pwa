import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthScreen } from './screens/AuthScreen';
import { FeedScreen } from './screens/FeedScreen';
import { AddWorkoutScreen } from './screens/AddWorkoutScreen';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import axios from 'axios';
import { WorkoutScreen } from './screens/WorkoutScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import Layout from './components/Layout';

const theme = createTheme({
  // Add your theme customizations here if needed
});

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
        logout(); // Clear user data if auth check fails
      }
    };

    checkAuth();
  }, [setUser, logout, token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
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
