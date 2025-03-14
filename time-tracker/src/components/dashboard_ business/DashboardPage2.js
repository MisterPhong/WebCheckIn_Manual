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
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardPage2 = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, lastName, loginTime,
    status } = storedUser;
  const [userData, setUserData] = useState([]);

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


  useEffect(() => {
    if (!firstName || !lastName) {
      navigate('/');
      return;
    }

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
  }, [firstName, lastName, navigate]);

  const filteredData = userData.filter(
    (user) => user.firstName === firstName && user.lastName === lastName
  );

  return (
    <Box
      sx={{
        minHeight: "91vh",
        width: "90w",
        overflow: "hidden",
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
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              {/* รูปภาพ */}
              <Box
                sx={{
                  width: 150,
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
                  <Typography component="span" sx={{ color: 'black', fontWeight: 'bold' }}>{lastName}</Typography>
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

            <Button variant="contained" onClick={() => navigate('/tablenormal')}>
              ดูข้อมูลสถิติย้อนหลัง
            </Button>
          </CardActions>
        </Card>

      </Container>
    </Box>
  );
};

export default DashboardPage2;