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
  CardActions,
  FormControl,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, nickname, loginTime, status } = storedUser;
  const [userData, setUserData] = useState([]);
  const [sortOption, setSortOption] = useState('date_desc');
  const [searchTerm, setSearchTerm] = useState(''); // คำที่ใช้ค้นหา

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/'); // 
    }
  }, [navigate]);


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
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn'); // ลบข้อมูลการล็อกอิน
    navigate('/AdminLogin'); // กลับไปหน้า Login
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

  const sortedData = [...userData].sort((a, b) => {
    if (sortOption === 'date_desc') return new Date(b.loginTime) - new Date(a.loginTime);
    if (sortOption === 'date_asc') return new Date(a.loginTime) - new Date(b.loginTime);
    if (sortOption === 'name_asc') return a.firstName.localeCompare(b.firstName);
    if (sortOption === 'name_desc') return b.firstName.localeCompare(a.firstName);
    return 0;
  });


  // ตรวจสอบ userData และ searchTerm ก่อนกรองข้อมูล
  const filteredData = sortedData.filter(user => {
    if (!user) return false; // ถ้าข้อมูลเป็น null หรือ undefined ไม่ต้องแสดง

    const firstName = user.firstName ? user.firstName.toLowerCase() : "";
    const lastName = user.lastName ? user.lastName.toLowerCase() : "";
    const nickname = user.nickname ? user.nickname.toLowerCase() : "";
    const formattedDate = user.loginTime ? formatDate(user.loginTime) : ""; //  แปลงวันที่ให้ตรงกับ UI

    const search = searchTerm ? searchTerm.toLowerCase() : ""; //  แปลง searchTerm เป็น lowerCase

    return (
      firstName.includes(search) ||
      lastName.includes(search) ||
      nickname.includes(search) ||
      formattedDate.includes(search) //  ค้นหาในวันที่
    );
  });

  return (
    <Box
      sx={{
        minHeight: "91vh",
        width: "99vw",
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
              Admin
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
                  width: 300,
                  height: 150,
                  overflow: 'hidden',
                  borderRadius: '8px',
                }}
              >
                <img
                  src="/GM.png"
                  alt="GM Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'scale-down',
                  }}
                />
              </Box>

              {/* ข้อมูล */}
              <Box sx={{ textAlign: 'left' }}>
                {/* <Typography>
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>ชื่อ - สกุล:</Typography>
                  <Typography component="span" sx={{ color: 'black', fontWeight: 'bold' }}>{firstName}</Typography>
                </Typography>
                <Typography>
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>ชื่อเล่น:</Typography>
                  <Typography component="span" sx={{ color: 'black', fontWeight: 'bold' }}>{nickname}</Typography>
                </Typography> */}
              </Box>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button variant="contained" color="error" onClick={handleLogout}>
              ออกจากระบบ
            </Button>
          </CardActions>
        </Card>

        {/* Card for User History */}
        <Card sx={{ boxShadow: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ประวัติการเข้า-ออกงาน (นักศึกษาฝึกงาน)
            </Typography>


            <TextField
              label="ค้นหาโดย ชื่อ - สกุล ชื่อเล่น หรือ วันที่"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />


            {/* Dropdown สำหรับเรียงข้อมูล */}
            <FormControl sx={{ minWidth: 200, mb: 2 }}>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                displayEmpty
              >
                <MenuItem value="date_desc">เรียงตามวันที่ (ล่าสุด → เก่าสุด)</MenuItem>
                <MenuItem value="date_asc">เรียงตามวันที่ (เก่าสุด → ล่าสุด)</MenuItem>
                <MenuItem value="name_asc">เรียงตามชื่อ (ก → ฮ)</MenuItem>
                <MenuItem value="name_desc">เรียงตามชื่อ (ฮ → ก)</MenuItem>
              </Select>
            </FormControl>

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
                        <TableCell>{formatDate(user.loginTime)}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.nickname}</TableCell>
                        <TableCell>{user.status || '-'}</TableCell>
                        <TableCell>{formatTimes(user.loginTime)}</TableCell>
                        <TableCell>{user.logoutTime ? formatTimes(user.logoutTime) : 'ยังไม่ออกงาน'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">ไม่พบข้อมูล</TableCell>
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

export default Admin;
