'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import {
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataTable } from '@/utils/ui/table/DataTable';
import { supabase } from '@/lib/supabase/client';
import dayjs from '@/lib/dayjs';

interface Servicio {
  id: number;
  fechaservicio?: string | null;
  kmservicio?: number | null;
  tecnico?: string | null;
  calificacion?: number | null;
  Vehiculo: {
    patente: string;
    modelo: string;
    Marcas: {
      descripcion: string;
    };
  } | null;
}

export function ServiciosTable() {
  const router = useRouter();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      setError(null);

      // Evitar selects anidados (dependen de relaciones/FK en PostgREST)
      const { data: serviciosBase, error: fetchError } = await supabase
        .from('servicios')
        .select('*')
        .order('id', { ascending: false });

      if (fetchError) throw fetchError;

      const vehiculoIds = (serviciosBase ?? [])
        .map((s) => (s as { idvehiculo?: number | null }).idvehiculo)
        .filter((id): id is number => typeof id === 'number');

      const vehiculosById = new Map<number, { id: number; patente: string; modelo: string | null; idmarca: number | null }>();
      const marcasById = new Map<number, { id: number; descripcion: string }>();

      if (vehiculoIds.length > 0) {
        const { data: vehiculos, error: vehiculosError } = await supabase
          .from('vehiculo')
          .select('id, patente, modelo, idmarca')
          .in('id', vehiculoIds);

        if (vehiculosError) throw vehiculosError;

        (vehiculos ?? []).forEach((v) => vehiculosById.set(v.id, v));

        const marcaIds = (vehiculos ?? [])
          .map((v) => v.idmarca)
          .filter((id): id is number => typeof id === 'number');

        if (marcaIds.length > 0) {
          const { data: marcas, error: marcasError } = await supabase
            .from('marcas')
            .select('id, descripcion')
            .in('id', marcaIds);

          if (marcasError) throw marcasError;

          (marcas ?? []).forEach((m) => marcasById.set(m.id, m));
        }
      }

      const serviciosMapped: Servicio[] = (serviciosBase ?? []).map((s) => {
        const row = s as {
          id: number;
          fechaservicio?: string | null;
          kmservicio?: number | null;
          tecnico?: string | null;
          calificacion?: number | null;
          idvehiculo?: number | null;
        };

        const vehiculo = row.idvehiculo ? vehiculosById.get(row.idvehiculo) : undefined;
        const marca = vehiculo?.idmarca ? marcasById.get(vehiculo.idmarca) : undefined;

        return {
          id: row.id,
          fechaservicio: row.fechaservicio,
          kmservicio: row.kmservicio,
          tecnico: row.tecnico,
          calificacion: row.calificacion,
          Vehiculo: vehiculo
            ? {
                patente: vehiculo.patente,
                modelo: vehiculo.modelo ?? '',
                Marcas: { descripcion: marca?.descripcion ?? '' },
              }
            : null,
        };
      });

      setServicios(serviciosMapped);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Servicio>[] = [
    {
      accessorKey: 'Vehiculo.patente',
      header: 'Patente',
      cell: ({ row }) => {
        const vehiculo = row.original.Vehiculo;
        return vehiculo ? vehiculo.patente : 'N/A';
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
      accessorKey: 'tecnico',
      header: 'Técnico',
      cell: ({ row }) => {
        return row.original.tecnico || '—';
      },
    },
    {
      accessorKey: 'calificacion',
      header: 'Calificación',
      cell: ({ row }) => {
        const calificacion = row.original.calificacion;
        if (!calificacion) return 'N/A';
        return (
          <Chip
            label={`${calificacion}/5`}
            size="small"
            sx={{
              backgroundColor: calificacion >= 4 ? 'rgba(76, 175, 80, 0.2)' : calificacion >= 3 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)',
              color: calificacion >= 4 ? '#4caf50' : calificacion >= 3 ? '#ff9800' : '#f44336',
            }}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => router.push(`/admin/dashboard/servicios/${row.original.id}`)}
              sx={{
                color: 'var(--primary)',
                '&:hover': {
                  backgroundColor: 'rgba(139, 26, 26, 0.1)',
                },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => router.push(`/admin/dashboard/servicios/${row.original.id}/editar`)}
              sx={{
                color: 'var(--text-secondary)',
                '&:hover': {
                  backgroundColor: 'rgba(139, 26, 26, 0.1)',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return <DataTable columns={columns} data={servicios} searchPlaceholder="Buscar por patente, modelo, técnico..." />;
}

