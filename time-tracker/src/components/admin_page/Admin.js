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
  TextField,
  IconButton,
  Menu,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Admin = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, nickname, loginTime, status } = storedUser;
  const [userData, setUserData] = useState([]);
  const [sortOption, setSortOption] = useState('date_desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateMenuAnchorEl, setDateMenuAnchorEl] = useState(null);
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState(null);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/');
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

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/AdminLogin');
  };

  const handleOpenDateMenu = (event) => {
    setDateMenuAnchorEl(event.currentTarget);
  };

  const handleCloseDateMenu = () => {
    setDateMenuAnchorEl(null);
  };

  const handleOpenStatusMenu = (event) => {
    setStatusMenuAnchorEl(event.currentTarget);
  };

  const handleCloseStatusMenu = () => {
    setStatusMenuAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setDateMenuAnchorEl(null);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    handleCloseStatusMenu();
  };

  // ฟังก์ชันกรองข้อมูลตามวันที่, สถานะ, และชื่อ
  const filteredData = userData.filter(user => {
    const loginDate = new Date(user.loginTime).toDateString();
    const selectedDateString = selectedDate ? selectedDate.toDate().toDateString() : null;

    // กรองตามวันที่
    const dateFilter = selectedDate ? loginDate === selectedDateString : true;

    // กรองตามสถานะ
    const statusFilterCondition = statusFilter === '' || (user.status && user.status === statusFilter);

    // กรองตามชื่อ (ค้นหาแบบไม่สนใจตัวพิมพ์เล็ก-ใหญ่)
    const nameFilter = searchTerm === '' || 
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));

    return dateFilter && statusFilterCondition && nameFilter;
  });

  return (
    <Box
      sx={{
        minHeight: "91vh",
        width: "99vw",
        overflow: "hidden",
        background: 'linear-gradient(to bottom right, rgba(254, 255, 255, 0.81), rgb(136, 222, 251))',
        py: 4,
        position: 'relative',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 50,
          zIndex: 1000,
        }}
      >
        <img
          src="https://www.ircp.co.th/wp-content/uploads/2023/09/IRCP_logo.png"
          alt="IRCP Logo"
          style={{ width: 150, height: 80, objectFit: 'contain' }}
        />
      </Box>

      {/* ปรับ Container ให้มี margin-top เพื่อไม่ให้ทับ Logo */}
      <Container maxWidth="lg" sx={{ marginTop: '80px' }}>
        {/* Card สำหรับข้อมูล Admin */}
        <Card sx={{ mb: 4, boxShadow: 4, width: '100%', maxWidth: '100%', padding: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" color='#0b4999' gutterBottom>
              Admin
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              {/* ปรับขนาด Box และรูปภาพให้ใหญ่ขึ้น */}
              <Box
                sx={{
                  width: 400, // ขยายความกว้าง
                  height: 150, // ขยายความสูง
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
                    objectFit: 'cover', // ขยายรูปภาพให้เต็มพื้นที่
                  }}
                />
              </Box>

              <Box sx={{ textAlign: 'left' }}>
                <Typography>
                  <Typography component="span" sx={{ color: 'black', marginRight: '8px' }}>Welcome Admin</Typography>
                  <Typography>Hello กันว่าง</Typography>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Card สำหรับประวัติการเข้า-ออกงาน */}
        <Card sx={{ boxShadow: 4, width: '100%', maxWidth: '100%', padding: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ประวัติการเข้า-ออกงาน (นักศึกษาฝึกงาน)
            </Typography>

            {/* ช่องค้นหา */}
            <TextField
              fullWidth
              label="ค้นหาชื่อ"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <colgroup>
                  <col style={{ width: '5%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '12.5%' }} />
                  <col style={{ width: '12.5%' }} />
                </colgroup>

                <TableHead>
                  <TableRow sx={{ '& th': { backgroundColor: 'salmon', fontWeight: 'bold' } }}>
                    <TableCell>ลำดับ</TableCell>
                    <TableCell>
                      วันที่
                      <IconButton size="small" onClick={handleOpenDateMenu}>
                        <FilterListIcon />
                      </IconButton>
                      <Menu anchorEl={dateMenuAnchorEl} open={Boolean(dateMenuAnchorEl)} onClose={handleCloseDateMenu}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            renderInput={(params) => null}
                          />
                        </LocalizationProvider>
                      </Menu>
                    </TableCell>
                    <TableCell>ชื่อ</TableCell>
                    <TableCell>นามสกุล</TableCell>

                    <TableCell>
                      สถานะ
                      <IconButton size="small" onClick={handleOpenStatusMenu}>
                        <FilterListIcon />
                      </IconButton>

                      <Menu
                        anchorEl={statusMenuAnchorEl}
                        open={Boolean(statusMenuAnchorEl)}
                        onClose={handleCloseStatusMenu}
                      >
                        <MenuItem onClick={() => handleFilterChange('')}>ทั้งหมด</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('ทำงานปกติ')}>ทำงานปกติ</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('ลาป่วย')}>ลาป่วย</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('ลากิจ')}>ลากิจ</MenuItem>
                      </Menu>
                    </TableCell>

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
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.status || '-'}</TableCell>
                        <TableCell>{formatTimes(user.loginTime)}</TableCell>
                        <TableCell>
                          {user.logoutTime
                            ? formatTimes(user.logoutTime)
                            : (new Date(formatDate(user.loginTime)).getDate() < new Date().getDate() ? 'ยังไม่ออกงาน' : '-')
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">ไม่มีข้อมูล</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            ออกจากระบบ
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Admin;