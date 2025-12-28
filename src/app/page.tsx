'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import SpeedIcon from '@mui/icons-material/Speed';
import styles from './page.module.css';

export default function Home() {
  const [patente, setPatente] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar formato de patente (ej: A160PXS)
    const patenteClean = patente.trim().toUpperCase().replace(/\s/g, '');
    
    if (!patenteClean) {
      setError('Por favor ingresa una patente');
      return;
    }

    if (patenteClean.length < 6 || patenteClean.length > 8) {
      setError('La patente debe tener entre 6 y 8 caracteres');
      return;
    }

    // Redirigir a la página de consulta
    router.push(`/consulta/${patenteClean}`);
  };

  const servicios = [
    {
      icon: <BuildIcon sx={{ fontSize: 48 }} />,
      title: 'Servicio Técnico',
      description: 'Mantenimiento completo y reparación de motocicletas con técnicos especializados.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: 'Diagnóstico',
      description: 'Revisión exhaustiva de sistemas: batería, iluminación, transmisión, frenos y más.',
    },
    {
      icon: <TwoWheelerIcon sx={{ fontSize: 48 }} />,
      title: 'Mantenimiento',
      description: 'Aceite, válvulas, filtros y todos los servicios necesarios para tu moto.',
    },
  ];

  return (
    <Box className={styles.pageWrapper}>
      {/* Hero Section */}
      <Box className={styles.hero}>
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 2, width: '100%', px: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              textAlign: 'center',
              pt: 0,
              pb: { xs: 4, md: 6 },
              color: 'white',
              position: 'relative',
              zIndex: 2,
              minHeight: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: { xs: 4, md: 5 },
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Image
                src="/images/LogoRiderBross.png"
                alt="RiderBross Logo"
                width={900}
                height={900}
                priority
                style={{
                  maxWidth: '95%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(139, 26, 26, 0.5))',
                  position: 'relative',
                  zIndex: 2,
                }}
              />
            </Box>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 0,
                mt: { xs: 0, md: 1 },
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' },
                fontFamily: 'var(--font-family-body)',
                textTransform: 'uppercase',
                textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(139, 26, 26, 0.6)',
                position: 'relative',
                zIndex: 2,
                lineHeight: 1.2,
                width: '100%',
                mx: 'auto',
                px: { xs: 2, md: 4 },
                textAlign: 'center',
                whiteSpace: { xs: 'normal', md: 'nowrap' },
                display: 'block',
                margin: '0 auto',
              }}
            >
              Tu pasión merece precisión. Tu seguridad, excelencia.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Sección de Contenido - Requiere Scroll */}
      <Box sx={{ backgroundColor: 'transparent', py: { xs: 6, md: 8 }, position: 'relative' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.2) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.2) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              borderRadius: 'var(--border-radius-lg)',
              p: { xs: 3, md: 4 },
              mb: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                mb: 0,
                fontWeight: 400,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                color: 'white',
                textAlign: 'center',
                maxWidth: '900px',
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              Nuestro equipo de expertos apasionados por las motos sabe lo importante que es para vos la seguridad y el rendimiento de tu vehículo. Nos comprometemos a brindarte un servicio distinguido que garantiza que tu moto funcione a la perfección en todo momento.
            </Typography>
          </Box>

          {/* Pilares de la Empresa */}
          <Box className={styles.pilaresSection}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                maxWidth: '1200px',
                mx: 'auto',
                mt: { xs: 4, md: 6 },
                mb: { xs: 4, md: 6 },
                px: { xs: 2, md: 0 },
                position: 'relative',
                zIndex: 2,
              }}
            >
            <Box
              sx={{
                flex: { md: 1 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
                    backdropFilter: 'blur(15px)',
                    border: 'none',
                    borderRadius: 'var(--border-radius-lg)',
                    p: { xs: 2.5, md: 3 },
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    transition: 'box-shadow 0.5s ease, background 0.5s ease, transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(0)',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      lineHeight: 1,
                      mt: 0.5,
                    }}
                  >
                    _
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'var(--primary)',
                        mb: 0.5,
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        fontFamily: 'var(--font-family-body)',
                        position: 'relative',
                        pb: 0.5,
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
                          borderRadius: 'var(--border-radius-full)',
                          transition: 'all 0.5s ease',
                        },
                      }}
                    >
                      Ingeniería de Confianza:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'white',
                        fontSize: { xs: '1.0625rem', md: '1.125rem' },
                        lineHeight: 1.7,
                      }}
                    >
                      Técnicos apasionados que tratan cada moto como propia.
                    </Typography>
                  </Box>
                </Box>
            </Box>

            <Box
              sx={{
                flex: { md: 1 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
                  backdropFilter: 'blur(15px)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-lg)',
                  p: { xs: 2.5, md: 3 },
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    lineHeight: 1,
                    mt: 0.5,
                  }}
                >
                  _
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: 'var(--primary)',
                      mb: 0.5,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontFamily: 'var(--font-family-body)',
                      position: 'relative',
                      pb: 0.5,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
                        borderRadius: 'var(--border-radius-full)',
                        transition: 'all 0.5s ease',
                      },
                    }}
                  >
                    Mantenimiento Preventivo Digital:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      fontSize: { xs: '1.0625rem', md: '1.125rem' },
                      lineHeight: 1.7,
                    }}
                  >
                    Fichas técnicas detalladas (batería, válvulas, fluidos y más...) accesibles desde tu móvil.
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                flex: { md: 1 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
                    backdropFilter: 'blur(15px)',
                    border: 'none',
                    borderRadius: 'var(--border-radius-lg)',
                    p: { xs: 2.5, md: 3 },
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    transition: 'box-shadow 0.5s ease, background 0.5s ease, transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(0)',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      lineHeight: 1,
                      mt: 0.5,
                    }}
                  >
                    _
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: 'var(--primary)',
                        mb: 0.5,
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        fontFamily: 'var(--font-family-body)',
                        position: 'relative',
                        pb: 0.5,
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
                          borderRadius: 'var(--border-radius-full)',
                          transition: 'all 0.5s ease',
                        },
                      }}
                    >
                      Compromiso RiderBross:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'white',
                        fontSize: { xs: '1.0625rem', md: '1.125rem' },
                        lineHeight: 1.7,
                      }}
                    >
                      Calidad en repuestos y entrega en tiempo récord.
                    </Typography>
                  </Box>
                </Box>
            </Box>
            </Box>
          </Box>

          {/* Box de Contacto */}
          <Box
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              mb: 6,
            }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.2) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.2) 100%)',
                backdropFilter: 'blur(15px)',
                border: 'none',
                borderRadius: 'var(--border-radius-lg)',
                p: { xs: 3, md: 4 },
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: 'white',
                  fontSize: { xs: '1.125rem', md: '1.5rem' },
                }}
              >
                ¡Contactá con nosotros y descubrí cómo podemos mantener tu moto en su mejor estado!
              </Typography>
              <Button
                variant="contained"
                size="large"
                href="tel:+5491123456789"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'white',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    backgroundColor: 'var(--primary-dark)',
                    color: 'white',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Contactanos
              </Button>
            </Card>
          </Box>

          {/* Buscador de Patente */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-xl)',
                  p: { xs: 2, sm: 3 },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    Consulta el Estado de tu Moto
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Patente"
                      placeholder="Ej: A160PXS"
                      value={patente}
                      onChange={(e) => {
                        setPatente(e.target.value.toUpperCase());
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: { xs: '1rem', sm: '1.125rem' },
                          '& input': {
                            textTransform: 'uppercase',
                          },
                        },
                      }}
                      inputProps={{
                        maxLength: 8,
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        py: 1.5,
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        fontWeight: 600,
                        transition: 'all 0.5s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(139, 26, 26, 0.4)',
                        },
                      }}
                    >
                      Buscar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
        </Container>
      </Box>

      {/* Servicios Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontFamily: 'var(--font-family-body)',
          }}
        >
          Nuestros Servicios
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          {servicios.map((servicio, index) => (
            <Box
              key={index}
              sx={{
                flex: { md: 1 },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.5s ease, transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 'var(--shadow-xl)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                  }}
                >
                  <Box
                    sx={{
                      color: 'var(--primary)',
                      mb: 2,
                    }}
                  >
                    {servicio.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontSize: { xs: '1.375rem', sm: '1.5rem', md: '1.75rem' },
                      fontFamily: 'var(--font-family-body)',
                      lineHeight: 1.3,
                    }}
                  >
                    {servicio.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {servicio.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: 'var(--bg-secondary)',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              ¿Necesitas Servicio Técnico?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.125rem' } }}
            >
              Contacta con nosotros para agendar tu servicio o consultar más información
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="tel:+5491123456789"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: { xs: '1rem', md: '1.125rem' },
                        transition: 'all 0.5s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(139, 26, 26, 0.4)',
                },
              }}
            >
              Contactar
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
