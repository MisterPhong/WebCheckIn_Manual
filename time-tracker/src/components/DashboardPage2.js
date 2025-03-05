import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardPage2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, nickname, loginTime } = location.state || {}; // รับข้อมูลจาก state ที่ส่งมาจากหน้าล็อกอิน

  // แปลงเวลา
  const formatLoginTime = (loginTime) => {
    return new Date(loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  // ล็อกเอ้าท์
  const handleLogout = () => {
    navigate('/'); // ไปหน้าล็อกอิน
  };

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
          คุณได้ลากิจ
        </Typography>
        {firstName && nickname && loginTime ? (
          <>
            <Typography variant="h6">ชื่อ - สกุล: {firstName}</Typography>
            <Typography variant="h6">ชื่อเล่น: {nickname}</Typography>
            <Typography variant="h6">เวลากรอกฟอร์ม: {formatLoginTime(loginTime)}</Typography>
          </>
        ) : (
          <Typography variant="h6">No data available</Typography>
        )}

        {/* <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleLogout}
        >
          ออกงาน
        </Button> */}
      </Box>
    </Container>
  );
};

export default DashboardPage2;
