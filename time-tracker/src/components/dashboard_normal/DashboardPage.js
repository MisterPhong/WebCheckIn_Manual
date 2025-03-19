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
  CssBaseline, GlobalStyles
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();

  // อ่าน session จาก localStorage
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  // const { firstName, lastName, loginTime } = storedUser;
  const { firstName, lastName, loginTime } = storedUser;

  // สเตตสำหรับข้อมูลผู้ใช้ทั้งหมด (ที่โหลดจาก API)
  const [userData, setUserData] = useState([]);

  // สเตตสำหรับเวลาเหลือ
  const [remainingTime, setRemainingTime] = useState(0);
  // สเตตปุ่มออกงาน
  const [isLogoutEnabled, setIsLogoutEnabled] = useState(false);
  // สเตตตรวจว่าผู้อยู่เกินระยะ 1 km หรือไม่
  const [isOutOfRange, setIsOutOfRange] = useState(false);

  // พิกัดออฟฟิศ
  const targetLat = 16.251035398712936;
  const targetLon = 103.25288661528052;


  // lat: 16.251035398712936,
  // lon: 103.25288661528052, // ออฟฟิศ

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


  const formatDate = (timeString) => {
    if (!timeString) return '-';
    const dateObj = new Date(timeString);
    const buddhistYear = dateObj.getFullYear() + 543;
    return dateObj.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(dateObj.getFullYear().toString(), buddhistYear.toString());
  };

  const formatTimes = (timeString) => {
    if (!timeString) return '-';
    const dateObj = new Date(timeString);
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };


  // const formatDateTime = (timeString) => {
  //   if (!timeString) return 'ยังไม่ออกงาน';
  //   const dateObj = new Date(timeString);
  //   return dateObj.toLocaleString([], {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //     hour12: false,
  //   });
  // };

  // // ฟังก์ชันแปลงเวลา (e.g. เข้างาน)
  // const formatLoginTime = (timeString) => {
  //   if (!timeString) return '';
  //   const dateObj = new Date(timeString);
  //   if (isNaN(dateObj.getTime())) {
  //     return '';
  //   }
  //   return dateObj.toLocaleTimeString([], {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //     hour12: false,
  //   });
  // };

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
          lastName,
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

    // คำนวณเวลาที่เหลือ
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
    (user) => user.firstName === firstName && user.lastName === lastName
  );


  return (
    <Box
      sx={{
        minHeight: "91vh",
        width: "90w",
        overflow: "hidden",
        background: "linear-gradient(to bottom right, rgba(254, 255, 255, 0.81), rgb(136, 222, 251))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      {/* Logoบริษัท */}
      <Box sx={{ position: 'absolute', top: -30, right: 50 }}>
        <img
          src="https://www.ircp.co.th/wp-content/uploads/2023/09/IRCP_logo.png"
          alt="IRCP Logo"
          style={{ width: 150, height: 150, objectFit: 'contain' }}
        />
      </Box>
      <Container maxWidth="md" sx={{ maxWidth: '100%', overflow: 'hidden' }}>
        {/* Card แรก: ข้อมูลผู้ใช้ + ปุ่มออกงาน */}
        {/* Card แรก: ข้อมูลผู้ใช้ + ปุ่มออกงาน */}
        <Card sx={{ mb: 4, boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h5" align="center" color='#0b4999' gutterBottom>
              Welcome To Office
            </Typography>

            {/* ถ้ามีข้อมูล แสดงชื่อ สถานะ ฯลฯ */}
            {firstName && loginTime ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* ข้อมูลผู้ใช้ */}
                <Box>
                  <Typography>
                    <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>ชื่อ :</Typography>
                    <Typography component="span" sx={{ color: 'black', fontWeight: 'bold' }}>{firstName}</Typography>
                  </Typography>
                  <Typography>
                    <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>นามสกุล :</Typography>
                    <Typography component="span" sx={{ color: 'black', fontWeight: 'bold' }}>{lastName}</Typography>
                  </Typography>
                  <Typography>
                    <Typography component="span" sx={{ color: 'black', marginRight: '8px' }} >
                      เวลาเข้างาน:
                    </Typography>
                    <Typography component="span" sx={{ fontWeight: 'bold', color: 'green' }}>
                      {formatTimes(loginTime)}
                    </Typography>
                  </Typography>

                  <Typography>
                    <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>
                      เวลาออกงาน:
                    </Typography>
                    <Typography component="span" sx={{ fontWeight: 'bold', color: 'blue' }}>
                      {formatTimes(new Date(new Date(loginTime).getTime() + 9 * 3600000))}
                    </Typography>
                  </Typography>

                  <Box sx={{ my: 2 }}>
                    <Typography>
                      <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>
                        เหลือเวลาอีก:
                      </Typography>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: 'red' }}>
                        {formatTime(remainingTime)}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography variant="h6">No data available</Typography>
            )}

            {/* ปุ่มออกงาน */}
            <Button
              variant="contained"
              color="warning"
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
          </CardContent>

          <CardActions sx={{ justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/')}>
              กลับไปหน้าแรก
            </Button>
            <Button variant="contained" onClick={() => navigate('/tablenormal')}>
              ประวัติการเข้า-ออกงาน
            </Button>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
};

export default DashboardPage;
