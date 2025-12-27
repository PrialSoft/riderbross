'use client';

import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CalendarToday,
  ArrowBack,
  DirectionsBike,
  Lightbulb,
  OilBarrel,
  WaterDrop,
  Link as CadenaIcon,
  StopCircle,
  BatteryChargingFull,
  FilterAlt,
  Straighten,
  CheckCircle,
} from '@mui/icons-material';
import styles from './page.module.css';

// Datos de la entrada del blog
const blogPost = {
  slug: 'revisiones-basicas-moto-vacaciones',
  title: '10 revisiones básicas antes de salir de vacaciones con tu moto',
  date: '2024-07-04',
  category: 'Mantenimiento',
  content: {
    introduction: `Comienzan las **vacaciones** y muchos ya tenéis perfectamente planeado vuestro **viaje en moto**. Entendemos que estés loco por arrancar e iniciar tu travesía, pero te proponemos que repases antes con nosotros si tienes hechas las **10 revisiones básicas**. Podrás evitar muchos disgustos y gastos innecesarios en ruta.`,
    sections: [
      {
        id: 'ruedas',
        icon: <DirectionsBike sx={{ fontSize: 48 }} />,
        title: 'RUEDAS',
        subtitle: 'Te llevarán al fin del mundo si están en perfecto estado. Si no lo están, puedes dar con tus huesos en la carretera ya que tu calidad de frenada será peor. Frenarás menos y con menos rapidez. Piensa en ello cuando estés surcando una curva.',
        whatToCheck: [
          'Lo primero la **presión del neumático**. Es una comprobación rutinaria que hay que hacer al menos una vez al mes, pero si te vas de vacaciones y vas a iniciar un viaje largo es obligado que antes de ponerte en marcha lo compruebes. La presión del neumático **se mide en frío y en un terreno plano para evitar medidas incorrectas**. Si no te acuerdas, nada de hacerlo a ojo. **Consulta el manual del fabricante para ser preciso**.',
          'Lo segundo la **profundidad del dibujo**. El **mínimo legal son 1.6 milímetros**. Por debajo de esta medida te arriesgas a no pasar la ITV, y lo que es peor, a tener un accidente. Si lo llevas a un taller te pondrán un profundímetro, pero también es perfectamente posible que lo hagas tú. Los fabricantes de ruedas les ponen un **testigo o marca en el fondo del dibujo de la rueda**. Si ves que esa marca está al mismo nivel que el dibujo tienes que cambiar el neumático sin demora.',
          'Lo tercero, y último, el **estado de la cubierta**. A veces la presión es correcta y la profundidad del dibujo también, pero el estado de la cubierta no. **Excesivo sol, agua, humedad o un mal almacenamiento puede hacer que un neumático se acartone y pierda elasticidad**. Un truco para comprobarlo es presionar con la uña ligeramente. Si vemos que la uña queda marcada unos momentos y desaparece no habrá problema. Si no desaparece, es hora de pensar en un cambio.',
        ],
        consequences: [
          'Unas ruedas con una **presión por debajo** de lo recomendado harán que presentes **mayor resistencia al aire** y tu contacto con el suelo sea mayor del necesario. No solo **gastarás más combustible**, contaminarás más y **desgastarás las ruedas de manera incorrecta** (por los lados), sino que también **aumentarás la distancia de frenado**.',
          'Al contrario, unas **ruedas con una presión por encima** reducirán peligrosamente el contacto con el suelo lo que aumenta drásticamente el riesgo de **pérdida de control** en la conducción y **reventones** ya que las **ruedas tienden a desgastarse mucho más por el centro**.',
          'Finalmente, unas **ruedas con el dibujo o la huella desgastada** hará que tengas **menos agarre** y también que aumente la posibilidad de que hagas **aquaplaning** porque tu rueda no podrá desalojar el agua cuando circules por pavimento mojado.',
        ],
      },
      {
        id: 'luces',
        icon: <Lightbulb sx={{ fontSize: 48 }} />,
        title: 'LUCES',
        subtitle: 'Ver y ser visto es fundamental en la carretera. Si hablamos de una moto que, de por sí, tiene menos envergadura que un coche y también menos luces, su revisión es inexcusable.',
        whatToCheck: [
          'Muy fácil. Haz un **repaso de todas las luces antes de ponerte en marcha**. Si ves que alguna falla, descarta si es de la bombilla en sí o hay algún problema eléctrico. Todas y cada una de las luces de un vehículo cumplen una función, así que no prescindas de ninguna y lleva repuestos, por si acaso.',
        ],
        consequences: [
          'Evidentemente tener un accidente por falta de visibilidad. Además, si te para la Policía, te multará. **Pilotar sin luces está considerado una infracción que supone una multa de 200 euros**.',
        ],
      },
      {
        id: 'aceite',
        icon: <OilBarrel sx={{ fontSize: 48 }} />,
        title: 'ACEITE',
        subtitle: 'El aceite es el encargado de **proteger la parte interna del motor**, de mantenerlo lubricado y evitar así daños por fricción excesiva. De él depende en gran medida la buena vida y hasta la supervivencia del motor, el corazón de tu moto.',
        whatToCheck: [
          'Tienes que ver que el **nivel de aceite** es el adecuado, especialmente en épocas de verano ya que puedes notar que la pérdida de aceite es mayor. Eso se debe a que este líquido también se evapora por acción del calor. Esto es especialmente importante en una **moto** ya que, como sabrás, **el cárter tiene bastante menos capacidad que en un coche**. Como primera regla, pon tu moto recta para que la medida sea correcta y mide el nivel en frío.',
          'Dependiendo de la marca y modelo de tu moto, tendrás que hacerlo a través de un visor o con una varilla como en los coches. Sea como sea, lo importante es que el nivel esté comprendido entre el **máximo y el mínimo**. Tan malo es llevar aceite de más como de menos.',
          'Muchas veces surge la duda de cuándo hacer un **cambio de aceite completo**. Depende del tipo de moto que tengas, pero como norma general hay una horquilla **entre los 2.000 y 5.000 kilómetros**.',
        ],
        consequences: [
          'Si no cambias el aceite cuando corresponde, el motor puede sufrir daños graves por falta de lubricación, lo que puede llevar a reparaciones costosas o incluso a la necesidad de cambiar el motor completo.',
        ],
      },
      {
        id: 'refrigerante',
        icon: <WaterDrop sx={{ fontSize: 48 }} />,
        title: 'LÍQUIDO REFRIGERANTE',
        subtitle: 'El líquido refrigerante es esencial para mantener la temperatura del motor bajo control, especialmente en viajes largos o en condiciones de calor extremo.',
        whatToCheck: [
          'Revisión mensual del nivel, color y duración. El nivel de líquido refrigerante debe estar entre un máximo y un mínimo que medirás en el vaso de expansión que suele ser transparente.',
          'Comprueba que el color del líquido sea el adecuado según las especificaciones del fabricante. Si está turbio o ha cambiado de color, es momento de cambiarlo.',
        ],
        consequences: [
          'Un nivel bajo de refrigerante puede causar sobrecalentamiento del motor, lo que puede llevar a daños graves e incluso a que el motor se gripe.',
        ],
      },
      {
        id: 'cadena',
        icon: <CadenaIcon sx={{ fontSize: 48 }} />,
        title: 'CADENA',
        subtitle: 'Es el tipo de transmisión secundaria más común en las motos y **trabaja para dar potencia al motor**. Es seguramente la parte de tu moto que más mimo y cuidado requiere.',
        whatToCheck: [
          'Con las cadenas hablamos de **limpiar, engrasar y tensar**. Si te olvidas de hacer cualquiera de las tres tendrás problemas, seguro. Limpiar antes de engrasar para que elimines bien toda la suciedad, engrasar lo justo con la moto parada sin dejar pasar más de **1.000 kilómetros** sin hacerlo (**si le das mucha caña a tu moto, tendrás que hacerlo cada 500**) y, por último, tensar.',
        ],
        consequences: [
          'Los expertos consideran que una cadena de moto mal engrasada y destensada dura hasta siete veces menos. Además, ten en cuenta que la cadena **permite hacer el giro a la rueda trasera**. Puedes tener un accidente de los gordos si tienes un fallo en la cadena en pleno viaje.',
        ],
      },
      {
        id: 'frenos',
        icon: <StopCircle sx={{ fontSize: 48 }} />,
        title: 'FRENOS',
        subtitle: 'Los frenos son uno de los sistemas de seguridad más críticos de tu moto. Su correcto funcionamiento puede ser la diferencia entre llegar a tu destino o tener un accidente.',
        whatToCheck: [
          'Revisión integral de los frenos de tu moto incluirá latiguillos, pinzas, pistones, manetas, palanca, bomba, pastillas, discos y líquido.',
          'Comprueba el grosor de las pastillas de freno. Si están muy desgastadas, cámbialas antes del viaje.',
          'Verifica el nivel del líquido de frenos y su estado. Si está oscuro o tiene más de dos años, es momento de cambiarlo.',
        ],
        consequences: [
          'Unos frenos en mal estado pueden aumentar drásticamente la distancia de frenado y poner en peligro tu vida y la de otros usuarios de la carretera.',
        ],
      },
      {
        id: 'bateria',
        icon: <BatteryChargingFull sx={{ fontSize: 48 }} />,
        title: 'BATERÍA',
        subtitle: 'La batería es el corazón eléctrico de tu moto. Sin ella, no podrás arrancar y muchos sistemas eléctricos dejarán de funcionar.',
        whatToCheck: [
          'Revisión de su estado general y el nivel de carga. Es especialmente importante si la moto ha estado parado durante un período largo o si vas a realizar un viaje largo.',
          'Comprueba los terminales de la batería. Deben estar limpios y bien apretados.',
          'Si tu batería tiene tapones, verifica el nivel del electrolito.',
        ],
        consequences: [
          'Una batería descargada o en mal estado te dejará tirado sin posibilidad de arrancar la moto, especialmente problemático si estás en un lugar remoto durante tus vacaciones.',
        ],
      },
      {
        id: 'filtros',
        icon: <FilterAlt sx={{ fontSize: 48 }} />,
        title: 'FILTROS',
        subtitle: 'Los filtros son esenciales para mantener el motor limpio y funcionando correctamente. Un filtro obstruido puede causar problemas de rendimiento y daños al motor.',
        whatToCheck: [
          'Pon un nuevo filtro de aceite cada vez que hagas un cambio de aceite.',
          'Con respecto al filtro del aire, respeta las indicaciones del fabricante para mantenerlo limpio y libre de polvo y suciedad. Si no, se obstruirá.',
          'Si viajas por zonas muy polvorientas, considera cambiar el filtro de aire más frecuentemente.',
        ],
        consequences: [
          'Un filtro de aire obstruido reduce el rendimiento del motor y aumenta el consumo de combustible. Un filtro de aceite en mal estado puede permitir que partículas dañen el motor.',
        ],
      },
      {
        id: 'amortiguadores',
        icon: <Straighten sx={{ fontSize: 48 }} />,
        title: 'AMORTIGUADORES',
        subtitle: 'Los amortiguadores son fundamentales para mantener la estabilidad y el control de tu moto, especialmente en curvas y en terrenos irregulares.',
        whatToCheck: [
          'Puede ser una revisión complicada para hacer por lo que te aconsejamos que lleves tu moto a un taller para que te lo revisen con aparatos específicos que comprueben el estado óptimo de los amortiguadores.',
          'Revisa visualmente si hay fugas de aceite en los amortiguadores.',
          'Comprueba que no haya holguras o ruidos anormales al comprimir la suspensión.',
        ],
        consequences: [
          'En una moto **es especialmente importante no perder la estabilidad en las curvas**. Con unos amortiguadores defectuosos o gastados, puedes verte en problemas y tener un accidente. Además, tendrás dolores de riñones, espalda, brazos y manos por el continuo traqueteo.',
        ],
      },
      {
        id: 'equipamiento',
        icon: <CheckCircle sx={{ fontSize: 48 }} />,
        title: 'EQUIPAMIENTO',
        subtitle: 'Ya tienes tu moto a punto, lista para meterte una buena ración de kilómetros. Ahora tienes que centrarte en el equipamiento, es decir, **cómo te vas a equipar tú para protegerte y minimizar las consecuencias en un posible accidente.**',
        whatToCheck: [
          '**Casco**: Ten claro que tienen fecha de caducidad. Haz una revisión visual en busca de fisuras, grietas, raspaduras profundas o golpes importantes en la calota externa, holguras en el polímero interior, pérdida de la forma original del poliestireno interior, síntomas de envejecimiento en acolchado interior, mal funcionamiento en cierres.',
          '**Chaqueta**: Siempre decántate por modelos especialmente pensados para motoristas ya que están provistos con protecciones. Si vas a hacer un viaje por lugares con una climatología calurosa, quizás lo mejor es que optes por una chaqueta de verano.',
          '**Impermeable**: Si has previsto unas vacaciones por paisajes fríos o lluviosos, no puedes dejar de incluir en tu equipaje un impermeable de moto.',
          '**Guantes**: Cuando te caes lo primero que pones en el suelo para frenarte son las manos. Elígelos también dependiendo del clima al que vas a viajar o, mejor, prevé dos pares.',
          '**Botas**: Seguridad, protección y comodidad. Estas son las máximas que debe cumplir tu calzado de moto que, por supuesto, debe ser especial para tus viajes en moto.',
        ],
        consequences: [
          'Un equipamiento inadecuado puede aumentar significativamente las lesiones en caso de accidente. El equipamiento de protección es tu última línea de defensa.',
        ],
      },
    ],
  },
};

export default function BlogPostPage() {
  return (
    <Box className={styles.pageWrapper}>
      {/* Hero Section */}
      <Box className={styles.hero}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, md: 6 },
              color: 'white',
            }}
          >
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'white',
                textDecoration: 'none',
                marginBottom: '2rem',
                fontSize: '0.9375rem',
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
              Volver al Blog
            </Link>
            <Chip
              label={blogPost.category}
              sx={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontWeight: 600,
                mb: 2,
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontFamily: 'var(--font-family-body)',
                textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(139, 26, 26, 0.6)',
                lineHeight: 1.2,
                color: 'var(--text-primary)',
              }}
            >
              {blogPost.title}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <CalendarToday sx={{ fontSize: 18 }} />
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                {new Date(blogPost.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contenido */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        {/* Introducción */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius-lg)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.8,
              color: 'var(--text-primary)',
            }}
            dangerouslySetInnerHTML={{
              __html: blogPost.content.introduction.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        </Paper>

        {/* Secciones */}
        {blogPost.content.sections.map((section, index) => (
          <Box key={section.id} sx={{ mb: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                backgroundColor: 'var(--bg-dark-secondary)',
                borderRadius: 'var(--border-radius-lg)',
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ color: 'var(--primary)' }}>{section.icon}</Box>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                  lineHeight: 1.7,
                  mb: 3,
                }}
                dangerouslySetInnerHTML={{
                  __html: section.subtitle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
            </Paper>

            {/* Qué hay que revisar */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  mb: 2,
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                }}
              >
                ¿Qué hay que revisar?
              </Typography>
              <List>
                {section.whatToCheck.map((item, itemIndex) => (
                  <ListItem key={itemIndex} sx={{ alignItems: 'flex-start', py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                      <CheckCircle sx={{ color: 'var(--primary)', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: '0.9375rem', md: '1rem' },
                            lineHeight: 1.7,
                            color: 'var(--text-primary)',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                          }}
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Qué me puede pasar */}
            {section.consequences && section.consequences.length > 0 && (
              <Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'var(--primary)',
                    mb: 2,
                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                  }}
                >
                  ¿Qué me puede pasar si no hago la revisión?
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    backgroundColor: 'rgba(139, 26, 26, 0.1)',
                    borderLeft: '4px solid var(--primary)',
                    borderRadius: 'var(--border-radius-md)',
                  }}
                >
                  {section.consequences.map((consequence, consIndex) => (
                    <Typography
                      key={consIndex}
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.9375rem', md: '1rem' },
                        lineHeight: 1.7,
                        color: 'var(--text-primary)',
                        mb: consIndex < section.consequences.length - 1 ? 1.5 : 0,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: consequence.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                      }}
                    />
                  ))}
                </Paper>
              </Box>
            )}

            {index < blogPost.content.sections.length - 1 && (
              <Divider sx={{ mt: 4, mb: 2 }} />
            )}
          </Box>
        ))}

        {/* CTA Final */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mt: 6,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius-lg)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 700,
              color: 'var(--text-primary)',
              mb: 2,
            }}
          >
            ¿Necesitas ayuda profesional?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-secondary)',
              mb: 3,
            }}
          >
            Si prefieres dejar el mantenimiento en manos de expertos, en RiderBross estamos
            especializados en el cuidado de tu moto. Contacta con nosotros para agendar una
            revisión completa.
          </Typography>
          <Link
            href="/consulta"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontWeight: 600,
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
            }}
          >
            Contactar
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}

