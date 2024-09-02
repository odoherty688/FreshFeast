import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#b7e1dd',
      main: '#26a69a',
      dark: '#1a746b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#cee6b3',
      main: '#8bc34a',
      dark: '#618833',
      contrastText: '#000',
    },
    info: {
      light: '#f0eded',
      main: '##d4d2d2',
      dark: '#a3a2a2',
      contrastText: '#ffffff',
    }
  },
});

export default theme;
