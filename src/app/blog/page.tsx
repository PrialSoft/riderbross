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
          <Box className={styles.heroContent}>
            <Typography variant="h1" component="h1" className={styles.heroTitle}>
              Blog RiderBross
            </Typography>
            <Typography variant="h5" component="h2" className={styles.heroSubtitle}>
              Consejos, tips y guías para mantener tu moto en perfecto estado
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Lista de Entradas */}
      <Container maxWidth="lg" className={styles.postsContainer}>
        <Grid container spacing={4}>
          {blogPosts.map((post) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={post.slug}>
              <Card className={styles.postCard}>
                <CardActionArea
                  component={Link}
                  href={`/blog/${post.slug}`}
                  className={styles.postCardAction}
                >
                  <CardContent className={styles.postCardContent}>
                    <Stack spacing={2}>
                      <Box>
                        <Chip
                          label={post.category}
                          size="small"
                          className={styles.postCategory}
                        />
                        <Typography variant="h5" component="h3" className={styles.postTitle}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" className={styles.postExcerpt}>
                          {post.excerpt}
                        </Typography>
                      </Box>
                      <Box className={styles.postFooter}>
                        <Box className={styles.postDateContainer}>
                          <CalendarToday className={styles.postDateIcon} />
                          <Typography variant="caption" className={styles.postDate}>
                            {new Date(post.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                        <ArrowForward className={styles.postArrow} />
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

