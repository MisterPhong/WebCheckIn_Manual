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

const DashboardPage1 = () => {
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
    <Container component="main" maxWidth="md">
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
            <Typography variant="h6">เวลากรอกฟอร์ม: {formatDateTime(loginTime)}</Typography>
            <Typography variant="h6">สถานะ: {status || 'ลาป่วย'}</Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={() => navigate('/')}
            >
              กลับหน้าแรก
            </Button>
          </>
        ) : (
          <Typography variant="h6">No data available</Typography>
        )}
      </Box>

      {/* ตารางแสดงข้อมูลย้อนหลัง */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          สถิติ (ประวัติการเข้า-ออกงานย้อนหลัง)
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ '& th': { backgroundColor: 'salmon', fontWeight: 'bold' } }}>
                <TableCell>ลำดับ</TableCell>
                <TableCell>วันที่</TableCell>
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
                    <TableCell>{formatUserDate(user.loginTime)}</TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.nickname}</TableCell>
                    <TableCell>{user.status || '-'}</TableCell>

                    {/* ถ้าสถานะเป็น 'ลาป่วย' หรือ 'ลากิจ' ให้แสดงตามประเภทการลา */}
                    <TableCell>
                      {user.status === 'ลาป่วย' ? 'ลาป่วย'
                        : user.status === 'ลากิจ' ? 'ลากิจ'
                          : formatTimes(user.loginTime)}
                    </TableCell>
                    <TableCell>
                      {user.status === 'ลาป่วย' ? 'ลาป่วย'
                        : user.status === 'ลากิจ' ? 'ลากิจ'
                          : user.logoutTime
                            ? formatTimes(user.logoutTime)
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
      </Box>
    </Container>
  );
};

export default DashboardPage1;
