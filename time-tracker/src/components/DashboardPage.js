import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName, nickname, loginTime, additionalInfo } = location.state || {};

  const [userData, setUserData] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isLogoutEnabled, setIsLogoutEnabled] = useState(false);
  const [logoutTime, setLogoutTime] = useState(null);
  const [isOutOfRange, setIsOutOfRange] = useState(false); // State for out of range alert

  const targetLat = 13.845893;  // ละติจูดของจุดที่กำหนด
  const targetLon =  100.525539; // ลองจิจูดของจุดที่กำหนด

  // lat: 18.845965, 
  // lon: 100.525630, // ออฟฟิศเรา

  useEffect(() => {
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

    const loginDate = new Date(loginTime);
    const currentTime = new Date();
    const timeDifference = 9 * 60 * 60 * 1000 - (currentTime - loginDate);

    if (timeDifference > 0) {
      setRemainingTime(timeDifference);
    } else {
      setIsLogoutEnabled(true);
    }

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          setIsLogoutEnabled(true);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTime]);

  // ฟังก์ชันคำนวณระยะทางจากตำแหน่งที่กำหนด
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // ฟังก์ชันตรวจสอบตำแหน่ง
  const checkLocation = (position) => {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    const distance = calculateDistance(userLat, userLon, targetLat, targetLon);

    if (distance > 1) { // ถ้าอยู่นอกเขต 1 กิโลเมตร
      setIsOutOfRange(true);
    } else {
      setIsOutOfRange(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(checkLocation, (error) => {
        console.error('Error getting location:', error);
        setIsOutOfRange(true);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleLogout = async () => {
    const currentTime = new Date();
    setLogoutTime(currentTime);

    try {
      const response = await fetch('http://localhost:5000/api/user/saveLogoutTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          nickname,
          loginTime,
          logoutTime: currentTime.toISOString(),
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

    navigate('/');
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatLoginTime = (loginTime) => {
    return new Date(loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
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
          disabled={!isLogoutEnabled || isOutOfRange} // Disable if out of range
        >
          ออกงาน
        </Button>

        {isOutOfRange && (
          <Typography variant="body2" sx={{ color: 'red', marginTop: 2 }}>
            คุณอยู่นอกเขต 1 กิโลเมตร ไม่สามารถออกงานได้
          </Typography>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ position: 'fixed', bottom: 20, right: 20, width: '300px', maxHeight: '300px', overflowY: 'auto', boxShadow: 3 }}>
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
