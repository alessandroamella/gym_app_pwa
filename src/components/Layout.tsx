import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Home,
  Person,
  Logout,
  Login,
  DarkMode,
  LightMode,
  Pets,
  FitnessCenter,
} from '@mui/icons-material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import useDarkModeStore from '../store/darkModeStore';
import { useTranslation } from 'react-i18next';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { GB, IT } from 'country-flag-icons/react/3x2';
import LogoutDialog from './LogoutDialog';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  href: string;
}

const Layout = () => {
  const { needRefresh, updateServiceWorker } = useRegisterSW();
  const { user } = useAuthStore();
  const darkMode = useDarkModeStore((state) => state.darkMode);
  const toggleDarkMode = useDarkModeStore((state) => state.toggleDarkMode);
  const { i18n, t } = useTranslation();
  // const isStandalone = useIsStandalone();
  const otherLang = i18n.language === 'it' ? 'en' : 'it';
  const location = useLocation();
  const theme = useTheme();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuItems: MenuItem[] = [
    ...(user
      ? [
          { text: 'feed', icon: <FitnessCenter />, href: '/' },
          { text: 'motivation', icon: <Pets />, href: '/motivation' },
          { text: 'profile', icon: <Person />, href: '/edit-profile' },
        ]
      : [{ text: 'login', icon: <Login />, href: '/auth' }]),
  ];

  const bottomNavigationItems = menuItems.map((item) => (
    <BottomNavigationAction
      key={item.text}
      component={Link}
      to={item.href}
      label={t(`navigation.${item.text}`)}
      icon={item.icon}
      value={item.href}
    />
  ));

  const [value, setValue] = useState(location.pathname);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <LogoutDialog open={logoutDialogOpen} setOpen={setLogoutDialogOpen} />
      <Box
        sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <AppBar position="sticky">
          <Toolbar
            style={{ gap: 6, backgroundColor: theme.palette.primary.light }}
          >
            <Link to="/">
              <Home />
            </Link>
            <div className="grow" /> {/* Pushes content to the right */}
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => i18n.changeLanguage(otherLang)}
            >
              {otherLang === 'it' ? (
                <IT className="w-6" />
              ) : (
                <GB className="w-6" />
              )}
            </IconButton>
            {user && (
              <IconButton
                component="button"
                onClick={() => setLogoutDialogOpen(true)}
              >
                <Logout className="text-white" />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, pb: 11, overflow: 'hidden' }}>
          {/* Takes up available space */}
          {needRefresh && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                p: 2,
                backgroundColor: 'error.main',
                color: 'white',
              }}
            >
              A new version is available!{' '}
              <button onClick={() => updateServiceWorker()}>Update</button>
            </Box>
          )}
          <Outlet />
        </Box>

        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation showLabels value={value} onChange={handleChange}>
            {bottomNavigationItems}
          </BottomNavigation>
        </Paper>
      </Box>
    </>
  );
};

export default Layout;
