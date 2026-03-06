'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  Container,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Stack,
  Paper,
} from '@mui/material';
import CustomButton from '@/utils/ui/button/CustomButton';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dayjs from '@/lib/dayjs';
import { supabase } from '@/lib/supabase/client';
import { DataTable } from '@/utils/ui/table/DataTable';
import { formatPatente, cleanPatente } from '@/utils/patente';
import { generateServicePdf } from '@/utils/pdf/generateServicePdf';
import { EmailDialog } from '@/components/EmailDialog/EmailDialog';
import styles from './page.module.css';

interface ServicioPublico {
  id: number;
  fechaservicio?: string | null;
  kmservicio?: number | null;
  calificacion?: number | null;
  clienteNombre?: string | null;
  clienteEmail?: string | null;
  Vehiculo: {
    patente: string;
    modelo: string;
    Marcas: {
      descripcion: string;
    };
  } | null;
}

interface VehiculoInfo {
  id: number;
  patente: string;
  modelo: string | null;
  kmactual: number | null;
  Marcas?: {
    id: number;
    descripcion: string;
  } | null;
  Clientes?: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string | null;
  } | null;
}

function ConsultaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patenteParam = searchParams.get('patente');
  
  const [servicios, setServicios] = useState<ServicioPublico[]>([]);
  const [vehiculo, setVehiculo] = useState<VehiculoInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'search' | 'results'>('search');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<ServicioPublico | null>(null);


  // Cargar datos iniciales solo si estamos en modo búsqueda
  useEffect(() => {
    if (viewMode === 'search' && !patenteParam) {
      fetchServicios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si hay patente en la URL, buscar automáticamente
  useEffect(() => {
    if (patenteParam) {
      const patenteClean = cleanPatente(patenteParam);
      setSearchTerm(formatPatente(patenteClean));
      buscarPorPatente(patenteClean);
    }
  }, [patenteParam]);

  const buscarPorPatente = async (patenteClean: string) => {
    try {
      setLoading(true);
      setError(null);
      setViewMode('results');

      // Buscar vehículo por patente
      const { data: vehiculoData, error: vehiculoError } = await supabase
        .from('vehiculo')
        .select('id, patente, modelo, kmactual, idmarca, idcliente')
        .eq('patente', patenteClean)
        .single();

      if (vehiculoError || !vehiculoData) {
        setError('No se encontró ningún vehículo con ese dominio');
        setVehiculo(null);
        setServicios([]);
        setHasSearched(true);
        setViewMode('search');
        setLoading(false);
        return;
      }

      // Traer marca y cliente
      const marcaId = vehiculoData.idmarca;
      const clienteId = vehiculoData.idcliente;

      let marca = null;
      let cliente = null;

      if (marcaId) {
        const { data: marcaData } = await supabase
          .from('marcas')
          .select('id, descripcion')
          .eq('id', marcaId)
          .single();
        marca = marcaData;
      }

      if (clienteId) {
        const { data: clienteData } = await supabase
          .from('clientes')
          .select('id, nombres, apellidos, email')
          .eq('id', clienteId)
          .single();
        cliente = clienteData;
      }

      setVehiculo({
        id: vehiculoData.id,
        patente: vehiculoData.patente,
        modelo: vehiculoData.modelo,
        kmactual: vehiculoData.kmactual,
        Marcas: marca,
        Clientes: cliente,
      });

      // Buscar servicios del vehículo
      const { data: serviciosData, error: serviciosError } = await supabase
        .from('servicios')
        .select('id, fechaservicio, kmservicio, calificacion, idcliente')
        .eq('idvehiculo', vehiculoData.id)
        .order('fechaservicio', { ascending: false });

      if (serviciosError) {
        console.error('Error fetching servicios:', serviciosError);
        setError('Error al cargar los servicios');
        setLoading(false);
        return;
      }

      // Mapear servicios con información del vehículo y cliente
      const serviciosMapped: ServicioPublico[] = (serviciosData ?? []).map((s) => {
        const servicioRow = s as {
          id: number;
          fechaservicio?: string | null;
          kmservicio?: number | null;
          calificacion?: number | null;
          idcliente?: number | null;
        };

        // Usar el cliente del servicio si tiene, sino el del vehículo
        const clienteIdServicio = servicioRow.idcliente ?? clienteId;
        const clienteFinal = clienteIdServicio === clienteId ? cliente : null;

        return {
          id: servicioRow.id,
          fechaservicio: servicioRow.fechaservicio,
          kmservicio: servicioRow.kmservicio,
          calificacion: servicioRow.calificacion,
          clienteNombre: clienteFinal
            ? `${clienteFinal.apellidos}, ${clienteFinal.nombres}`
            : null,
          clienteEmail: clienteFinal?.email ?? null,
          Vehiculo: {
            patente: vehiculoData.patente,
            modelo: vehiculoData.modelo ?? '',
            Marcas: { descripcion: marca?.descripcion ?? '' },
          },
        };
      });

      setServicios(serviciosMapped);
    } catch (err) {
      console.error('Error:', err);
      setError('Ocurrió un error al consultar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setHasSearched(true);
    
    if (!searchTerm.trim()) {
      setServicios([]);
      setVehiculo(null);
      setViewMode('search');
      return;
    }

    // Limpiar patente y buscar
    const patenteClean = cleanPatente(searchTerm);
    buscarPorPatente(patenteClean);
    
    // Actualizar URL sin recargar
    router.push(`/consulta?patente=${patenteClean}`, { scroll: false });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };


  // Limpiar resultados cuando se modifica el término de búsqueda
  useEffect(() => {
    if (viewMode === 'results' && searchTerm.trim() === '') {
      setViewMode('search');
      setServicios([]);
      setVehiculo(null);
    }
  }, [searchTerm, viewMode]);

  const fetchServicios = async () => {
    // Esta función ya no es necesaria en el modo unificado
    // La búsqueda se hace directamente con buscarPorPatente
    setLoading(false);
  };

  const downloadPdf = async (row: ServicioPublico) => {
    try {
      await generateServicePdf(row.id);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  const handleSendEmail = (row: ServicioPublico) => {
    setSelectedServicio(row);
    setEmailDialogOpen(true);
  };

  const columns: ColumnDef<ServicioPublico>[] = [
    {
      accessorKey: 'Vehiculo.patente',
      header: 'Dominio',
      cell: ({ row }) => {
        const vehiculo = row.original.Vehiculo;
        return vehiculo ? formatPatente(vehiculo.patente) : 'N/A';
      },
    },
    {
      accessorKey: 'Vehiculo',
      header: 'Vehículo',
      cell: ({ row }) => {
        const vehiculo = row.original.Vehiculo;
        if (!vehiculo) return 'N/A';
        const marca = vehiculo.Marcas?.descripcion || '';
        return `${marca} ${vehiculo.modelo || ''}`.trim();
      },
    },
    {
      accessorKey: 'clienteNombre',
      header: 'Cliente',
      cell: ({ row }) => row.original.clienteNombre || '—',
    },
    {
      accessorKey: 'fechaservicio',
      header: 'Fecha',
      cell: ({ row }) => {
        const f = row.original.fechaservicio;
        return f ? dayjs(f).format('DD/MM/YYYY') : '—';
      },
    },
    {
      accessorKey: 'kmservicio',
      header: 'KM',
      cell: ({ row }) => {
        const km = row.original.kmservicio;
        return typeof km === 'number' ? km.toLocaleString('es-AR') : '—';
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Enviar por email">
              <IconButton
                size="small"
                onClick={() => handleSendEmail(row.original)}
                sx={{
                  color: 'var(--text-primary)',
                  '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.1)' },
                }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descargar PDF">
              <IconButton
                size="small"
                onClick={() => downloadPdf(row.original)}
                sx={{
                  color: 'var(--text-primary)',
                  '&:hover': { backgroundColor: 'rgba(139, 26, 26, 0.1)' },
                }}
              >
                <PictureAsPdfIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  if (loading && !patenteParam) {
    return (
      <Box className={styles.pageWrapper}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={48} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Cargando servicios...
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }


  return (
    <Box className={styles.pageWrapper}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        {/* Título */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" className={styles.pageTitle}>
            Consultar Servicios
          </Typography>
          {viewMode === 'results' && vehiculo && (
            <Typography variant="body1" className={styles.pageSubtitle}>
              Dominio: <strong>{formatPatente(vehiculo.patente)}</strong>
            </Typography>
          )}
          <Typography variant="body1" className={styles.pageDescription}>
            Busca y consulta tu historial de servicios realizados
          </Typography>
        </Box>

        {/* Buscador por patente exacta */}
        <Box sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="stretch">
            <TextField
              fullWidth
              size="small"
              placeholder="Ingrese el dominio (Ej: A-111-BBB O AAA-111)"
              value={searchTerm}
              onChange={(event) => {
                const raw = event.target.value;
                // Aplicar máscara mientras el usuario escribe
                const formatted = formatPatente(raw);
                setSearchTerm(formatted);
                // Limpiar resultados mientras escribe
                if (viewMode === 'results') {
                  setServicios([]);
                  setVehiculo(null);
                  setViewMode('search');
                }
              }}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 9, // Máximo con máscara: 7 caracteres + 2 guiones = 9
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& input': {
                  textTransform: 'uppercase',
                },
              }}
            />
            <CustomButton
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{ minWidth: { xs: '100%', sm: '150px' } }}
            >
              BUSCAR
            </CustomButton>
          </Stack>
        </Box>

        {/* Mensaje de error debajo del buscador */}
        {error && !vehiculo && hasSearched && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Resultados */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : servicios.length === 0 && (hasSearched || viewMode === 'results') && !error ? (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(139, 26, 26, 0.1) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.1) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {viewMode === 'results' && vehiculo
                ? 'No se encontraron servicios registrados para este vehículo.'
                : 'No se encontraron servicios para el dominio ingresado.'}
            </Typography>
          </Paper>
        ) : servicios.length > 0 ? (
          <DataTable columns={columns} data={servicios} searchable={false} />
        ) : null}
      </Container>
      {selectedServicio && (
        <EmailDialog
          open={emailDialogOpen}
          onClose={() => {
            setEmailDialogOpen(false);
            setSelectedServicio(null);
          }}
          servicioId={selectedServicio.id}
          patente={selectedServicio.Vehiculo?.patente || ''}
          clienteNombre={selectedServicio.clienteNombre || null}
          clienteEmail={selectedServicio.clienteEmail || null}
        />
      )}
    </Box>
  );
}

export default function ConsultaPage() {
  return (
    <Suspense
      fallback={
        <Box className={styles.pageWrapper}>
          <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={48} />
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  Cargando...
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      }
    >
      <ConsultaPageContent />
    </Suspense>
  );
}
