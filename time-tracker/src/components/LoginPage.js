import React, { useState, useCallback } from 'react'; // เพิ่ม useCallback
import { TextField, Button, Box, Container, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// จุดที่ต้องการให้ผู้ใช้เข้ามา (ในที่นี้คือค่าตัวอย่างของ Latitude และ Longitude)
const requiredLocation = {
  lat: 13.845965, 
  lon: 100.525630, // ออฟฟิศเรา
};

const LoginPage = () => {
  const [firstName, setFirstName] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLocationValid, setIsLocationValid] = useState(true); // สถานะการตรวจสอบตำแหน่ง
  const [checkedDashboard, setCheckedDashboard] = useState(null); // เช็คบ็อกที่เลือก
  const [checkedDashboard1, setCheckedDashboard1] = useState(false); // เช็คบ็อกสำหรับ Dashboard 1
  const navigate = useNavigate();

  // ฟังก์ชันคำนวณระยะห่างระหว่างตำแหน่งสองจุด
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // รัศมีของโลก (กิโลเมตร)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // ระยะห่างในกิโลเมตร
    return distance;
  };

  // ใช้ useCallback เพื่อ memoize checkLocation
  const checkLocation = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    const distance = getDistance(latitude, longitude, requiredLocation.lat, requiredLocation.lon);
    
    if (distance <= 1) {
      setIsLocationValid(true); // ถ้าอยู่ในรัศมี 1 กิโลเมตร
    } else {
      setIsLocationValid(false); // ถ้าอยู่นอกเหนือรัศมี
    }
  }, []); 

  // ฟังก์ชันที่เรียกเมื่อผู้ใช้ส่งข้อมูล
  const handleSubmit = async (event) => {
    event.preventDefault();

    // หากเลือก Checkbox1 (ไปหน้า Dashboard 1) ต้องตรวจสอบตำแหน่ง
    if (checkedDashboard1 && !isLocationValid) {
      alert('คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศ');
      return;
    }

    const currentLoginTime = new Date().toLocaleString(); 

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User data saved:', data);
        // เมื่อเลือกเช็คบ็อกให้ไปยังแดชบอร์ดที่เลือก
        if (checkedDashboard === 1) {
          navigate('/dashboard', { state: { firstName, nickname, loginTime: currentLoginTime } });
        } else if (checkedDashboard === 2) {
          navigate('/dashboard1', { state: { firstName, nickname, loginTime: currentLoginTime } });
        } else if (checkedDashboard === 3) {
          navigate('/dashboard2', { state: { firstName, nickname, loginTime: currentLoginTime } });
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

  // เรียกใช้ navigator.geolocation
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(checkLocation, (error) => {
        console.error(error);
        setIsLocationValid(false); // ถ้าไม่สามารถดึงตำแหน่งได้
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      setIsLocationValid(false);
    }
  }, [checkLocation]); // เพิ่ม checkLocation ใน dependency array

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
                  setCheckedDashboard1(true); // ตั้งค่า checkedDashboard1 เป็น true
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
        {!isLocationValid && checkedDashboard1 && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศถึงจะเช็คอินเข้างานได้
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
