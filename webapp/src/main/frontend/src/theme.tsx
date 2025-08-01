import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: "#005F73",
    },
    secondary: {
      main: "#CA6702",
    },
    info: {
      main: "#0A9396"
    }
  },
  typography: {
    fontFamily: [
      'Open Sans', // Font scelto
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  }
});