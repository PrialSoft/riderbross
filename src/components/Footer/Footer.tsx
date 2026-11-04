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
                width={120}
                height={100}
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
                href="tel:+34602429438" 
                className={styles.contactLink}
                style={{ color: '#FFFFFF', textDecoration: 'none' }}
              >
                +34 602 429438
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
              Calle Gomera, 6, Fuengirola, Málaga, España
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

          {/* Columna 3: Cómo llegar */}
          <Box className={styles.rightColumn}>
            <Typography
              variant="h6"
              component="h3"
              className={styles.sectionTitle}
            >
              Cómo llegar
            </Typography>
            <Link
              href="https://www.google.com/maps/place/Rider+Bross/@36.5483141,-4.6284605,20z/data=!4m15!1m8!3m7!1s0xd72e2396a652e31:0x183645f55547671b!2sC.+Gomera,+5,+29640+Fuengirola,+M%C3%A1laga,+Espa%C3%B1a!3b1!8m2!3d36.5482507!4d-4.628345!16s%2Fg%2F11pw1cnqsn!3m5!1s0xd72e3d9d4a83bc7:0x78b55183b59d57ac!8m2!3d36.548315!4d-4.6281907!16s%2Fg%2F11z_62yws9"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapContainerLink}
              aria-label="Abrir ubicación de RiderBross en Google Maps"
            >
              <Box className={styles.mapContainer}>
                <iframe
                  title="Ubicación RiderBross en Google Maps"
                  className={styles.mapIframe}
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d200.32753156409035!2d-4.628188442428996!3d36.54831355820713!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72e3d9d4a83bc7%3A0x78b55183b59d57ac!2sRider%20Bross!5e0!3m2!1ses-419!2sar!4v1793819998345!5m2!1ses-419!2sar"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </Box>
            </Link>
          </Box>
        </Box>

        {/* Línea de Copyright */}
        <Box className={styles.copyrightContainer}>
          <Typography 
            variant="body2" 
            className={styles.copyrightText}
            sx={{ color: '#FFFFFF' }}
            component="div"
          >
            <span>Rider Bross 2026 - Todos los derechos reservados</span>
            <span className={styles.copyrightSeparator}> | </span>
            <span>Developed By: PrialSoft</span>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

