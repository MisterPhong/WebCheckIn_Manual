import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useNavigate } from 'react-router-dom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const Manual = () => {
  const navigate = useNavigate();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Box sx={{ backgroundColor: '#e0f7fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ position: 'absolute', top: -30, right: 5 }}>{/* Logoบริษัท */}
        <img
          src="https://www.ircp.co.th/wp-content/uploads/2023/09/IRCP_logo.png"
          alt="IRCP Logo"
          style={{ width: 150, height: 150, objectFit: 'contain' }}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 20, left: 20 }}
        onClick={() => navigate(-1)}
      >
        ย้อนกลับ
      </Button>
      <Container
        maxWidth="lg"
        sx={{ backgroundColor: '#ffffff', padding: 3, borderRadius: 2, boxShadow: 3 }} // กำหนดสีพื้นหลังของ Container
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: '#01579b', fontWeight: 'bold' }} // กำหนดสีของข้อความหัวข้อ
          >
            Quick Start Guide
          </Typography>

          {/* PDF Viewer */}
          <Box sx={{
            width: '100%',
            height: '80vh',
            mt: 2,
            border: '2px solid #0288d1',
            backgroundColor: '#f1f8e9',  // สีพื้นหลังของกรอบ PDF
            borderRadius: 2,
            boxShadow: 4,
          }}>
            <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}>
              <Viewer fileUrl="/manual.pdf" plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Manual;
