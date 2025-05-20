import React from 'react';
import { Box } from '@mui/material';
import Form from './Form';

export default function Home() {
  return (
    <Box mt={6} display="flex" flexDirection="column" alignItems="center">
      <Form />
    </Box>
  );
}
