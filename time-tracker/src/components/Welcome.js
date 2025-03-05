import React from 'react';
import { Box, Typography } from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', background: 'linear-gradient(to bottom right, #dfe9f3, #ffffff)', width: '100vw' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 4 }}>
       เวลโคมี (Welcome)
      </Typography>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box 
          sx={{ 
            width: 200, 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPrkkD6siuqfSqaK80stEJb9oEIgUK857ErA&s)',
            backgroundSize: 'cover',
            borderRadius: 2,
            cursor: 'pointer',
            boxShadow: 3
          }}
          onClick={handleLogin}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '4px 8px', borderRadius: 1 }}>
            เข้างาน
          </Typography>
        </Box>

        <Box 
          sx={{ 
            width: 200, 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(https://instrktiv.com/shop/wp-content/uploads/2020/05/Machinery_Single-scaled-1.jpg)',
            backgroundSize: 'cover',
            borderRadius: 2,
            cursor: 'pointer',
            boxShadow: 3
          }}
          onClick={handleManual}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '4px 8px', borderRadius: 1 }}>
            คู่มือ
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
