import React, { useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage1 = () => {
  const navigate = useNavigate();

  // สมมติเราเก็บ userSession ใน localStorage จากหน้า LoginPage
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, nickname, loginTime, status } = storedUser;

  // ฟังก์ชันแปลงวันที่/เวลา
  const formatLoginTime = (timeString) => {
    if (!timeString) return '';
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // ไปหน้า Welcome เฉย ๆ ไม่ลบ session
  const handleGoBack = () => {
    navigate('/');
  };

  useEffect(() => {
    // ถ้าไม่มีข้อมูลใน localStorage ก็ให้กลับไปหน้า Welcome
    if (!firstName || !loginTime) {
      navigate('/');
    }
  }, [firstName, loginTime, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          คุณได้ลาป่วย
        </Typography>

        {/* ถ้ามีข้อมูล แสดงผล */}
        {firstName && nickname && loginTime ? (
          <>
            <Typography variant="h6">ชื่อ - สกุล: {firstName}</Typography>
            <Typography variant="h6">ชื่อเล่น: {nickname}</Typography>
            <Typography variant="h6">เวลากรอกฟอร์ม: {formatLoginTime(loginTime)}</Typography>
            <Typography variant="h6">สถานะ: {status || 'ลาป่วย'}</Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={handleGoBack}
            >
              กลับหน้าแรก
            </Button>
          </>
        ) : (
          <Typography variant="h6">No data available</Typography>
        )}
      </Box>
    </Container>
  );
};

export default DashboardPage1;
