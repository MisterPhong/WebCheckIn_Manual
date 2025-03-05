import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Manual = () => {
  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          คู่มือ
        </Typography>

        {/* แสดงรูปภาพจากลิงก์ URL ภายนอก */}
        <Box sx={{ marginTop: 4 }}>
          <img 
            src="https://www.maxim.com/wp-content/uploads/2021/05/tom-cruise-top-gun.jpg" // ใส่ลิงก์รูปภาพที่ต้องการ
            alt="คู่มือ" 
            width="300" 
          />
        </Box>
        
      </Box>
    </Container>
  );
};

export default Manual;
