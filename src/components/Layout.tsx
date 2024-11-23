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
  Home as HomeIcon,
  Menu as MenuIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { SwipeableDrawer } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import useDarkModeStore from '../store/darkModeStore';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  const darkMode = useDarkModeStore((state) => state.darkMode);
  const toggleDarkMode = useDarkModeStore((state) => state.toggleDarkMode);

  const menuItems = user
    ? [
        { text: 'feed', icon: <HomeIcon />, href: '/' },
        { text: 'editProfile', icon: <EditIcon />, href: '/edit-profile' },
        { text: 'logout', icon: <LogoutIcon />, href: '/logout' },
      ]
    : [{ text: 'login', icon: <LoginIcon />, href: '/auth' }];

  const { t } = useTranslation();

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
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <div className="grow" />
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
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
      <Box component="main">{children}</Box>
    </Box>
  );
};

export default Layout;
