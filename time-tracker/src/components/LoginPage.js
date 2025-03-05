import React, { useState, useCallback } from 'react'; 
import { TextField, Button, Box, Container, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const requiredLocation = {
  lat: 13.845893, 
  lon: 100.525539, // ออฟฟิศเรา
};

const LoginPage = () => {
  const [firstName, setFirstName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLocationValid, setIsLocationValid] = useState(true); 
  const [checkedDashboard, setCheckedDashboard] = useState(null); 
  const [checkedDashboard1, setCheckedDashboard1] = useState(false); 
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
    const distance = R * c; 
    return distance;
  };

  const checkLocation = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    const distance = getDistance(latitude, longitude, requiredLocation.lat, requiredLocation.lon);
    
    if (distance <= 1) {
      setIsLocationValid(true); 
    } else {
      setIsLocationValid(false); 
    }
  }, []); 

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (checkedDashboard1 && !isLocationValid) {
      alert('คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศ');
      return;
    }
  
    const currentLoginTime = new Date().toLocaleString(); 
  
    let status = '';
    if (checkedDashboard === 1) {
      status = 'มา';
    } else if (checkedDashboard === 2) {
      status = 'ลาป่วย';
    } else if (checkedDashboard === 3) {
      status = 'ลากิจ';
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/user/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          nickname,
          loginTime: currentLoginTime,
          status, 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('User data saved:', data);
        if (checkedDashboard === 1) {
          navigate('/dashboard', { state: { firstName, nickname, loginTime: currentLoginTime, status } });
        } else if (checkedDashboard === 2) {
          navigate('/dashboard1', { state: { firstName, nickname, loginTime: currentLoginTime, status } });
        } else if (checkedDashboard === 3) {
          navigate('/dashboard2', { state: { firstName, nickname, loginTime: currentLoginTime, status } });
        } else {
          alert('กรุณาเลือกสถานะ');
        }
      } else {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving data');
    }
  };

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(checkLocation, (error) => {
        console.error(error);
        setIsLocationValid(false); 
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      setIsLocationValid(false);
    }
  }, [checkLocation]); 

  // เพิ่มปุ่ม Logout ตรงนี้
  const handleLogout = () => {
    navigate('/logout'); // เปลี่ยนเส้นทางไปยังหน้า logout
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>มอนิ่งจร้าาาาา</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="ชื่อ สกุล"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="ชื่อเล่น"
            fullWidth
            margin="normal"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedDashboard === 1}
                onChange={() => {
                  setCheckedDashboard(1);
                  setCheckedDashboard1(true); 
                }}
              />
            }
            label="มาทำงานปกติ"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedDashboard === 2}
                onChange={() => setCheckedDashboard(2)}
              />
            }
            label="ลาป่วย"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedDashboard === 3}
                onChange={() => setCheckedDashboard(3)}
              />
            }
            label="ลากิจ"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
            เข้างาน
          </Button>
        </form>
        {checkedDashboard1 && !isLocationValid && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศถึงจะเช็คอินเข้างานได้
          </Typography>
        )}
        {/* ปุ่ม Logout ที่เพิ่มขึ้นมา */}
        <Button variant="outlined" fullWidth sx={{ marginTop: 2 }} onClick={handleLogout}>
          ตรวจสอบเวลา
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
