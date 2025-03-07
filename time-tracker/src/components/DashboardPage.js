import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  // ดึงข้อมูลจาก localStorage (key: userSession)
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, nickname, loginTime, status } = storedUser;

  // สเตตต่าง ๆ
  const [userData, setUserData] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLogoutEnabled, setIsLogoutEnabled] = useState(false);
  const [isOutOfRange, setIsOutOfRange] = useState(false);

  // พิกัดออฟฟิศ
  const targetLat = 13.845893;
  const targetLon = 100.525539;

  // ฟังก์ชันคำนวณระยะทาง
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // ระยะทาง (กม.)
  };

  // ดึงตำแหน่งผู้ใช้
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            targetLat,
            targetLon
          );
          setIsOutOfRange(distance > 1);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsOutOfRange(true);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsOutOfRange(true);
    }
  };

  // ฟังก์ชันฟอร์แมตเวลาในตาราง
  const formatLoginTime = (timeString) => {
    if (!timeString) return '';
    const dateObj = new Date(timeString);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    // แสดงผลเป็น HH:mm:ss
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  // ฟังก์ชันฟอร์แมตเป็น H:M:S เหลือเวลา
  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:
            ${minutes.toString().padStart(2, '0')}:
            ${seconds.toString().padStart(2, '0')}`;
  };

  // เมื่อคลิกออกงาน
  const handleLogout = async () => {
    const currentTime = new Date().toISOString();

    try {
      // บันทึกเวลาออกงานในฝั่งเซิร์ฟเวอร์
      const response = await fetch('http://localhost:5000/api/user/saveLogoutTime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          nickname,
          loginTime,
          logoutTime: currentTime,
        }),
      });

      if (response.ok) {
        console.log('Logout time saved successfully!');
      } else {
        console.error('Error saving logout time');
      }
    } catch (error) {
      console.error('Error sending logout time:', error);
    }

    // ลบข้อมูล session ใน localStorage
    localStorage.removeItem('userSession');
    navigate('/');
  };

  // ใช้ useEffect โหลดข้อมูล และคำนวณเวลา
  useEffect(() => {
    // ถ้าไม่มีข้อมูลใน localStorage แปลว่ายังไม่ login => กลับไปหน้าแรก
    if (!firstName || !loginTime) {
      navigate('/');
      return;
    }

    // ดึงข้อมูลผู้ใช้จาก API เพื่อแสดงในตาราง
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/getUserData');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserData();

    // คำนวณเวลาที่เหลือ (ตัวอย่างสมมติให้ครบ 9 ชั่วโมง)
    const loginDate = new Date(loginTime);
    const currentTime = new Date();
    const timeDifference = 9 * 60 * 60 * 1000 - (currentTime - loginDate);

    if (timeDifference > 0) {
      setRemainingTime(timeDifference);
    } else {
      setRemainingTime(0);
      setIsLogoutEnabled(true);
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setIsLogoutEnabled(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    // เรียกฟังก์ชัน getLocation เพื่อเช็คว่าผู้ใช้อยู่ในรัศมีออกงานไหม
    getLocation();

    // เคลียร์ interval เมื่อ component unmount
    return () => clearInterval(interval);
  }, [firstName, loginTime, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          ยินดีต้อนรับเข้าออฟฟิศจร้าาาาาาาา
        </Typography>

        {firstName && loginTime ? (
          <>
            <Typography variant="h6">ชื่อ - สกุล: {firstName}</Typography>
            <Typography variant="h6">ชื่อเล่น: {nickname}</Typography>
            <Typography variant="h6">เวลาเข้างาน: {formatLoginTime(loginTime)}</Typography>
            <Typography variant="h6">
              เวลาออกงาน: {formatLoginTime(new Date(new Date(loginTime).getTime() + 9 * 3600000))}
            </Typography>
          </>
        ) : (
          <Typography variant="h6">No data available</Typography>
        )}

        <Typography variant="h6" sx={{ marginTop: 2 }}>
          เหลือเวลาอีก: {formatTime(remainingTime)}
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleLogout}
          disabled={!isLogoutEnabled || isOutOfRange} 
        >
          ออกงาน
        </Button>

        {isOutOfRange && (
          <Typography variant="body2" sx={{ color: 'red', marginTop: 2 }}>
            คุณอยู่นอกเขต 1 กิโลเมตร ไม่สามารถออกงานได้
          </Typography>
        )}
      </Box>

      {/* ตารางแสดงรายชื่อผู้ใช้ */}
      <TableContainer
        component={Paper}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: '300px',
          maxHeight: '300px',
          overflowY: 'auto',
          boxShadow: 3,
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

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={() => navigate('/')}
      >
        กลับไปหน้าแรก
      </Button>
    </Container>
  );
};

export default DashboardPage;
