import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ChnageManu = () => {
  const navigate = useNavigate();

  const handleManul = () => {
    navigate('/manuals');
  };

  const handleManualQ = () => {
    navigate('/menus');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right,rgba(254, 255, 255, 0.81),rgb(136, 222, 251))',
        position: 'relative',
      }}
    >
      {/* ปุ่มย้อนกลับ */}
      <Button
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 20, left: 20 }}
        onClick={() => navigate(-1)} // กลับไปหน้าก่อนหน้า
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
            <Typography
              variant="h4"
              align="center"
              color='#0b4999'
              sx={{ fontWeight: 'bold', marginBottom: 4 }}
            >
              เลือกคู่มือ
            </Typography>

            {/* 2 บล็อก */}
            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
              {/* คู่มือ Quick */}
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(https://media.istockphoto.com/id/1013541514/vector/fast-finder-logo-design-template.jpg?s=612x612&w=0&k=20&c=zxAZLq_kU8EFI06XD0r8wRbhSCNPjKVCiwWkw2cMYoY=)',
                  backgroundSize: 'cover',
                  borderRadius: 2,
                  cursor: 'pointer',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 10,
                  },
                }}
                onClick={handleManul}
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
                  Quick Start Guide
                </Typography>
              </Box>

              {/* คู่มือ Sup */}
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage:
                    'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(https://thumbs.dreamstime.com/b/instruction-manual-isolated-white-background-d-illustration-182119387.jpg)',
                  backgroundSize: 'cover',
                  borderRadius: 2,
                  cursor: 'pointer',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 10,
                  },
                }}
                onClick={handleManualQ}
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
                  คู่มือการทำงาน
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
            <Typography variant="caption" color="textSecondary">
              
            </Typography>
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
};

export default ChnageManu;
