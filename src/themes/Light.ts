import { createTheme } from '@mui/material';
import { purple, blueGrey } from '@mui/material/colors';

export const LightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: purple[500],
      dark: purple[700],
      light: purple[300],
      contrastText: '#ffffff', // Texto branco em botões primários
    },
    secondary: {
      main: blueGrey[500],
      dark: blueGrey[700],
      light: blueGrey[300],
      contrastText: '#ffffff', // Texto branco em botões secundários
    },
    background: {
      paper: '#ffffff',  // Cor branca para componentes como papel e cartões
      default: '#ffffff',  // Cor de fundo padrão para todo o conteúdo
    },
    text: {
      primary: '#000000',  // Texto principal preto
      secondary: '#333333', // Texto secundário em cinza escuro
    },
  },
});
