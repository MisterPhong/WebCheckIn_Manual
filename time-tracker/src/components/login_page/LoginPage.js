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
  lat: 16.251035398712936,
  lon: 103.25288661528052, // ออฟฟิศ
};



const LoginPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [checkedDashboard, setCheckedDashboard] = useState(null);
  const [checkedIsWorking, setCheckedIsWorking] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(true);
  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (checkedIsWorking && !isLocationValid) {
      alert('คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศ');
      return;
    }

    const currentLoginTime = new Date().toISOString();
    let status = '';

    if (checkedDashboard === 1) status = 'ทำงานปกติ';
    else if (checkedDashboard === 2) status = 'ลาป่วย';
    else if (checkedDashboard === 3) status = 'ลากิจ';
    else {
      alert('กรุณาเลือกสถานะ');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, loginTime: currentLoginTime, status }),
      });

      if (!response.ok) {
        alert('ไม่สามารถบันทึกข้อมูลได้');
        return;
      }

      localStorage.setItem('userSession', JSON.stringify({ firstName, lastName, status, loginTime: currentLoginTime }));

      if (status === 'ทำงานปกติ') navigate('/dashboard');
      else if (status === 'ลาป่วย') navigate('/dashboard1');
      else if (status === 'ลากิจ') navigate('/dashboard2');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving data');
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const data = JSON.parse(session);
      if (data.status === 'ทำงานปกติ') navigate('/dashboard');
      else if (data.status === 'ลาป่วย') navigate('/dashboard1');
      else if (data.status === 'ลากิจ') navigate('/dashboard2');
    }

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
        background: 'linear-gradient(to bottom right,rgb(136, 222, 251),rgb(247, 247, 247))',
        position: 'relative',
      }}
    >
      {/* ปุ่มย้อนกลับ มุมซ้ายบน */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
        }}
      >
        ย้อนกลับ
      </Button>

      {/* Logoบริษัท */}
      <Box sx={{ position: 'absolute', top: 16 }}>
        <img
          src="https://www.ircp.co.th/wp-content/uploads/2023/09/IRCP_logo.png"
          alt="IRCP Logo"
          style={{ width: 200, height: 200, objectFit: 'contain' }}
        />
      </Box>

      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 5, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }} color='#0b4999'>
              ลงชื่อเข้างาน
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="ชื่อ" variant="outlined" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <TextField label="สกุล" variant="outlined" fullWidth value={lastName} onChange={(e) => setlastName(e.target.value)} />

              <Box>
                <FormControlLabel
                  control={<Checkbox checked={checkedDashboard === 1} onChange={() => { setCheckedDashboard(1); setCheckedIsWorking(true); }} />}
                  label="ทำงานปกติ"
                />
                <FormControlLabel
                  control={<Checkbox checked={checkedDashboard === 2} onChange={() => { setCheckedDashboard(2); setCheckedIsWorking(false); }} />}
                  label="ลาป่วย"
                />
                <FormControlLabel
                  control={<Checkbox checked={checkedDashboard === 3} onChange={() => { setCheckedDashboard(3); setCheckedIsWorking(false); }} />}
                  label="ลากิจ"
                />
              </Box>

              {checkedIsWorking && !isLocationValid && <Alert severity="error">คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศ ถึงจะเช็คอินเข้างานได้</Alert>}

              <Button type="submit" variant="contained" fullWidth>
                เข้างาน
              </Button>
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
