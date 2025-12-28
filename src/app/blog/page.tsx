'use client';

import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
} from '@mui/material';
import { CalendarToday, ArrowForward } from '@mui/icons-material';
import styles from './page.module.css';

// Datos de las entradas del blog
const blogPosts = [
  {
    slug: 'revisiones-basicas-moto-vacaciones',
    title: '10 revisiones básicas antes de salir de vacaciones con tu moto',
    excerpt:
      'Comienzan las vacaciones y muchos ya tenéis perfectamente planeado vuestro viaje en moto. Entendemos que estés loco por arrancar e iniciar tu travesía, pero te proponemos que repases antes con nosotros si tienes hechas las 10 revisiones básicas.',
    date: '2024-07-04',
    category: 'Mantenimiento',
    image: '/images/blog/revisiones-vacaciones.jpg',
  },
];

export default function BlogPage() {
  return (
    <Box className={styles.pageWrapper}>
      {/* Hero Section */}
      <Box className={styles.hero}>
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 6, md: 8 },
              color: 'white',
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontFamily: 'var(--font-family-body)',
                textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(139, 26, 26, 0.6)',
                color: 'var(--text-primary)',
              }}
            >
              Blog RiderBross
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                fontFamily: 'var(--font-family-body)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                maxWidth: '900px',
                mx: 'auto',
                color: 'var(--text-secondary)',
              }}
            >
              Consejos, tips y guías para mantener tu moto en perfecto estado
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Lista de Entradas */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {blogPosts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.slug}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 'var(--shadow-xl)',
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/blog/${post.slug}`}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'stretch',
                    transition: 'all 0.5s ease',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            fontWeight: 600,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            mb: 1,
                            fontSize: { xs: '2.25rem', md: '2.5rem' },
                            lineHeight: 1.25,
                            letterSpacing: '-0.01em',
                            textShadow: '0 2px 10px rgba(0,0,0,0.55)',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: '0.875rem', md: '0.9375rem' },
                            lineHeight: 1.6,
                            mb: 2,
                          }}
                        >
                          {post.excerpt}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 'auto',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'var(--text-secondary)' }} />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.875rem' }}
                          >
                            {new Date(post.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                        <ArrowForward sx={{ fontSize: 20, color: 'var(--primary)' }} />
                      </Box>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

