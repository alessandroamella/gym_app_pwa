import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9400D3', // Deep Fuchsia
      light: '#BA55D3', // Medium Orchid
      dark: '#6A0DAD', // Deep Purple
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B6B', // Pastel Red
      light: '#FFD93D', // Soft Yellow
      dark: '#6A5ACD', // Slate Blue
      contrastText: '#000000',
    },
    error: {
      main: '#FF4081', // Bright Pink
    },
    warning: {
      main: '#FFA726', // Warm Orange
    },
    info: {
      main: '#7E57C2', // Medium Purple
    },
    success: {
      main: '#66BB6A', // Soft Green
    },
    background: {
      default: '#F3E5F5', // Very Light Lavender
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BA55D3', // Medium Orchid
      light: '#D500F9', // Bright Fuchsia
      dark: '#6A0DAD', // Deep Purple
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B6B', // Pastel Red
      light: '#FF9800', // Bright Orange
      dark: '#6A5ACD', // Slate Blue
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF4081', // Bright Pink
    },
    warning: {
      main: '#FFA726', // Warm Orange
    },
    info: {
      main: '#7E57C2', // Medium Purple
    },
    success: {
      main: '#66BB6A', // Soft Green
    },
    background: {
      default: '#121212', // Dark Background
      paper: '#1E1E1E', // Slightly lighter dark paper
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export { lightTheme, darkTheme };
