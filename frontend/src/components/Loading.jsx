import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="50vh"
      flexDirection="column"
    >
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f36f21" />
            <stop offset="100%" stopColor="#b21807" />
          </linearGradient>
        </defs>
      </svg>

      <CircularProgress
        size={60}
        thickness={5}
        sx={{
          'svg circle': {
            stroke: 'url(#my_gradient)',
          },
        }}
      />
      <Typography mt={6}>
        대화 내용을 분석하는 중
      </Typography>
    </Box>
  );
}
