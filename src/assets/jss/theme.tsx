import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      "Ubuntu"
    ].join(','),
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    contrastThreshold: 3,
    tonalOffset: 0.2,
    primary: {
      main: '#221133'
    },
    secondary: {
      main: '#EA148D'
    },
    background: {
      default: '#F2F2F2'
    },
  },
});

export default theme;