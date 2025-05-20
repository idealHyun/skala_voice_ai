import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Success from './components/Success';
import Upload from './components/Upload';
import Loading from './components/Loading';
import Result from './components/Result';
import logo from './logo.png';
import { CustomerProvider } from './context/CustomerContext';

export default function App() {
  return (
    <CustomerProvider>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 5,
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={4} sx={{ pt: 3, pb: 7, borderRadiuss: 3 }}>
            <Box textAlign="center">
              <img
                src={logo}
                alt="로고"
                style={{ height: '80px', marginBottom: '0.5rem' }}
              />
              <Typography variant="h4">대화 요약 및 상품 추천 서비스</Typography>
            </Box>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/success" element={<Success/>}/>
              <Route path="/upload" element={<Upload/>}/>
              <Route path="/loading" element={<Loading/>}/>
              <Route path="/result" element={<Result/>}/>
            </Routes>
          </Paper>
        </Container>
      </Box>
    </CustomerProvider>
  );
}
