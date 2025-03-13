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
      localStorage.setItem('isAdminLoggedIn', 'true'); // ✅ บันทึกการล็อกอิน
      navigate('/admin'); // ✅ ไปที่หน้า Admin
    } else {
      setError(true);
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
      {/* Logoบริษัท */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
        }}
      >
        <img
          src="https://www.ircp.co.th/wp-content/uploads/2023/09/IRCP_logo.png"
          alt="IRCP Logo"
          style={{ width: 200, height: 200, objectFit: 'contain' }}
        />
      </Box>
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
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 5, borderRadius: 2, p: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
              Admin Login
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</Alert>}

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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
