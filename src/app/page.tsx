'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Stack,
  InputAdornment,
} from '@mui/material';
import CustomButton from '@/utils/ui/button/CustomButton';
import { formatPatente, cleanPatente } from '@/utils/patente';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import SpeedIcon from '@mui/icons-material/Speed';

import styles from './page.module.css';

export default function Home() {
  const [patente, setPatente] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Si hay un hash en la URL (#contacto), hacer scroll al footer
    if (typeof window !== 'undefined' && window.location.hash === '#contacto') {
      setTimeout(() => {
        const footerElement = document.getElementById('contacto');
        if (footerElement) {
          footerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Limpiar patente (quitar guiones y espacios)
    const patenteClean = cleanPatente(patente);
    
    if (!patenteClean) {
      setError('Por favor ingresa una patente');
      return;
    }

    if (patenteClean.length < 6 || patenteClean.length > 8) {
      setError('La patente debe tener entre 6 y 8 caracteres');
      return;
    }

    // Redirigir a la página de consulta con parámetro de patente
    router.push(`/consulta?patente=${patenteClean}`);
  };

  const servicios = [
    {
      icon: <TwoWheelerIcon className={styles.serviceIconSize} />,
      title: 'Mantenimiento Preventivo',
      description: 'Maximizamos la vida útil de tu motor mediante las tablas de mantenimiento y revisiones periódicas de fluidos, filtros y ajustes generales. Rodar seguro comienza con la prevención.',
    },
    {
      icon: <BuildIcon className={styles.serviceIconSize} />,
      title: 'Reparaciones Específicas',
      description: 'Soluciones precisas en motor, frenos, transmisión, suspensiones y electricidad y más. Utilizamos repuestos de alta calidad para devolverle a tu moto su rendimiento original.',
    },
    {
      icon: <SpeedIcon className={styles.serviceIconSize} />,
      title: 'Diagnóstico Avanzado',
      description: 'Identificamos fallas electrónicas y mecánicas con tecnología de precisión. Vamos directo al problema, ahorrándote tiempo y dinero.',
    },
    {
      icon: <SearchIcon className={styles.serviceIconSize} />,
      title: 'Inspección Pre\u2011compra',
      description: '¿Vas a comprar una moto usada? Realizamos un peritaje exhaustivo para que inviertas con total seguridad y sin sorpresas ocultas.',
    },
  ];

  return (
    <Box className={styles.pageWrapper}>
      {/* Hero Section */}
      <Box className={styles.hero}>
        <Container maxWidth={false} className={styles.heroContainer}>
          <Box className={styles.heroContent}>
            <Box className={styles.heroLogoContainer}>
              <Image
                src="/images/LogoRiderBross.png"
                alt="RiderBross Logo"
                width={900}
                height={900}
                priority
                className={styles.heroLogo}
              />
            </Box>
            <Typography variant="h1" component="h1" className={styles.heroTitle}>
              Tu pasión merece precisión. Tu seguridad, excelencia.
            </Typography>
          </Box>
        </Container>
      </Box>


      {/* Sección de Contenido - Requiere Scroll */}
      <Box className={styles.contentSection}>
        <Container maxWidth="lg">
            <Box className={styles.contentBox}>
              <Typography variant="h2" component="h2" className={styles.contentText}>
                Como Riders, entendemos lo que tu moto significa para vos. Por eso, nuestro equipo garantiza seguridad y rendimiento óptimo con un servicio técnico de primer nivel.
              </Typography>
            </Box>

            <Container maxWidth="lg" className={styles.servicesSection}>
            <Typography 
              component="h2" 
              className={styles.servicesTitle}
            >
              Nuestros Servicios
            </Typography>

            <Box className={styles.servicesContainer}>
              {servicios.map((servicio, index) => (
                <Box key={index} className={styles.serviceCardWrapper}>
                  <Card className={styles.serviceCard}>
                    <CardContent className={styles.serviceCardContent}>
                      <Box className={styles.serviceIcon}>
                        {servicio.icon}
                      </Box>
                      <Typography variant="h5" component="h3" className={styles.serviceTitle}>
                        {servicio.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                        {servicio.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Container>


          {/* Buscador de Patente */}
          <Box component="form" onSubmit={handleSearch} className={styles.searchForm}>
            <Card className={styles.searchCard}>
              <CardContent>
                <Typography variant="h3" component="h3" className={styles.searchTitle}>
                  Busca y consulta tu historial de servicios realizados
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Patente"
                    placeholder="Ej: A-111-BBB O AAA-111"
                    value={patente}
                    onChange={(e) => {
                      const raw = e.target.value;
                      // Aplicar máscara mientras el usuario escribe
                      const formatted = formatPatente(raw);
                      setPatente(formatted);
                      setError('');
                    }}
                    error={!!error}
                    helperText={error || 'Ingresa la patente de tu motocicleta'}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      maxLength: 9, // Máximo con máscara: 7 caracteres + 2 guiones = 9
                      style: { textTransform: 'uppercase' },
                    }}
                  />
                  <CustomButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    className={styles.searchButton}
                  >
                    Buscar
                  </CustomButton>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box className={styles.ctaSection}>
        <Container maxWidth="md">
          <Box className={styles.ctaContent}>
            <Typography variant="h4" component="h2" className={styles.ctaTitle}>
              ¿Necesitas Servicio Técnico?
            </Typography>
            <Typography variant="body1" color="text.secondary" className={styles.ctaText}>
              Contacta con nosotros para agendar tu servicio o consultar más información
            </Typography>
            <CustomButton
              variant="contained"
              size="large"
              href="tel:+541144242784"
              className={styles.ctaButton}
            >
              Contactar
            </CustomButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
