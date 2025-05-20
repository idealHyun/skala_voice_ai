import { useNavigate } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';

export default function Success() {
  const navigate = useNavigate();

  return (
    <Box
      mt={8}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" gutterBottom>
        제출 성공
      </Typography>

      <Button
        variant="contained"
        color="orange"
        size="large"
        onClick={() => navigate('/')}
        sx={{ mt: 4 }}
      >
        홈으로
      </Button>
    </Box>
  );
}
