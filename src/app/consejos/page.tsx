'use client';

import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import Image from 'next/image';
import styles from './page.module.css';

const consejos = [
  {
    id: 'ruedas',
    icon: '/icons/icono-ruedas-trans.png',
    title: 'RUEDAS',
    description:
      'Revisión al menos una vez al mes y siempre que vayas a hacer un viaje largo de la presión del neumático, profundidad del dibujo y estado de la cubierta.',
  },
  {
    id: 'luces',
    icon: '/icons/icono-luces-trans.png',
    title: 'LUCES',
    description:
      'Revisión de todas las luces antes de ponerte en marcha para descartar si es de la bombilla o hay algún problema eléctrico.',
  },
  {
    id: 'aceite',
    icon: '/icons/icono-aceite-trans.png',
    title: 'ACEITE',
    description:
      'Revisión del nivel de aceite una vez al mes, especialmente en verano, ya que se evapora por acción del calor. El nivel debe estar entre el máximo y el mínimo.',
  },
  {
    id: 'refrigerante',
    icon: '/icons/icono-regriferante-trans.png',
    title: 'LÍQUIDO REFRIGERANTE',
    description:
      'Revisión mensual del nivel, color y duración. El nivel de líquido refrigerante debe estar entre un máximo y un mínimo que medirás en el vaso de expansión que suele ser transparente.',
  },
  {
    id: 'cadena',
    icon: '/icons/icono-cadena-trans.png',
    title: 'CADENA',
    description:
      'Con las cadenas hablamos de limpiar, engrasar y tensar. Si te olvidas de hacer cualquiera de las tres tendrás problemas, seguro.',
  },
  {
    id: 'frenos',
    icon: '/icons/icono-frenos-trans.png',
    title: 'FRENOS',
    description:
      'Revisión integral de los frenos de tu moto incluirá latiguillos, pinzas, pistones, manetas, palanca, bomba, pastillas, discos y líquido.',
  },
  {
    id: 'bateria',
    icon: '/icons/icono-bateria-trans.png',
    title: 'BATERÍA',
    description:
      'Revisión de su estado general y el nivel de carga. Es especialmente importante si la moto ha estado parado durante un período largo o si vas a realizar un viaje largo.',
  },
  {
    id: 'filtros',
    icon: '/icons/icono-filtros-trans.png',
    title: 'FILTROS',
    description:
      'Pon un nuevo filtro de aceite cada vez que hagas un cambio de aceite. Con respecto al filtro del aire, respeta las indicaciones del fabricante para mantenerlo limpio y libre de polvo y suciedad. Si no, se obstruirá.',
  },
];

export default function ConsejosPage() {
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
              Mantenimiento de tu Moto
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
              Qué y cuándo revisar para mantener tu moto en perfectas condiciones
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Introducción */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.2) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.2) 100%)',
            backdropFilter: 'blur(15px)',
            border: 'none',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.7,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-body)',
            }}
          >
            Para muchos motoristas mantener su moto en perfectas condiciones de uso es un placer que se reservan para ellos mismos. No es tanto por no pagar a un taller especializado, sino por el hecho de cuidar con sus propias manos a su fiel compañera de viaje. Quizás tú hasta ahora no te has atrevido porque crees que te llevará mucho tiempo o porque te defines como el típico manazas que no se lleva bien con las herramientas. No obstante, para mantener una moto a punto sólo se necesita un espacio adecuado, planificación, algunos conocimientos y paciencia.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.7,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-body)',
            }}
          >
            En ese sentido, recuerda que lavar y/o arreglar tu moto en la calle está prohibido. Ambas acciones están tipificadas como sanciones medioambientales y, aunque depende de las ordenanzas de cada municipio, puedes terminar pagando una multa de entre 30 y 1.200 euros. Si no dispones de garaje o no tienes un amigo que te preste el suyo para hacer las labores de mantenimiento de tu moto, es mejor no arriesgarse. Puede que la Policía no te vea, pero probablemente a algún vecino no le va a parecer buena idea que cambies el aceite en la calle y te denuncie. Olvídate también de ir al campo o al monte a hacerlo. Sólo conseguirás contaminar una zona verde.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.8,
              color: 'var(--text-primary)',
            }}
          >
            Si, por el contrario, tienes garaje o un sitio adecuado, lo más importante es que planifiques los trabajos de mantenimiento. Es importante que conozcas cuándo es necesario cambiar los diferentes elementos de tu moto para que funcione correctamente y no te deje tirado, por ejemplo, en mitad de un viaje o provoque un accidente. Esto no quiere decir que hasta el momento de la renovación o sustitución no tengas que preocuparte. De hecho, un buen mantenimiento incluye revisiones periódicas de carácter preventivo, o lo que es lo mismo, todas aquellas comprobaciones que pueden alargar la vida de algunos componentes (o al menos que no se desgasten antes de tiempo) y hacer que pilotes en condiciones de seguridad. En este punto no hay excusas. Por muy manazas que seas, tienes que aprender a mirar, hacer y reaccionar.
          </Typography>
        </Paper>

        {/* Título de sección */}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            fontFamily: 'var(--font-family-body)',
          }}
        >
          Revisiones que no deben faltar
        </Typography>

        {/* Grid de Consejos */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'center',
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {consejos.map((consejo) => (
            <Box
              key={consejo.id}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(50% - 16px)' },
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(50% - 16px)' },
                maxWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(50% - 16px)' },
                display: 'flex',
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.5s ease',
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
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={consejo.icon}
                      alt={consejo.title}
                      width={80}
                      height={80}
                      style={{
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 2px 8px rgba(139, 26, 26, 0.5))',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    {consejo.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      fontSize: { xs: '0.9375rem', md: '1rem' },
                      lineHeight: 1.7,
                      flexGrow: 1,
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    {consejo.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

