import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, nickname, loginTime, additionalInfo } = location.state || {}; // รับข้อมูลจาก state ที่ส่งมาจากหน้าล็อกอิน

  const [userData, setUserData] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0); // เวลาที่เหลือสำหรับการล็อกเอ้าท์
  const [isLogoutEnabled, setIsLogoutEnabled] = useState(false); // สถานะปุ่มล็อกเอ้าท์

  // ดึงข้อมูลจาก API เมื่อ component ถูก render
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/getUserData');
        const data = await response.json();
        setUserData(data); // เก็บข้อมูลลง state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();

    // คำนวณเวลาเหลือจากเวลาที่ล็อกอิน
    const loginDate = new Date(loginTime);
    const currentTime = new Date();
    const timeDifference = 9 * 60 * 60 * 1000 - (currentTime - loginDate); // เวลาที่เหลือในมิลลิวินาที

    if (timeDifference > 0) {
      setRemainingTime(timeDifference);
    } else {
      setIsLogoutEnabled(true); // อนุญาตให้ล็อกเอ้าท์ได้เมื่อครบ 9 ชั่วโมง
    }

    // นับถอยหลังทุก 1 วินาที
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval); // หยุดนับถอยหลังเมื่อถึง 0
          setIsLogoutEnabled(true); // อนุญาตให้ล็อกเอ้าท์ได้
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    // ล้าง interval เมื่อ component unmount
    return () => clearInterval(interval);
  }, [loginTime]);

  // ล็อกเอ้าท์
  const handleLogout = () => {
    navigate('/'); // ไปหน้าล็อกอิน
  };

  // แปลงเวลา
  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // ฟังก์ชันสำหรับแปลงเวลาในรูปแบบ 24 ชั่วโมง
  const formatLoginTime = (loginTime) => {
    return new Date(loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };



  // ตรวจสอบข้อมูลจาก location.state
  console.log(location.state);


  // ตรวจสอบ loginTime และการคำนวณเวลา
  console.log(loginTime);
  const loginDate = new Date(loginTime);
  const currentTime = new Date();
  const timeDifference = 9 * 60 * 60 * 1000 - (currentTime - loginDate);
  console.log(timeDifference);

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
          ยินดีต้อนรับเข้าออฟฟิศจร้าาาาาาาา
        </Typography>
        {firstName && nickname && loginTime ? (
          <>
            <Typography variant="h6">ชื่อ - สกุล: {firstName}</Typography>
            <Typography variant="h6">ชื่อเล่น: {nickname}</Typography>
            <Typography variant="h6">เวลาเข้างาน: {formatLoginTime(loginTime)}</Typography>
            <Typography variant="h6">เวลาออกงาน: {formatLoginTime(new Date(new Date(loginTime).getTime() + 9 * 60 * 60 * 1000))}</Typography>

          </>
        ) : (
          <Typography variant="h6">No data available</Typography>
        )}

        <Typography variant="h6" sx={{ marginTop: 2 }}>
          เหลือเวลาอีก: {formatTime(remainingTime)}&nbsp;นาที
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleLogout}
          disabled={!isLogoutEnabled} // ถ้าไม่ถึงเวลาให้ปิดปุ่ม
        >
          ออกงาน
        </Button>
      </Box>

      {/* ตารางข้อมูลผู้ใช้ */}
      <TableContainer
        component={Paper}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: '300px',
          maxHeight: '300px',
          overflowY: 'auto',
          boxShadow: 3
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ชื่อ - สกุล</TableCell>
              <TableCell>ชื่อเล่น</TableCell>
              <TableCell>เวลาเข้างาน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.length > 0 ? (
              userData.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.nickname}</TableCell>
                  <TableCell>{formatLoginTime(user.loginTime)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>ไม่พบข้อมูลผู้ใช้</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DashboardPage;
