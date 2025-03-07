import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  // อ่าน session จาก localStorage
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, nickname, loginTime} = storedUser;

  // สเตตสำหรับข้อมูลผู้ใช้ทั้งหมด (ที่โหลดจาก API)
  const [userData, setUserData] = useState([]);

  // สเตตสำหรับเวลาเหลือ
  const [remainingTime, setRemainingTime] = useState(0);
  // สเตตปุ่มออกงาน
  const [isLogoutEnabled, setIsLogoutEnabled] = useState(false);
  // สเตตตรวจว่าผู้อยู่เกินระยะ 1 km หรือไม่
  const [isOutOfRange, setIsOutOfRange] = useState(false);

  // พิกัดออฟฟิศ
  const targetLat = 13.845893;
  const targetLon = 100.525539;

  // ฟังก์ชันคำนวณระยะทาง (กม.)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ฟังก์ชันดึงตำแหน่งผู้ใช้
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
          setIsOutOfRange(distance > 1); // ถ้าเกิน 1 km ให้ถือว่า OutOfRange
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


  const formatDateTime = (timeString) => {
    if (!timeString) return 'ยังไม่ออกงาน';
    const dateObj = new Date(timeString);
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // ฟังก์ชันแปลงเวลา (e.g. เข้างาน)
  const formatLoginTime = (timeString) => {
    if (!timeString) return '';
    const dateObj = new Date(timeString);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // ฟังก์ชันแปลงเวลา (ms) => hh:mm:ss เหลือเวลา
  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours.toString().padStart(2, '0')}:
            ${minutes.toString().padStart(2, '0')}:
            ${seconds.toString().padStart(2, '0')}`;
  };

  // ฟังก์ชันออกงาน
  const handleLogout = async () => {
    const currentTime = new Date().toISOString();

    try {
      // เรียก API saveLogoutTime
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

    // ลบ session ใน localStorage
    localStorage.removeItem('userSession');
    // กลับหน้าแรก
    navigate('/');
  };

  useEffect(() => {
    // ถ้าไม่มีข้อมูลใน localStorage => ไปหน้าแรก
    if (!firstName || !loginTime) {
      navigate('/');
      return;
    }

    // ดึงข้อมูลทั้งหมดมาแสดงในตาราง
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

    // คำนวณเวลาที่เหลือ 9 ชม.
    const loginDate = new Date(loginTime);
    const now = new Date();
    const timeDifference = 9 * 3600000 - (now - loginDate);

    if (timeDifference > 0) {
      setRemainingTime(timeDifference);
    } else {
      setRemainingTime(0);
      setIsLogoutEnabled(true);
    }

    // เริ่มจับเวลานับถอยหลัง
    const intervalId = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1000) {
          clearInterval(intervalId);
          setIsLogoutEnabled(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    // เช็คพิกัด
    getLocation();

    // Clear interval เมื่อ unmount
    return () => clearInterval(intervalId);
  }, [firstName, loginTime, navigate]);

  const filteredData = userData.filter(
    (user) => user.firstName === firstName && user.nickname === nickname
  );


  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        // พื้นหลังไล่สี
        background: 'linear-gradient(to bottom right, #eff1f3, #ffffff)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Card แรก: ข้อมูลผู้ใช้ + ปุ่มออกงาน */}
        <Card sx={{ mb: 4, boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              ยินดีต้อนรับเข้าออฟฟิศจร้าาาาาาาา
            </Typography>

            {/* ถ้ามีข้อมูล แสดงชื่อ สถานะ ฯลฯ */}
            {firstName && loginTime ? (
              <>
                <Typography>ชื่อ - สกุล: {firstName}</Typography>
                <Typography>ชื่อเล่น: {nickname}</Typography>
                <Typography>เวลาเข้างาน: {formatLoginTime(loginTime)}</Typography>
                <Typography>
                  เวลาออกงาน: {formatLoginTime(new Date(new Date(loginTime).getTime() + 9 * 3600000))}
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Typography>เหลือเวลาอีก: {formatTime(remainingTime)}</Typography>
                </Box>

                {/* ปุ่มออกงาน */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!isLogoutEnabled || isOutOfRange}
                  onClick={handleLogout}
                >
                  ออกงาน
                </Button>
                {isOutOfRange && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    คุณอยู่นอกเขต 1 กิโลเมตร ไม่สามารถออกงานได้
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="h6">No data available</Typography>
            )}
          </CardContent>

          <CardActions sx={{ justifyContent: 'center' }}>
            <Button variant="outlined" onClick={() => navigate('/')}>
              กลับไปหน้าแรก
            </Button>
          </CardActions>
        </Card>

        {/* Card สอง: ตารางข้อมูลผู้ใช้ */}
        <Card sx={{ boxShadow: 4 }}>
          {/* ส่วนตารางแสดงรายชื่อผู้ใช้ */}
          <CardContent>
            <Typography variant="h6" gutterBottom>
              สถิติ (ประวัติการเข้า-ออกงานย้อนหลัง)
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ '& th': { backgroundColor: '#f0f0f0', fontWeight: 'bold' } }}>
                    <TableCell>ลำดับ</TableCell>
                    <TableCell>ชื่อ - สกุล</TableCell>
                    <TableCell>ชื่อเล่น</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>เวลาเข้างาน</TableCell>
                    <TableCell>เวลาออกงาน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((user, index) => (
                      <TableRow key={index} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.nickname}</TableCell>
                        <TableCell>{user.status || '-'}</TableCell>

                        {/* ถ้าสถานะเป็น 'ลาป่วย' หรือ 'ลากิจ' ให้แสดงตามประเภทการลา */}
                        <TableCell>
                          {user.status === 'ลาป่วย' ? 'ลาป่วย'
                            : user.status === 'ลากิจ' ? 'ลากิจ'
                              : formatDateTime(user.loginTime)}
                        </TableCell>
                        <TableCell>
                          {user.status === 'ลาป่วย' ? 'ลาป่วย'
                            : user.status === 'ลากิจ' ? 'ลากิจ'
                              : user.logoutTime
                                ? formatDateTime(user.logoutTime)
                                : 'ยังไม่ออกงาน'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">ไม่พบข้อมูลย้อนหลัง</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DashboardPage;
