import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const { user } = useAuthStore();

  const menuItems = user
    ? [
        {
          text: 'Profile',
          icon: <PersonIcon />,
          href: '/profile',
        },
        {
          text: 'Edit Profile',
          icon: <EditIcon />,
          href: '/edit-profile',
        },
        {
          text: 'Logout',
          icon: <LogoutIcon />,
          href: '/logout',
        },
      ]
    : [
        {
          text: 'Login',
          icon: <LoginIcon />,
          href: '/auth',
        },
      ];

  const navigationList = (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text}>
          <Link
            to={item.href}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </Link>
        </ListItem>
      ))}
    </List>
  );

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Gym App
            </Link>
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div>
              {menuItems.map((item) => (
                <Link
                  key={item.text}
                  to={item.href}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Button
                    key={item.text}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{ ml: 2 }}
                  >
                    {item.text}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {navigationList}
      </Drawer>

      {/* Main Content */}
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
