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
import typography from '@/styles/publicPageTypography.module.css';

// Datos de las entradas del blog
const blogPosts = [
  {
    slug: 'bateria-como-evitar-muerte-por-falta-uso',
    title: 'Batería: Cómo evitar que muera por falta de uso',
    excerpt:
      'Es un clásico: vas a arrancar la moto después de unos días y solo escuchás un "clic". Las motos modernas tienen consumos constantes (alarmas, tableros, sensores) que agotan la batería aunque la moto esté apagada.',
    date: '2025-12-23',
    category: 'Mantenimiento',
    image: '/images/blog/bateria.jpg',
  },
  {
    slug: 'manual-clave-para-no-gastar-de-mas',
    title: 'El manual: La clave para no gastar de más',
    excerpt:
      'En el taller lo vemos a diario: muchas roturas costosas se evitarían simplemente leyendo el manual. Con motos que cada vez equipan más tecnológica, el manual es tu mejor herramienta.',
    date: '2025-12-22',
    category: 'Consejos',
    image: '/images/blog/manual.jpg',
  },
  {
    slug: 'neumaticos-cuando-cambiarlos-presion-kits-reparacion',
    title: 'Neumáticos: Cuándo cambiarlos, cómo revisar la presión adecuada y kits de reparación de pinchazos',
    excerpt:
      'Las cubiertas son el componente más subestimado de la moto, cuando en realidad son lo único que nos mantiene pegados al piso. Con compuestos cada vez más específicos, entender cómo cuidarlos es fundamental para tu seguridad.',
    date: '2025-12-21',
    category: 'Mantenimiento',
    image: '/images/blog/neumaticos.jpg',
  },
  {
    slug: 'como-limpiar-tensar-cadena-moto-paso-paso',
    title: 'Cómo limpiar y tensar la cadena de tu moto paso a paso',
    excerpt:
      'La cadena es el alma de la tracción de tu moto. Una cadena sucia o floja no solo reduce el rendimiento, sino que puede ser peligrosa. Te enseñamos cómo hacerle un mantenimiento en casa.',
    date: '2025-12-20',
    category: 'Mantenimiento',
    image: '/images/blog/cadena.jpg',
  },
  {
    slug: '5-senales-pastillas-freno-cambio-urgente',
    title: '5 señales de que tus pastillas de freno necesitan cambio urgente',
    excerpt:
      'El sistema de frenado es el componente de seguridad más importante de tu moto. Sin embargo, al ser un desgaste progresivo, muchas veces nos acostumbramos a que frene "un poco menos" hasta que es demasiado tarde.',
    date: '2025-12-19',
    category: 'Mantenimiento',
    image: '/images/blog/pastillas-freno.jpg',
  },
  {
    slug: 'casco-vencido-verdad-que-pocos-te-cuentan',
    title: '¿Tu casco está vencido? La verdad que pocos te cuentan ⚠️',
    excerpt:
      'Muchos motociclistas creen que si el casco no tiene rayones y nunca se golpeó, está como nuevo. Error. El casco tiene "fecha de vencimiento" y usar uno viejo es casi lo mismo que no llevar nada.',
    date: '2025-12-18',
    category: 'Seguridad',
    image: '/images/blog/casco.jpg',
  },
  {
    slug: 'guia-mantenimiento-carburador',
    title: 'Guía de mantenimiento del carburador 🛠️',
    excerpt:
      'El carburador es el encargado de preparar la mezcla de aire y nafta que hace que tu motor cobre vida. En Argentina, debido a las impurezas que a veces trae el combustible, este componente suele ensuciarse más rápido de lo normal.',
    date: '2025-12-17',
    category: 'Mantenimiento',
    image: '/images/blog/carburador.jpg',
  },
  {
    slug: 'moto-parada-revision-puesta-punto',
    title: '¿Tu moto estuvo parada? 5 cosas que debés revisar antes de arrancar 🛠️',
    excerpt:
      'Dejar la moto detenida por semanas o meses no le hace bien. Los fluidos se degradan y los componentes se resecan. Si estás por volver a las pistas, chequeá estos puntos críticos.',
    date: '2025-12-16',
    category: 'Mantenimiento',
    image: '/images/blog/moto-parada.jpg',
  },
  {
    slug: 'guia-cambio-aceite-segun-conduccion',
    title: 'Guía básica: ¿Cada cuánto deberías cambiar el aceite según tu conducción?',
    excerpt:
      'El aceite es la sangre de tu moto. Su función no es solo lubricar, sino también limpiar el motor y ayudar a refrigerarlo. Descubrí cuál es tu perfil de conducción y cuándo te toca visitar el taller.',
    date: '2025-12-15',
    category: 'Mantenimiento',
    image: '/images/blog/cambio-aceite.jpg',
  },
  {
    slug: 'revisiones-basicas-moto-vacaciones',
    title: '10 revisiones básicas antes de salir de vacaciones con tu moto',
    excerpt:
      'Comienzan las vacaciones y muchos ya tenéis perfectamente planeado vuestro viaje en moto. Entendemos que estés loco por arrancar e iniciar tu travesía, pero te proponemos que repases antes con nosotros si tienes hechas las 10 revisiones básicas.',
    date: '2025-07-04',
    category: 'Mantenimiento',
    image: '/images/blog/revisiones-vacaciones.jpg',
  },
];

export default function BlogPage() {
  return (
    <Box className={styles.pageWrapper}>
      {/* Hero Section */}
      <Box className={typography.hero}>
        <Container maxWidth="lg">
          <Box className={typography.heroContent}>
            <Typography variant="h1" component="h1" className={typography.heroTitle}>
              Blog RiderBross
            </Typography>
            <Typography variant="h5" component="h2" className={typography.heroSubtitle}>
              Consejos, tips y guías para mantener tu moto en perfecto estado
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className={`${typography.contentSection} ${styles.postsContainer}`}>
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

