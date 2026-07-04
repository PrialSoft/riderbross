import type { Metadata } from 'next';
import { Box, Container, Typography } from '@mui/material';
import CustomButton from '@/utils/ui/button/CustomButton';
import typography from '@/styles/publicPageTypography.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Inspección Pre-compra | RiderBross',
  description:
    'Servicio de inspección pre-compra para motos usadas. Peritaje técnico riguroso e informe detallado para comprar con seguridad.',
};

const revisionItems = [
  {
    title: 'Motor y Transmisión',
    text: 'Ruidos internos, pérdidas de fluidos, estado del embrague, compresión (si aplica) y suavidad de la caja.',
  },
  {
    title: 'Ciclista y Chasis',
    text: 'Alineación del cuadro, estado de los barrales, suspensión trasera, retenes y rodamientos de dirección.',
  },
  {
    title: 'Seguridad Activa',
    text: 'Desgaste y vida útil de los discos/pastillas de freno, estado y fecha de fabricación de los neumáticos.',
  },
  {
    title: 'Sistema Eléctrico',
    text: 'Diagnóstico del sistema de carga, estado real de la batería y funcionamiento de todas las luces y tableros.',
  },
];

const informeBeneficios = [
  'Tomar una decisión inteligente basada en datos reales, no en corazonadas.',
  'Negociar el precio justo con el vendedor si se detectan detalles a reparar.',
  'Planificar el mantenimiento preventivo que necesitará la moto apenas la compres.',
  'Prevención de sorpresas: evita gastos inesperados al conocer el estado real de la moto antes de comprarla.',
];

const testRideCondiciones = [
  'Sujeto a autorización del propietario: el vendedor de la moto está en todo su derecho de decir "no quiero que nadie se suba a mi moto".',
  'Condiciones mínimas de seguridad: el mecánico debe tener la potestad de cancelar la prueba de manejo si al hacer la revisión estática detecta que la moto no es segura para rodar (por ejemplo: frenos totalmente desgastados, cubiertas sin dibujo o con alambres afuera, dirección trabada). Esto también se evalúa como "Malo" en el informe, sin necesidad de arriesgar el físico.',
  'Seguro y documentación: asegurarse de que la moto cuente con la cédula correspondiente y seguro vigente antes de salir a la calle.',
];

export default function InspeccionPreCompraPage() {
  return (
    <Box className={styles.pageWrapper}>
      <Box className={typography.hero}>
        <Container maxWidth="lg">
          <Box className={typography.heroContent}>
            <Typography variant="h1" component="h1" className={typography.heroTitle}>
              Inspección Pre-compra
            </Typography>
            <Typography variant="h5" component="h2" className={typography.heroSubtitle}>
              ¿Estás por comprar una moto usada? No te la juegues.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className={typography.contentSection}>
        <Box className={styles.contentStack}>
          <Box component="section" className={styles.panel}>
            <Typography variant="body1" component="p" className={typography.bodyText}>
              Comprar una moto de segunda mano es una gran decisión, pero también un riesgo si no
              conoces su verdadero estado mecánico y estructural. Un aspecto estético impecable
              puede ocultar fallas costosas o desgastes peligrosos.
            </Typography>
            <Typography variant="body1" component="p" className={typography.bodyText}>
              Evita sorpresas y asegura tu inversión con nuestro Servicio de Inspección
              Pre-Compra.
            </Typography>
          </Box>

          <Box component="section" className={styles.panel}>
            <Typography variant="h3" component="h2" className={typography.panelSectionTitle}>
              ¿Por qué confiar en nosotros?
            </Typography>
            <Box component="ul" className={styles.list}>
              <Box component="li" className={styles.listItem}>
                <strong>Experiencia y Especialización:</strong> Somos técnicos apasionados y
                profesionales con años de trayectoria en el diagnóstico y reparación de
                motovehículos. Conocemos cada componente, las fallas comunes de cada modelo y qué
                mirar exactamente.
              </Box>
              <Box component="li" className={styles.listItem}>
                <strong>Diagnóstico Técnico Riguroso:</strong> No nos quedamos en la superficie.
                Evaluamos a fondo el motor, sistema eléctrico, transmisión, suspensiones, frenos y
                la ciclística general de la unidad.
              </Box>
              <Box component="li" className={styles.listItem}>
                <strong>Imparcialidad Absoluta:</strong> No tenemos compromisos con el vendedor.
                Nuestro único objetivo es brindar un panorama real, honesto y transparente de la
                unidad peritada.
              </Box>
            </Box>
          </Box>

          <Box component="section" className={styles.panel}>
            <Typography variant="h3" component="h2" className={typography.panelSectionTitle}>
              Tu tranquilidad respaldada por un Informe Técnico
            </Typography>
            <Typography variant="body1" component="p" className={typography.bodyText}>
              Al finalizar la inspección, te entregaremos un Informe Técnico Detallado, destacando
              cualquier potencial problema y brindándote una visión clara del estado general.
            </Typography>
            <Typography variant="body1" component="p" className={typography.bodyText}>
              Este documento te servirá para:
            </Typography>
            <Box component="ul" className={styles.list}>
              {informeBeneficios.map((item) => (
                <Box component="li" key={item} className={styles.listItem}>
                  {item}
                </Box>
              ))}
            </Box>
          </Box>

          <Box component="section" className={styles.panel}>
            <Typography variant="h3" component="h2" className={typography.panelSectionTitle}>
              ¿Qué revisamos exactamente?
            </Typography>
            <Box component="ul" className={styles.list}>
              {revisionItems.map((item) => (
                <Box component="li" key={item.title} className={styles.listItem}>
                  <strong>{item.title}:</strong> {item.text}
                </Box>
              ))}
            </Box>

            <Box className={styles.highlightBox}>
              <Typography variant="h5" component="h3" className={typography.cardTitle}>
                Plus Exclusivo: Prueba Dinámica en Calle (Test Ride Técnico)
              </Typography>
              <Typography variant="body1" component="p" className={typography.bodyText}>
                Si el vendedor lo autoriza y las condiciones de seguridad están dadas, realizamos
                una prueba de manejo en calle conducida por nuestro técnico.
              </Typography>
              <Box component="ul" className={styles.noteList}>
                {testRideCondiciones.map((item) => (
                  <Box component="li" key={item} className={styles.noteItem}>
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box component="section" className={`${styles.panel} ${styles.ctaPanel}`}>
            <Typography variant="h3" component="h2" className={typography.sectionTitle}>
              No arriesgues tu inversión ni tu seguridad
            </Typography>
            <Typography variant="body1" component="p" className={typography.bodyTextSecondary}>
              Coordina la inspección con nosotros antes de cerrar el trato y maneja con la
              tranquilidad de saber exactamente qué estás comprando. Contáctanos hoy mismo para
              agendar tu turno.
            </Typography>
            <Box className={styles.ctaActions}>
              <CustomButton variant="contained" size="large" href="tel:+541144242784">
                Llamar ahora
              </CustomButton>
              <CustomButton variant="outlined" size="large" href="/#contacto">
                Contacto
              </CustomButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
