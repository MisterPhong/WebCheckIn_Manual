import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Card, CardContent, Alert } from '@mui/material';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (username === 'Admin' && password === 'Admin') {
      navigate('/admin'); // เด้งไปที่หน้า Admin Dashboard
    } else {
      setError(true); //  แสดง Error ถ้ากรอกผิด
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, rgba(254, 255, 255, 0.81), rgb(136, 222, 251))',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 5, borderRadius: 2, p: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
              Admin Login
            </Typography>

            {/* แสดงข้อความแจ้งเตือนถ้า Login ไม่สำเร็จ */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
              </Alert>
            )}

            {/* ช่องกรอก Username */}
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* ช่องกรอก Password */}
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* ปุ่ม Login */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: 2,
                mt: 1,
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminLogin;
