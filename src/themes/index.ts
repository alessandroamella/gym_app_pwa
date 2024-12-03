import { createTheme } from '@mui/material/styles';

const commonProps = {
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9400D3',
      light: '#D500F9',
      dark: '#6A0DAD',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FFD93D',
      dark: '#6A5ACD',
      contrastText: '#000000',
    },
    error: {
      main: '#FF4081',
    },
    warning: {
      main: '#FFA726',
    },
    info: {
      main: '#7E57C2',
    },
    success: {
      main: '#66BB6A',
    },
    background: {
      default: '#F3E5F5',
      paper: '#FFFFFF',
    },
  },

  ...commonProps,
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      secondary: '#999',
    },

    primary: {
      main: '#BA55D3',
      light: '#961ca1',
      dark: '#6A0DAD',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B6B',
      light: '#FF9800',
      dark: '#6A5ACD',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF4081',
    },
    warning: {
      main: '#FFA726',
    },
    info: {
      main: '#7E57C2',
    },
    success: {
      main: '#66BB6A',
    },
    background: {
      default: '#2f1a2e',
      paper: '#1b1b1a',
    },
  },

  ...commonProps,
});

export { lightTheme, darkTheme };
