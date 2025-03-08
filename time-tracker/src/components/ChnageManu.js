import React from 'react';
import { Box, Typography, Card, CardContent, Container, CardActions, } from '@mui/material';
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
              เลือกคู่มือ
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
                    'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(https://media.istockphoto.com/id/1013541514/vector/fast-finder-logo-design-template.jpg?s=612x612&w=0&k=20&c=zxAZLq_kU8EFI06XD0r8wRbhSCNPjKVCiwWkw2cMYoY=)',
                  backgroundSize: 'cover',
                  borderRadius: 2,
                  cursor: 'pointer',
                  boxShadow: 3,
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
                  คู่มือ Quick
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
                    'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(https://thumbs.dreamstime.com/b/instruction-manual-isolated-white-background-d-illustration-182119387.jpg)',
                  backgroundSize: 'cover',
                  borderRadius: 2,
                  cursor: 'pointer',
                  boxShadow: 3,
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
                  คู่มือ Sup
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

export default ChnageManu;
