import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';

const TableAdmin = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all'); // ค่ากรองสถานะ
    const [anchorEl, setAnchorEl] = useState(null); // เปิด/ปิด Dropdown

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

    // ฟังก์ชันเปิด/ปิด Menu Dropdown
    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // ฟังก์ชันเลือกค่ากรองสถานะ
    const handleFilterChange = (value) => {
        setStatusFilter(value);
        handleCloseMenu();
    };

    // กรองข้อมูลตาม statusFilter
    const filteredData = userData.filter(user => {
        return statusFilter === 'all' || (user.status && user.status === statusFilter);
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
            <Container maxWidth="md">
                {/* Card for User History */}
                <Card sx={{ boxShadow: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            ประวัติการเข้า-ออกงาน (นักศึกษาฝึกงาน)
                        </Typography>

                        {/* ตารางแสดงข้อมูล */}
                        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                            <Table size="small" stickyHeader>

                                {/* กำหนดความกว้างของแต่ละคอลัมน์ */}
                                <colgroup>
                                    <col style={{ width: '5%' }} />  {/* ลำดับ */}
                                    <col style={{ width: '15%' }} /> {/* วันที่ */}
                                    <col style={{ width: '20%' }} /> {/* ชื่อ */}
                                    <col style={{ width: '20%' }} /> {/* นามสกุล */}
                                    <col style={{ width: '15%' }} /> {/* สถานะ */}
                                    <col style={{ width: '12.5%' }} /> {/* เวลาเข้างาน */}
                                    <col style={{ width: '12.5%' }} /> {/* เวลาออกงาน */}
                                </colgroup>

                                <TableHead>
                                    <TableRow sx={{ '& th': { backgroundColor: 'salmon', fontWeight: 'bold' } }}>
                                        <TableCell>ลำดับ</TableCell>
                                        <TableCell>วันที่</TableCell>
                                        <TableCell>ชื่อ</TableCell>
                                        <TableCell>นามสกุล</TableCell>

                                        {/* หัวข้อ "สถานะ" พร้อมปุ่ม Filter */}
                                        <TableCell>
                                            สถานะ
                                            <IconButton size="small" onClick={handleOpenMenu}>
                                                <FilterListIcon />
                                            </IconButton>

                                            {/* Dropdown Menu */}
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseMenu}
                                            >
                                                <MenuItem onClick={() => handleFilterChange('all')}>ทั้งหมด</MenuItem>
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

export default TableAdmin;
