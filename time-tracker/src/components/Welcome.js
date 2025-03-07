import React from 'react';
import { Box, Typography, Card, CardContent, Container, CardActions, } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleManual = () => {
    navigate('/manuals');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // พื้นหลังไล่สี (Gradient)
        background: 'linear-gradient(to bottom right, #dfe9f3, #ffffff)',
      }}
    >

      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 5, borderRadius: 2 }}>
          <CardContent>

            <Typography
              variant="h4"
              align="center"
              sx={{ fontWeight: 'bold', marginBottom: 4 }}
            >
              เวลโคมี
            </Typography>

            {/* 2 บล็อก */}
            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            {/* เข้างาน */}
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPrkkD6siuqfSqaK80stEJb9oEIgUK857ErA&s)',
                  backgroundSize: 'cover',
                  borderRadius: 2,
                  cursor: 'pointer',
                  boxShadow: 3,
                }}
                onClick={handleLogin}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '4px 8px',
                    borderRadius: 1,
                  }}
                >
                  เข้างาน
                </Typography>
              </Box>

              {/* คู่มือ */}
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(https://instrktiv.com/shop/wp-content/uploads/2020/05/Machinery_Single-scaled-1.jpg)',
                  backgroundSize: 'cover',
                  borderRadius: 2,
                  cursor: 'pointer',
                  boxShadow: 3,
                }}
                onClick={handleManual}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '4px 8px',
                    borderRadius: 1,
                  }}
                >
                  คู่มือ
                </Typography>
              </Box>
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

export default Welcome;
