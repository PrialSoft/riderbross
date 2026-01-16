'use client';

import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <Box component="footer" id="contacto" className={styles.footer}>
      <Container maxWidth={false} className={styles.container}>
        <Box className={styles.footerContent}>
          <Box 
            className={styles.contactInfo}
            sx={{ 
              color: '#FFFFFF',
              '& *': { color: '#FFFFFF' },
              '& a': { color: '#FFFFFF' }
            }}
          >
            <Typography 
              variant="body1" 
              component="p" 
              className={styles.contactItem}
              sx={{ color: '#FFFFFF' }}
            >
              <Box component="span" className={styles.contactLabelWrapper}>
                <PhoneIcon className={styles.contactIcon} />
                <span className={styles.contactLabel}>Teléfono:</span>
              </Box>
              {' '}
              <Link 
                href="tel:+541144242784" 
                className={styles.contactLink}
                style={{ color: '#FFFFFF', textDecoration: 'none' }}
              >
                +541144242784
              </Link>
            </Typography>
            
            <Typography 
              variant="body1" 
              component="p" 
              className={styles.contactItem}
              sx={{ color: '#FFFFFF' }}
            >
              <Box component="span" className={styles.contactLabelWrapper}>
                <LocationOnIcon className={styles.contactIcon} />
                <span className={styles.contactLabel}>Dirección:</span>
              </Box>
              {' '}
              Barracas, Buenos Aires, Argentina. CP1288
            </Typography>
            
            <Typography 
              variant="body1" 
              component="p" 
              className={styles.contactItem}
              sx={{ color: '#FFFFFF' }}
            >
              <Box component="span" className={styles.contactLabelWrapper}>
                <EmailIcon className={styles.contactIcon} />
                <span className={styles.contactLabel}>Email:</span>
              </Box>
              {' '}
              <Link 
                href="mailto:info@riderbross.com" 
                className={styles.contactLink}
                style={{ color: '#FFFFFF', textDecoration: 'none' }}
              >
                info@riderbross.com
              </Link>
            </Typography>
          </Box>

          {/* Iconos de Redes Sociales */}
          <Box className={styles.socialContainer}>
          <Link 
            href="https://www.instagram.com/rider.bross/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIconLink}
            aria-label="Instagram de RiderBross"
          >
            <Box className={`${styles.socialIcon} ${styles.instagramIcon}`}>
              <InstagramIcon fontSize="large" />
            </Box>
          </Link>
          
          <Link 
            href="https://www.facebook.com/profile.php?id=100093746441652" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIconLink}
            aria-label="Facebook de RiderBross"
          >
            <Box className={`${styles.socialIcon} ${styles.facebookIcon}`}>
              <FacebookIcon fontSize="large" />
            </Box>
          </Link>
          
          <Link 
            href="https://www.youtube.com/@RiderBross" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialIconLink}
            aria-label="YouTube de RiderBross"
          >
            <Box className={`${styles.socialIcon} ${styles.youtubeIcon}`}>
              <YouTubeIcon fontSize="large" />
            </Box>
          </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

