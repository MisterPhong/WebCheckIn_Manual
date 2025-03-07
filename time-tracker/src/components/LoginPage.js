import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const requiredLocation = {
  lat: 13.845893,
  lon: 100.525539, // ออฟฟิศ
};

const LoginPage = () => {
  const [firstName, setFirstName] = useState('');
  const [nickname, setNickname] = useState('');

  // สำหรับเลือกสถานะ 
  const [checkedDashboard, setCheckedDashboard] = useState(null);
  const [checkedIsWorking, setCheckedIsWorking] = useState(false); // ถ้าติ๊ก มาทำงาน จะเช็คระยะ

  const [isLocationValid, setIsLocationValid] = useState(true);
  const navigate = useNavigate();

  // ฟังก์ชันคำนวณระยะทาง
  const getDistance = (lat1, lon1, lat2, lon2) => {
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

  const checkLocation = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    const distance = getDistance(latitude, longitude, requiredLocation.lat, requiredLocation.lon);
    setIsLocationValid(distance <= 1);
  }, []);

  // ฟังก์ชัน handleSubmit เมื่อกดปุ่ม เข้างาน
  const handleSubmit = async (event) => {
    event.preventDefault();

    // ถ้า มาทำงาน แล้วไม่อยู่ในระยะ
    if (checkedIsWorking && !isLocationValid) {
      alert('คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศ');
      return;
    }

    const currentLoginTime = new Date().toISOString();

    // แปลง checkedDashboard => status
    let status = '';
    if (checkedDashboard === 1) {
      status = 'มา';
    } else if (checkedDashboard === 2) {
      status = 'ลาป่วย';
    } else if (checkedDashboard === 3) {
      status = 'ลากิจ';
    } else {
      alert('กรุณาเลือกสถานะ');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          nickname,
          loginTime: currentLoginTime,
          status,
        }),
      });

      if (!response.ok) {
        alert('ไม่สามารถบันทึกข้อมูลได้');
        return;
      }

      // เก็บข้อมูลลง localStorage
      localStorage.setItem('userSession', JSON.stringify({
        firstName,
        nickname,
        status,
        loginTime: currentLoginTime,
      }));

      // จากนั้น navigate ตามสถานะ
      if (status === 'มา') {
        navigate('/dashboard');
      } else if (status === 'ลาป่วย') {
        navigate('/dashboard1');
      } else if (status === 'ลากิจ') {
        navigate('/dashboard2');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving data');
    }
  };

  // useEffect สำหรับกรณีมี session ค้างอยู่
  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const data = JSON.parse(session);
      // เช็ค status เพื่อส่งไปหน้าที่ถูกต้อง
      if (data.status === 'มา') {
        navigate('/dashboard');
      } else if (data.status === 'ลาป่วย') {
        navigate('/dashboard1');
      } else if (data.status === 'ลากิจ') {
        navigate('/dashboard2');
      }
    }

    // เช็คตำแหน่งปัจจุบัน
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(checkLocation, (error) => {
        console.error(error);
        setIsLocationValid(false);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      setIsLocationValid(false);
    }
  }, [navigate, checkLocation]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #f5f7fa, #c3cfe2)',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 5, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
              มอนิ่งจร้าาาาา
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="ชื่อ สกุล"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <TextField
                label="ชื่อเล่น"
                variant="outlined"
                fullWidth
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedDashboard === 1}
                      onChange={() => {
                        setCheckedDashboard(1);
                        setCheckedIsWorking(true);
                      }}
                    />
                  }
                  label="มาทำงานปกติ"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedDashboard === 2}
                      onChange={() => {
                        setCheckedDashboard(2);
                        setCheckedIsWorking(false);
                      }}
                    />
                  }
                  label="ลาป่วย"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedDashboard === 3}
                      onChange={() => {
                        setCheckedDashboard(3);
                        setCheckedIsWorking(false);
                      }}
                    />
                  }
                  label="ลากิจ"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => {
                        // ไม่ทำอะไรเลย
                      }}
                    />
                  }
                  label="ลาบูบู้"
                />
              </Box>

              {/* แจ้งเตือนถ้าอยากให้ผู้ใช้รู้ว่าอยู่ในระยะหรือไม่ */}
              {checkedIsWorking && !isLocationValid && (
                <Alert severity="error">
                  คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศ ถึงจะเช็คอินเข้างานได้
                </Alert>
              )}

              <Button type="submit" variant="contained" fullWidth>
                เข้างาน
              </Button>
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
            <Typography variant="caption" color="textSecondary">
              &copy; 2024 มอนิ่งจร้าาาาา By ยังต่อ
            </Typography>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
