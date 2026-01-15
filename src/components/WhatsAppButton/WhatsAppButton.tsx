'use client';

import { Box, Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
  const phoneNumber = '+541144242784';
  const message = encodeURIComponent('Hola, quisiera información sobre sus servicios.');
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box className={styles.whatsappContainer}>
      <Fab
        color="primary"
        aria-label="Contactar por WhatsApp"
        className={styles.whatsappButton}
        onClick={handleClick}
        sx={{
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#20BA5A',
            transform: 'scale(1.1)',
          },
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          transition: 'all 0.3s ease',
        }}
      >
        <WhatsAppIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
      </Fab>
    </Box>
  );
};

export default WhatsAppButton;

