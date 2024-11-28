import { FC, ReactNode, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Home,
  Menu,
  Edit,
  Logout,
  Login,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { SwipeableDrawer } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import useDarkModeStore from '../store/darkModeStore';
import { useTranslation } from 'react-i18next';
import useIsStandalone from '../hooks/isAppAndMobile';
import PwaWallScreen from '../screens/PwaWallScreen';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { needRefresh, updateServiceWorker } = useRegisterSW();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  const darkMode = useDarkModeStore((state) => state.darkMode);
  const toggleDarkMode = useDarkModeStore((state) => state.toggleDarkMode);

  const menuItems = user
    ? [
        { text: 'feed', icon: <Home />, href: '/' },
        { text: 'editProfile', icon: <Edit />, href: '/edit-profile' },
        { text: 'logout', icon: <Logout />, href: '/logout' },
      ]
    : [{ text: 'login', icon: <Login />, href: '/auth' }];

  const { t } = useTranslation();

  const isStandalone = useIsStandalone();

  const navigationList = (
    <Box>
      <List sx={{ pr: 2 }}>
        {menuItems.map((item) => (
          <Link
            key={item.text}
            to={item.href}
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItem>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(`navigation.${item.text}`)} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', padding: '0' }}>
      {import.meta.env.DEV || isStandalone ? (
        <>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
              >
                <Menu />
              </IconButton>
              <div className="grow" />
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Toolbar>
          </AppBar>

          <SwipeableDrawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onOpen={() => setDrawerOpen(true)}
          >
            {navigationList}
          </SwipeableDrawer>

          {/* sx={{ p: 3 }} */}
          <Box component="main">
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
                {/* TODO update text */}
                <Box>
                  A new version is available!{' '}
                  <button onClick={() => updateServiceWorker()}>Update</button>
                </Box>
              </Box>
            )}
            {children}
          </Box>
        </>
      ) : (
        <PwaWallScreen />
      )}
    </Box>
  );
};

export default Layout;
