import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: `'Pretendard-Regular', sans-serif`,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&.Mui-disabled': {
            WebkitTextFillColor: '#000',
          },
        },
      },
    },
  },
  palette: {
    orange: {
      main: '#f36f21',
      contrastText: '#fff',
    },
    primary: {
        main: '#666666',
      },
  },
});

export default theme;
