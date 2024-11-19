import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthScreen } from './screens/AuthScreen';
import { FeedScreen } from './screens/FeedScreen';
import { AddWorkoutScreen } from './screens/AddWorkoutScreen';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { WorkoutScreen } from './screens/WorkoutScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import Layout from './components/Layout';
import { darkTheme, lightTheme } from './themes';
import LogoutScreen from './screens/LogoutScreen';

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

  const [darkMode, setDarkMode] = useState<boolean>(
    () => JSON.parse(localStorage.getItem('darkMode') || 'null') || false,
  );

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

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
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <FeedScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-workout"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <AddWorkoutScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/:id"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <WorkoutScreen />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
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
