import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage2 = () => {
  const navigate = useNavigate();

  // ดึงข้อมูลจาก localStorage (ของผู้ใช้ที่ล็อกอิน)
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, nickname, loginTime, status } = storedUser;

  // State สำหรับเก็บข้อมูลจาก MongoDB
  const [userData, setUserData] = useState([]);

  // ฟังก์ชันสำหรับแปลงวันที่
  const formatUserDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('th-TH'); // ปรับรูปแบบให้เหมาะกับภาษาไทย
  };

  // ฟังก์ชันสำหรับแปลงเวลา
  const formatTimes = (timeString) => {
    const dateObj = new Date(timeString);
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // ฟังก์ชันแปลงเวลาเป็น HH:mm:ss
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

  useEffect(() => {
    if (!firstName || !nickname) {
      navigate('/'); // ถ้าไม่มีข้อมูลใน localStorage ให้กลับหน้าแรก
      return;
    }

    // ดึงข้อมูลจาก MongoDB ผ่าน API
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/getUserData'); // เรียก API จาก Backend
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserData();

    // ตั้งเวลาให้ออกจากระบบตอนเที่ยงคืน
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(17, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 ของวันถัดไป
    const timeUntilMidnight = midnight - now; // คำนวณเวลาที่เหลือ

    console.log(`ระบบจะออกจากระบบในอีก ${timeUntilMidnight / 1000} วินาที`);

    const timeout = setTimeout(() => {
      console.log("ถึงเวลาเที่ยงคืน ออกจากระบบ...");
      localStorage.removeItem('userSession'); // ลบ session ออกจาก localStorage
      navigate('/'); // กลับไปหน้า Welcome
    }, timeUntilMidnight); // ออกจากระบบเมื่อถึงเที่ยงคืน

    return () => clearTimeout(timeout); // เคลียร์ timeout เมื่อ component unmount
  }, [firstName, nickname, navigate]);

  // กรองเฉพาะข้อมูลของตัวเองจาก MongoDB
  const filteredData = userData.filter(
    (user) => user.firstName === firstName && user.nickname === nickname
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(to bottom right, rgba(254, 255, 255, 0.81), rgb(136, 222, 251))',
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

      <Container maxWidth="md">
        {/* Card for User Information */}
        <Card sx={{ mb: 4, boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h5" align="center" color='#0b4999' gutterBottom>
              ลากิจสำเร็จ
            </Typography>

            {/* Box สำหรับการจัดตำแหน่งข้อมูลและรูปภาพ */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center', // จัดตำแหน่งแนวนอนให้ตรงกลาง
                alignItems: 'center', // จัดตำแหน่งแนวตั้งให้ตรงกลาง
                gap: 2, // ระยะห่างระหว่างรูปและข้อมูล
                mb: 2, // ระยะห่างจากส่วนอื่น
              }}
            >
              {/* รูปภาพ */}
              <Box
                sx={{
                  width: 150, // ขนาดของรูป
                  height: 150,
                  overflow: 'hidden',
                  borderRadius: '8px',
                }}
              >
                <img
                  src="https://www.chulagradeuptutor.com/wp-content/uploads/2020/04/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A5%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99.png" 
                  alt="User Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'scale-down', 
                  }}
                />
              </Box>

              {/* ข้อมูล */}
              <Box sx={{ textAlign: 'left' }}>
                <Typography>
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>ชื่อ - สกุล:</Typography>
                  <Typography component="span" sx={{ color: 'black', fontWeight: 'bold' }}>{firstName}</Typography>
                </Typography>
                <Typography>
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>ชื่อเล่น:</Typography>
                  <Typography component="span" sx={{ color: 'black', fontWeight: 'bold' }}>{nickname}</Typography>
                </Typography>
                <Typography>
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>เวลากรอกฟอร์ม:</Typography>
                  <Typography component="span" sx={{ color: 'green', fontWeight: 'bold' }}>
                    {formatDateTime(loginTime)}
                  </Typography>
                </Typography>
                <Typography>
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>สถานะ:</Typography>
                  <Typography component="span" sx={{ color: 'tomato', fontWeight: 'bold' }}>
                    {status || 'ลากิจ'}
                  </Typography>
                </Typography>
              </Box>
            </Box>

          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button variant="contained" onClick={() => navigate('/')}>กลับไปหน้าแรก</Button>
          </CardActions>
        </Card>

        {/* Card for User History */}
        <Card sx={{ boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ประวัติการเข้า-ออกงานย้อนหลัง
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ '& th': { backgroundColor: 'salmon', fontWeight: 'bold' } }}>
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
                      <TableRow key={index} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'wheat' } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.nickname}</TableCell>
                        <TableCell>{user.status || '-'}</TableCell>
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

export default DashboardPage2;
