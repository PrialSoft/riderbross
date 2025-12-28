import { createClient } from '@/lib/supabase/server';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  TwoWheeler as MotosIcon,
  Description as FichasIcon,
  People as ClientesIcon,
} from '@mui/icons-material';
import dayjs from '@/lib/dayjs';
import type { ServicioWithRelations } from '@/types/database';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: vehiculosCount, error: vehiculosError },
    { count: serviciosCount, error: serviciosError },
    { count: clientesCount, error: clientesError },
    { data: serviciosBase, error: serviciosBaseError },
  ] = await Promise.all([
    supabase.from('vehiculo').select('*', { count: 'exact', head: true }),
    supabase.from('servicios').select('*', { count: 'exact', head: true }),
    supabase.from('clientes').select('*', { count: 'exact', head: true }),
    supabase
      .from('servicios')
      // Blindado: evita errores si el esquema de Servicios aún no tiene columnas esperadas
      // (fechaServicio/kmServicio/IdVehiculo/etc). Usamos '*' + orden por Id.
      .select('*')
      .order('id', { ascending: false })
      .limit(5),
  ]);

  // Expandir relaciones manualmente para evitar fallas por FK/relaciones faltantes
  const vehiculoIds = (serviciosBase ?? [])
    .map((s) => (s as { idvehiculo?: number | null }).idvehiculo)
    .filter((id): id is number => typeof id === 'number');

  const vehiculosById = new Map<number, { id: number; patente: string; modelo: string | null; idmarca: number | null }>();
  const marcasById = new Map<number, { id: number; descripcion: string }>();

  if (vehiculoIds.length > 0) {
    const { data: vehiculos, error: vehiculosListError } = await supabase
      .from('vehiculo')
      .select('id, patente, modelo, idmarca')
      .in('id', vehiculoIds);

    if (vehiculosListError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching vehiculos (list):', {
          message: (vehiculosListError as any)?.message,
          code: (vehiculosListError as any)?.code,
          details: (vehiculosListError as any)?.details,
          hint: (vehiculosListError as any)?.hint,
        });
      }
    } else {
      (vehiculos ?? []).forEach((v) => vehiculosById.set(v.id, v));

      const marcaIds = (vehiculos ?? [])
        .map((v) => v.idmarca)
        .filter((id): id is number => typeof id === 'number');

      if (marcaIds.length > 0) {
        const { data: marcas, error: marcasError } = await supabase
          .from('marcas')
          .select('id, descripcion')
          .in('id', marcaIds);

        if (marcasError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching marcas:', {
              message: (marcasError as any)?.message,
              code: (marcasError as any)?.code,
              details: (marcasError as any)?.details,
              hint: (marcasError as any)?.hint,
            });
          }
        } else {
          (marcas ?? []).forEach((m) => marcasById.set(m.id, m));
        }
      }
    }
  }

  const serviciosRecientes: ServicioWithRelations[] = (serviciosBase ?? []).map((s) => {
    const row = s as {
      id: number;
      fechaservicio?: string | null;
      kmservicio?: number | null;
      idvehiculo?: number | null;
    };

    const vehiculo = row.idvehiculo ? vehiculosById.get(row.idvehiculo) : undefined;
    const marca = vehiculo?.idmarca ? marcasById.get(vehiculo.idmarca) : undefined;

    return {
      Id: row.id,
      // Si el esquema todavía no tiene estas columnas, renderizamos “—/0/N/A” y no crashea
      fechaServicio: row.fechaservicio ?? '',
      kmServicio: row.kmservicio ?? 0,
      Vehiculo: vehiculo
        ? {
            patente: vehiculo.patente,
            Modelo: vehiculo.modelo,
            Marcas: marca ? { Descripcion: marca.descripcion } : null,
          }
        : null,
    };
  });

  if (process.env.NODE_ENV === 'development') {
    if (vehiculosError) console.error('Error fetching vehiculos:', vehiculosError);
    if (serviciosError) console.error('Error fetching servicios:', serviciosError);
    if (clientesError) console.error('Error fetching clientes:', clientesError);
    if (serviciosBaseError) {
      console.error(
        'Error fetching servicios recientes (base):',
        String(serviciosBaseError),
        serviciosBaseError
      );
    }
  }

  return (
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          fontFamily: 'var(--font-family-body)',
        }}
      >
        Portal de Administración
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
        }}
      >
        <Box
          sx={{
            flex: {
              xs: '1 1 100%',
              sm: '1 1 calc(50% - 12px)',
              md: '1 1 calc(33.333% - 16px)',
            },
          }}
        >
          <Card
            sx={{
              background:
                'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              boxShadow:
                '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
              transition: 'all 0.5s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow:
                  '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MotosIcon sx={{ fontSize: 48, color: 'var(--primary)', mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    {vehiculosCount || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    Vehículos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            flex: {
              xs: '1 1 100%',
              sm: '1 1 calc(50% - 12px)',
              md: '1 1 calc(33.333% - 16px)',
            },
          }}
        >
          <Card
            sx={{
              background:
                'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              boxShadow:
                '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
              transition: 'all 0.5s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow:
                  '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FichasIcon sx={{ fontSize: 48, color: 'var(--primary)', mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    {serviciosCount || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    Servicios
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            flex: {
              xs: '1 1 100%',
              sm: '1 1 calc(50% - 12px)',
              md: '1 1 calc(33.333% - 16px)',
            },
          }}
        >
          <Card
            sx={{
              background:
                'linear-gradient(135deg, rgba(139, 26, 26, 0.15) 0%, rgba(4, 0, 23, 0.9) 50%, rgba(44, 62, 80, 0.15) 100%)',
              backdropFilter: 'blur(15px)',
              border: 'none',
              boxShadow:
                '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139, 26, 26, 0.1)',
              transition: 'all 0.5s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow:
                  '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(139, 26, 26, 0.2)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ClientesIcon
                  sx={{ fontSize: 48, color: 'var(--primary)', mr: 2 }}
                />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    {clientesCount || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    Clientes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          background:
            'linear-gradient(135deg, rgba(139, 26, 26, 0.2) 0%, rgba(4, 0, 23, 0.95) 50%, rgba(44, 62, 80, 0.2) 100%)',
          backdropFilter: 'blur(15px)',
          border: 'none',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(139, 26, 26, 0.1)',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          Servicios Recientes
        </Typography>

        {serviciosRecientes && serviciosRecientes.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {serviciosRecientes.map((servicio) => {
              const servicioTyped = servicio as unknown as ServicioWithRelations;
              const fecha =
                servicioTyped.fechaServicio && servicioTyped.fechaServicio.length > 0
                  ? dayjs(servicioTyped.fechaServicio).format('DD/MM/YYYY')
                  : '—';
              const km =
                typeof servicioTyped.kmServicio === 'number' && servicioTyped.kmServicio > 0
                  ? servicioTyped.kmServicio
                  : null;

              return (
                <Box
                  key={servicioTyped.Id}
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--border-radius-md)',
                    border: '1px solid rgba(139, 26, 26, 0.2)',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-family-body)',
                      mb: 0.5,
                    }}
                  >
                    {servicioTyped.Vehiculo?.patente} -{' '}
                    {servicioTyped.Vehiculo?.Marcas?.Descripcion}{' '}
                    {servicioTyped.Vehiculo?.Modelo}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-family-body)',
                    }}
                  >
                    Fecha: {fecha}
                    {km !== null ? ` | KM: ${km}` : ''}
                    {servicioTyped.tecnico ? ` | Técnico: ${servicioTyped.tecnico}` : ''}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-family-body)',
            }}
          >
            No hay servicios registrados aún.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}


