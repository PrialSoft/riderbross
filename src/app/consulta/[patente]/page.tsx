'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from '@/lib/dayjs';
import { supabase } from '@/lib/supabase/client';
import { FichaTecnicaWithMoto } from '@/types/ficha';
import styles from './page.module.css';

export default function ConsultaPatentePage() {
  const params = useParams();
  const router = useRouter();
  const patente = params.patente as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FichaTecnicaWithMoto[] | null>(null);
  const [moto, setMoto] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar motocicleta por patente
        const { data: motoData, error: motoError } = await supabase
          .from('motocicletas')
          .select('*')
          .eq('patente', patente.toUpperCase())
          .single();

        if (motoError || !motoData) {
          setError('No se encontró ninguna motocicleta con esa patente');
          setLoading(false);
          return;
        }

        setMoto(motoData);

        // Buscar fichas técnicas asociadas
        const { data: fichasData, error: fichasError } = await supabase
          .from('fichas_tecnicas')
          .select('*, motocicletas(*)')
          .eq('motocicleta_id', motoData.id)
          .order('fecha_servicio', { ascending: false });

        if (fichasError) {
          console.error('Error fetching fichas:', fichasError);
          setError('Error al cargar las fichas técnicas');
        } else {
          setData(fichasData as FichaTecnicaWithMoto[]);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Ocurrió un error al consultar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (patente) {
      fetchData();
    }
  }, [patente]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} />
            <Typography color="text.secondary">Cargando información...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  if (error || !moto) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'No se encontró información'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          variant="outlined"
        >
          Volver al inicio
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
          Información de la Motocicleta
        </Typography>
        <Typography variant="h5" component="h2" sx={{ color: 'var(--primary)', fontWeight: 600 }}>
          Patente: {moto.patente}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {moto.marca} {moto.modelo} • {moto.km_actual.toLocaleString()} km
        </Typography>
      </Box>

      {/* Timeline de Servicios */}
      {!data || data.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              No se encontraron servicios registrados para esta motocicleta.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box className={styles.timeline}>
          {data.map((ficha, index) => (
            <Box key={ficha.id} className={styles.timelineItem}>
              <Box className={styles.timelineMarker}>
                <Box className={styles.timelineDot} />
                {index < data.length - 1 && <Box className={styles.timelineLine} />}
              </Box>
              <Card className={styles.timelineContent}>
                <CardContent>
                  <Stack spacing={3}>
                    {/* Header del servicio */}
                    <Box>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Box>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                            Servicio Técnico
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(ficha.fecha_servicio).format('DD [de] MMMM [de] YYYY')}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${ficha.km_servicio.toLocaleString()} km`}
                          color="primary"
                          size="small"
                        />
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Checklist de Servicios */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Servicios Realizados
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {ficha.checklist.aceite && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Aceite"
                            color="success"
                            size="small"
                          />
                        )}
                        {ficha.checklist.valvulas && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Válvulas"
                            color="success"
                            size="small"
                          />
                        )}
                        {ficha.checklist.filtros && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Filtros"
                            color="success"
                            size="small"
                          />
                        )}
                        {ficha.checklist.otros?.map((otro, idx) => (
                          <Chip
                            key={idx}
                            icon={<CheckCircleIcon />}
                            label={otro}
                            color="success"
                            size="small"
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* Valores de Batería */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Valores de Batería
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Off
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {ficha.bateria.off}v
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Ignición
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {ficha.bateria.ignicion}v
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Ralentí
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {ficha.bateria.ralenti}v
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            5000 RPM
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {ficha.bateria.rpm_5000}v
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Sistemas */}
                    <Grid container spacing={2}>
                      {/* Iluminación */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Iluminación
                        </Typography>
                        <Stack spacing={0.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {ficha.iluminacion.delantera ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )}
                            <Typography variant="body2">Delantera</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {ficha.iluminacion.trasera ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )}
                            <Typography variant="body2">Trasera</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {ficha.iluminacion.intermitentes ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )}
                            <Typography variant="body2">Intermitentes</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {ficha.iluminacion.stop ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )}
                            <Typography variant="body2">Stop</Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Transmisión */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Transmisión
                        </Typography>
                        <Stack spacing={0.5}>
                          {ficha.transmision.cadena && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon color="success" fontSize="small" />
                              <Typography variant="body2">Cadena</Typography>
                            </Box>
                          )}
                          {ficha.transmision.correa && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon color="success" fontSize="small" />
                              <Typography variant="body2">Correa</Typography>
                            </Box>
                          )}
                          {ficha.transmision.cardan && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon color="success" fontSize="small" />
                              <Typography variant="body2">Cardán</Typography>
                            </Box>
                          )}
                        </Stack>
                      </Grid>

                      {/* Ruedas */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Ruedas (PSI)
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body2">
                            Delantera: <strong>{ficha.ruedas.delantera_psi} PSI</strong>
                          </Typography>
                          <Typography variant="body2">
                            Trasera: <strong>{ficha.ruedas.trasera_psi} PSI</strong>
                          </Typography>
                        </Stack>
                      </Grid>

                      {/* Frenos */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Frenos
                        </Typography>
                        <Stack spacing={0.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {ficha.frenos.delantero ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )}
                            <Typography variant="body2">Delantero</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {ficha.frenos.trasero ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <CancelIcon color="error" fontSize="small" />
                            )}
                            <Typography variant="body2">Trasero</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>

                    {/* Valores de Válvulas */}
                    {ficha.valvulas && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Valores de Válvulas
                        </Typography>
                        <Stack direction="row" spacing={3}>
                          <Typography variant="body2">
                            Admisión: <strong>{ficha.valvulas.admision}</strong>
                          </Typography>
                          <Typography variant="body2">
                            Escape: <strong>{ficha.valvulas.escape}</strong>
                          </Typography>
                        </Stack>
                      </Box>
                    )}

                    {/* Observaciones */}
                    {ficha.observaciones && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Observaciones
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ficha.observaciones}
                        </Typography>
                      </Box>
                    )}

                    {/* Técnico */}
                    {ficha.tecnico && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Técnico: {ficha.tecnico}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}

