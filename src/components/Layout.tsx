import React, { useState } from 'react';
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

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, setDarkMode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();

  const menuItems = user
    ? [
        { text: 'Feed', icon: <HomeIcon />, href: '/' },
        { text: 'Edit Profile', icon: <EditIcon />, href: '/edit-profile' },
        { text: 'Logout', icon: <LogoutIcon />, href: '/logout' },
      ]
    : [{ text: 'Login', icon: <LoginIcon />, href: '/auth' }];

  const toggleTheme = () => setDarkMode(!darkMode);

  const navigationList = (
    <Box>
      <List>
        {menuItems.map((item) => (
          <Link
            key={item.text}
            to={item.href}
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItem>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
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
          {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Gym App
            </Link>
          </Typography> */}
          <IconButton color="inherit" onClick={toggleTheme}>
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
