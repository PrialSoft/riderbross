'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    <Box 
      component="footer" 
      id="contacto" 
      className={styles.footer}
      sx={{ width: '100%', overflow: 'visible' }}
    >
      <Container 
        maxWidth={false} 
        className={styles.container} 
        sx={{ 
          width: '100% !important', 
          maxWidth: '100% !important',
          paddingLeft: 'var(--spacing-md) !important',
          paddingRight: 'var(--spacing-md) !important'
        }}
      >
        <Box 
          className={styles.footerContent}
        >
          {/* Columna 1: Logo y Redes Sociales */}
          <Box className={styles.leftColumn}>
            <Box className={styles.logoContainer}>
              <Image
                src="/images/LogoRiderBross.png"
                alt="RiderBross Logo"
                width={150}
                height={60}
                className={styles.logo}
                priority
              />
            </Box>
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

          {/* Columna 2: Contacto */}
          <Box 
            className={styles.contactInfo}
            sx={{ 
              color: '#FFFFFF !important',
              '& *': { color: '#FFFFFF !important' },
              '& a': { color: '#FFFFFF !important' },
              display: 'flex !important',
              visibility: 'visible !important',
              opacity: '1 !important'
            }}
          >
            <Typography 
              variant="h6" 
              component="h3"
              className={styles.sectionTitle}
              sx={{ color: '#FFFFFF', mb: 2 }}
            >
              Contacto:
            </Typography>
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

          {/* Columna 3: Vacía (reservada para futuro uso) */}
          <Box className={styles.rightColumn}>
            {/* Columna vacía por ahora */}
          </Box>
        </Box>

        {/* Línea de Copyright */}
        <Box className={styles.copyrightContainer}>
          <Typography 
            variant="body2" 
            className={styles.copyrightText}
            sx={{ color: '#FFFFFF' }}
          >
            RiderBross 2026 - Todos los derechos reservados
            <span className={styles.copyrightSeparator}> | </span>
            Developed By: PrialSoft
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

