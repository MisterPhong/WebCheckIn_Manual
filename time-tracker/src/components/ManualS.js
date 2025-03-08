import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ManualSup = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          คู่มือ Sub
        </Typography>

        {/* PDF Viewer (ปรับให้เต็มจอ) */}
        <Box sx={{ width: '100%', height: '90vh', mt: 2, border: '1px solid #ccc' }}>
          <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}>
            <Viewer fileUrl="/manualDD.pdf" plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </Box>
      </Box>
    </Container>
  );
};

export default ManualSup;
