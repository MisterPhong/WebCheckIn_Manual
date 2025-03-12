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

const DashboardPage1 = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, nickname, loginTime, status } = storedUser;
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

  useEffect(() => {
    if (!firstName || !nickname) {
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
  }, [firstName, nickname, navigate]);

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
              ลาป่วยสำเร็จ
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
                  src="https://png.pngtree.com/png-vector/20220930/ourmid/pngtree-paid-sick-days-rgb-color-icon-vacation-benefit-plan-vector-png-image_39457746.png" 
                  alt="User Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', 
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
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>
                    เวลากรอกฟอร์ม:
                  </Typography>
                  <Typography component="span" sx={{ color: 'green', fontWeight: 'bold' }}>
                    {formatDateTime(loginTime)}
                  </Typography>
                </Typography>
                <Typography>
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>
                    สถานะ:
                  </Typography>
                  <Typography component="span" sx={{ color: 'tomato', fontWeight: 'bold' }}>
                    {status || 'ลาป่วย'}
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

export default DashboardPage1;
