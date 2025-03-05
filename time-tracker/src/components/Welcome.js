import React from 'react';
import { Button, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate จาก react-router-dom

const Welcome = () => {
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับเปลี่ยนเส้นทาง

  const handleLogin = () => {
    navigate('/login'); 
  };

  const handleManual = () => {
    navigate('/manuals'); 
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>เวลโคมี</Typography>
        <Box>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ marginTop: 2 }} 
            onClick={handleLogin}
          >
            เข้างาน
          </Button>
          
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ marginTop: 2 }} 
            onClick={handleManual}
          >
            คู่มือ
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Welcome;
