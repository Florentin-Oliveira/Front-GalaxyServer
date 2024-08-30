import { createTheme } from '@mui/material';
import { purple, blueGrey } from '@mui/material/colors';

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: purple[700],
      dark: purple[900],
      light: purple[500],
      contrastText: '#ffffff',
    },
    secondary: {
      main: blueGrey[700],
      dark: blueGrey[900],
      light: blueGrey[500],
      contrastText: '#ffffff',
    },
    background: {
      paper: '#2C2C34',  // Roxo escuro
      default: '#1C1C24', // Azul escuro
    },
    text: {
      primary: '#ffffff',
      secondary: '#0000',
    },
  },
});
